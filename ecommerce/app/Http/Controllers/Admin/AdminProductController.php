<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Admin\StoreAdminProductRequest;
use App\Http\Requests\Backend\Admin\UpdateAdminProductRequest;
use App\Models\Category;
use App\Models\FlashSale;
use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    use InteractsWithImages;

    public function index(Request $request): Response
    {
        $query = Product::with('store.user', 'category', 'categories', 'images', 'flashSale')->withCount('variants');

        if ($request->filled('search')) {
            $needle = trim((string) $request->search);
            $searchIn = $request->query('search_in', 'all');
            $allowedSearchIn = ['all', 'name', 'brand', 'gtin'];
            if (! in_array($searchIn, $allowedSearchIn, true)) {
                $searchIn = 'all';
            }
            $query->where(function ($q) use ($needle, $searchIn) {
                if ($searchIn === 'name') {
                    $q->where('name', 'like', "%{$needle}%");
                } elseif ($searchIn === 'brand') {
                    $q->where('brand', 'like', "%{$needle}%");
                } elseif ($searchIn === 'gtin') {
                    $q->where(function ($qq) use ($needle) {
                        $qq->where('gtin', 'like', "%{$needle}%")
                            ->orWhere('mpn', 'like', "%{$needle}%");
                    });
                } else {
                    $q->where('name', 'like', "%{$needle}%")
                        ->orWhere('brand', 'like', "%{$needle}%")
                        ->orWhere('gtin', 'like', "%{$needle}%")
                        ->orWhere('mpn', 'like', "%{$needle}%");
                }
            });
        }
        if ($request->filled('category')) {
            $query->where(function ($q) use ($request) {
                $q->where('category_id', $request->category)
                    ->orWhereHas('categories', fn ($c) => $c->where('categories.id', $request->category));
            });
        }
        if ($request->filled('store')) {
            $storeId = (int) $request->store;
            if ($storeId > 0) {
                $query->where('store_id', $storeId);
            }
        }
        if ($request->filled('manufacturer')) {
            $manufacturerId = (int) $request->manufacturer;
            if ($manufacturerId > 0 && Manufacturer::query()->whereKey($manufacturerId)->exists()) {
                $query->where('manufacturer_id', $manufacturerId);
            }
        }
        if ($request->filled('product_type')) {
            $allowedTypes = ['physical', 'digital', 'service'];
            if (in_array($request->product_type, $allowedTypes, true)) {
                $query->where('product_type', $request->product_type);
            }
        }

        $isTrash = $request->status === 'trash';
        if ($isTrash) {
            $query->onlyTrashed();
        } elseif ($request->status === 'active') {
            $query->where('is_active', true);
        } elseif ($request->status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($request->status === 'featured') {
            $query->where('is_featured', true);
        } elseif ($request->status === 'low_stock') {
            $query->where('stock', '<=', 5);
        }

        $sort = $request->query('sort', 'latest');
        $allowedSorts = ['latest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc', 'stock_low'];
        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'latest';
        }
        match ($sort) {
            'oldest' => $query->oldest(),
            'price_asc' => $query->orderBy('price')->orderByDesc('id'),
            'price_desc' => $query->orderByDesc('price')->orderByDesc('id'),
            'name_asc' => $query->orderBy('name')->orderBy('id'),
            'name_desc' => $query->orderByDesc('name')->orderByDesc('id'),
            'stock_low' => $query->orderBy('stock')->orderBy('id'),
            default => $query->latest(),
        };

        $allowedPerPage = [10, 15, 20, 50, 100];
        $perPage = (int) $request->query('per_page', 20);
        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 20;
        }

        $products = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters'  => [
                ...$request->only('search', 'category', 'status', 'store', 'manufacturer', 'product_type', 'sort', 'search_in'),
                'per_page' => $perPage,
            ],
            'filterCategories' => $this->categoryOptions(),
            'filterStores'     => $this->storesList(),
            'filterManufacturers' => $this->manufacturerOptions(),
            'stats'            => [
                'total'      => Product::count(),
                'active'     => Product::where('is_active', true)->count(),
                'inactive'   => Product::where('is_active', false)->count(),
                'featured'   => Product::where('is_featured', true)->count(),
                'low_stock'  => Product::where('stock', '<=', 5)->count(),
                'trashed'    => Product::onlyTrashed()->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/ProductForm', [
            'mode'             => 'create',
            'product'          => null,
            'stores'           => $this->storesList(),
            'categoryOptions'  => $this->categoryOptions(),
            'manufacturerOptions'=> $this->manufacturerOptions(),
        ]);
    }

    public function show(int $product): Response
    {
        $p = Product::query()
            ->withTrashed()
            ->with([
                'store.user',
                'category' => fn ($q) => $q->with('parent.parent.parent'),
                'categories' => fn ($q) => $q->with('parent.parent.parent'),
                'images',
                'variants',
                'reviews' => fn ($q) => $q->with('user:id,name')->latest()->limit(20),
            ])
            ->findOrFail($product);

        return Inertia::render('Admin/Products/Show', [
            'product' => $this->adminProductDetailPayload($p),
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['store', 'category', 'categories', 'images', 'variants']);

        return Inertia::render('Admin/Products/ProductForm', [
            'mode'              => 'edit',
            'product'           => $this->productPayload($product),
            'stores'            => $this->storesList(),
            'categoryOptions'   => $this->categoryOptions(),
            'manufacturerOptions'=> $this->manufacturerOptions(),
        ]);
    }

    public function store(StoreAdminProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'];
        unset($data['category_ids'], $data['primary_image'], $data['gallery'], $data['variants_json'], $data['slug']);

        $this->normalizeProductManufacturer($data);

        $variants = $this->decodeVariants($request);

        $data['requires_shipping'] = $request->boolean('requires_shipping');
        if ($data['product_type'] === 'digital') {
            $data['requires_shipping'] = false;
        }

        $data['category_id'] = $categoryIds[0];

        $data['slug'] = $request->filled('slug')
            ? Str::slug($request->string('slug'))
            : Str::slug($request->string('name')).'-'.Str::random(6);
        while (Product::withTrashed()->where('slug', $data['slug'])->exists()) {
            $data['slug'] = Str::slug($request->string('name')).'-'.Str::random(8);
        }

        $product = Product::query()->create($data);
        $product->categories()->sync($categoryIds);

        $this->persistNewImages($product, $request);
        $this->normalizePrimaryImage($product);
        $this->syncVariantsQuiet($product, $variants);

        return redirect()->route('admin.products.edit', $product)->with('success', 'Product created.');
    }

    public function update(UpdateAdminProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'];
        unset(
            $data['category_ids'],
            $data['primary_image'],
            $data['gallery'],
            $data['variants_json'],
            $data['remove_image_ids']
        );

        $variants = $this->decodeVariants($request);

        $data['requires_shipping'] = $request->boolean('requires_shipping');
        if (($data['product_type'] ?? $product->product_type) === 'digital') {
            $data['requires_shipping'] = false;
        }

        $this->normalizeProductManufacturer($data);

        $data['category_id'] = $categoryIds[0];

        $slugIncoming = $request->input('slug');
        if (is_string($slugIncoming) && $slugIncoming !== '') {
            $data['slug'] = Str::slug($slugIncoming);
        } elseif ($product->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']).'-'.Str::random(6);
            while (Product::withTrashed()->where('slug', $data['slug'])->where('id', '!=', $product->id)->exists()) {
                $data['slug'] = Str::slug($data['name']).'-'.Str::random(8);
            }
        }

        $product->update($data);
        $product->categories()->sync($categoryIds);

        $this->removeImages($product, $request->input('remove_image_ids', []));
        $this->persistNewImages($product, $request);
        $this->normalizePrimaryImage($product);
        $this->syncVariantsQuiet($product, $variants);

        return redirect()->route('admin.products.edit', $product)->with('success', 'Product updated.');
    }

    public function toggleActive(Product $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        return back();
    }

    public function toggleFeatured(Product $product): RedirectResponse
    {
        $product->update(['is_featured' => ! $product->is_featured]);

        return back();
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete(); // Soft delete — keep images for restore.

        return back()->with('success', 'Product moved to trash.');
    }

    public function restore(int $id): RedirectResponse
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return back()->with('success', 'Product restored to the catalog.');
    }

    public function forceDestroy(int $id): RedirectResponse
    {
        $product = Product::onlyTrashed()->with('images')->findOrFail($id);

        if ($product->orderItems()->exists()) {
            return back()->with(
                'error',
                'Cannot permanently delete — this product is linked to orders. Restore it instead or keep it in trash.',
            );
        }

        foreach ($product->images as $img) {
            $this->deleteImage($img->image);
        }

        $product->forceDelete();

        return back()->with('success', 'Product permanently removed.');
    }

    private function removeImages(Product $product, array $rawIds): void
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $rawIds))));
        if ($ids === []) {
            return;
        }

        $images = ProductImage::query()->where('product_id', $product->id)->whereIn('id', $ids)->get();

        foreach ($images as $img) {
            $this->deleteImage($img->image);
            $img->delete();
        }
    }

    private function persistNewImages(Product $product, Request $request): void
    {
        $maxSort = (int) ProductImage::query()->where('product_id', $product->id)->max('sort_order');

        if ($request->hasFile('primary_image')) {
            $oldPrimary = ProductImage::query()->where('product_id', $product->id)->where('is_primary', true)->get();
            foreach ($oldPrimary as $o) {
                $this->deleteImage($o->image);
                $o->delete();
            }
            ProductImage::query()->where('product_id', $product->id)->update(['is_primary' => false]);
            $path = $this->storeImage($request->file('primary_image'), 'products');
            ProductImage::query()->create([
                'product_id'  => $product->id,
                'image'       => $path,
                'is_primary'  => true,
                'sort_order'  => 0,
            ]);
            $maxSort = (int) ProductImage::query()->where('product_id', $product->id)->max('sort_order');
        }

        $gallery = $request->file('gallery', []) ?: [];
        foreach ($gallery as $i => $file) {
            if (! $file) {
                continue;
            }
            $path = $this->storeImage($file, 'products');
            ProductImage::query()->create([
                'product_id'  => $product->id,
                'image'       => $path,
                'is_primary'  => false,
                'sort_order'  => ++$maxSort + $i,
            ]);
        }
    }

    private function normalizePrimaryImage(Product $product): void
    {
        $product->load('images');
        if ($product->images->where('is_primary', true)->isNotEmpty()) {
            return;
        }
        $first = $product->images->sortBy('sort_order')->first();
        if ($first) {
            ProductImage::query()->where('product_id', $product->id)->update(['is_primary' => false]);
            $first->update(['is_primary' => true, 'sort_order' => 0]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function decodeVariants(Request $request): array
    {
        $raw = $request->input('variants_json', '[]');
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
        } else {
            $decoded = $raw;
        }

        return is_array($decoded) ? $decoded : [];
    }

    private function variantRowHasData(array $row): bool
    {
        if (! empty($row['id'])) {
            return true;
        }
        foreach (['size', 'color', 'sku'] as $f) {
            $v = trim((string) ($row[$f] ?? ''));
            if ($v !== '') {
                return true;
            }
        }

        return (int) ($row['stock'] ?? 0) !== 0
            || abs((float) ($row['price_adjustment'] ?? 0)) > 0.000001;
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    private function syncVariantsQuiet(Product $product, array $rows): void
    {
        $rows = array_values(array_filter($rows, 'is_array'));
        $rows = array_values(array_filter($rows, fn ($row) => $this->variantRowHasData($row)));
        $kept = [];

        foreach ($rows as $row) {
            $payload = [
                'size'               => filled($row['size'] ?? null) ? (string) $row['size'] : null,
                'color'              => filled($row['color'] ?? null) ? (string) $row['color'] : null,
                'color_hex'          => filled($row['color_hex'] ?? null) ? (string) $row['color_hex'] : null,
                'stock'              => (int) ($row['stock'] ?? 0),
                'price_adjustment'   => (float) ($row['price_adjustment'] ?? 0),
                'sku'                => filled($row['sku'] ?? null) ? (string) $row['sku'] : null,
            ];

            if (! empty($row['id'])) {
                $v = ProductVariant::query()
                    ->where('product_id', $product->id)
                    ->where('id', (int) $row['id'])
                    ->first();
                if ($v) {
                    if ($payload['sku'] && ProductVariant::query()
                        ->where('sku', $payload['sku'])
                        ->where('id', '!=', $v->id)
                        ->exists()) {
                        throw ValidationException::withMessages(['variants_json' => 'Duplicate SKU '.$payload['sku']]);
                    }
                    $v->update($payload);
                    $kept[] = $v->id;

                    continue;
                }
            }

            if ($payload['sku'] && ProductVariant::query()->where('sku', $payload['sku'])->exists()) {
                throw ValidationException::withMessages(['variants_json' => 'SKU already used: '.$payload['sku']]);
            }

            $nv = $product->variants()->create($payload);
            $kept[] = $nv->id;
        }

        ProductVariant::query()
            ->where('product_id', $product->id)
            ->whereNotIn('id', $kept)
            ->delete();
    }

    /** @return list<array{id: int, name: string}> */
    private function storesList(): array
    {
        return Store::query()
            ->where('status', 'approved')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Store $s) => ['id' => $s->id, 'name' => $s->name])
            ->values()
            ->all();
    }

    /** @return list<array{id: int, name: string}> */
    private function manufacturerOptions(): array
    {
        return Manufacturer::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Manufacturer $m) => ['id' => $m->id, 'name' => $m->name])
            ->values()
            ->all();
    }

    /** Sync catalog manufacturer row with storefront brand label. */
    private function normalizeProductManufacturer(array &$data): void
    {
        $mid = isset($data['manufacturer_id']) ? (int) $data['manufacturer_id'] : 0;

        if ($mid > 0) {
            $m = Manufacturer::query()->find($mid);
            if ($m) {
                $data['manufacturer_id'] = $m->id;
                $data['brand'] = $m->name;

                return;
            }
        }

        unset($data['manufacturer_id']);
    }

    /** @return list<array{id: int, label: string}> */
    private function categoryOptions(): array
    {
        return Category::query()
            ->with('parent.parent.parent')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $c) => [
                'id'    => $c->id,
                'label' => $this->categoryPathLabel($c),
            ])
            ->values()
            ->all();
    }

    private function categoryPathLabel(Category $c): string
    {
        $parts = [];

        while ($c) {
            array_unshift($parts, $c->name);
            $c = $c->parent;
        }

        return implode(' › ', $parts);
    }

    /** @return array<string, mixed> */
    private function adminProductDetailPayload(Product $p): array
    {
        $p->loadMissing(['categories.parent.parent.parent', 'category.parent.parent.parent']);

        $row = $this->productPayload($p);

        $row['rating'] = (string) $p->rating;
        $row['reviews_count'] = (int) $p->reviews_count;

        $row['store_detail'] = $p->store
            ? [
                'id'          => $p->store->id,
                'name'        => $p->store->name,
                'owner_name'  => $p->store->user?->name,
            ]
            : null;

        $row['categories'] = $p->categories
            ->map(fn (Category $c) => [
                'id'   => $c->id,
                'name' => $c->name,
                'path' => $this->categoryPathLabel($c),
            ])
            ->values()
            ->all();

        $row['primary_category'] = null;
        if ($p->category) {
            $row['primary_category'] = [
                'id'   => $p->category->id,
                'name' => $p->category->name,
                'path' => $this->categoryPathLabel($p->category),
            ];
        }

        $flash = FlashSale::query()->where('product_id', $p->id)->orderByDesc('id')->first();
        $row['flash_sale_detail'] = $flash
            ? [
                'sale_price' => (string) $flash->sale_price,
                'starts_at'  => $flash->starts_at?->toIso8601String(),
                'ends_at'    => $flash->ends_at?->toIso8601String(),
                'is_active'  => (bool) $flash->is_active,
                'quantity'   => (int) $flash->quantity,
                'sold'       => (int) $flash->sold,
                'remaining'  => max(0, $flash->quantity - $flash->sold),
            ]
            : null;

        $row['deleted_at_iso'] = $p->deleted_at?->toIso8601String();

        $reviews = $p->relationLoaded('reviews') ? $p->reviews : collect();
        $row['reviews_preview'] = $reviews
            ->map(fn ($r) => [
                'id'           => $r->id,
                'rating'       => (int) $r->rating,
                'comment'      => $r->comment ?? '',
                'is_verified'  => (bool) $r->is_verified,
                'buyer_name'   => $r->user?->name ?? 'Customer',
                'created_at_f' => $r->created_at?->format('M j, Y g:i A') ?? '',
            ])
            ->values()
            ->all();

        foreach ($row['variants'] as $i => $v) {
            $adj = (float) ($v['price_adjustment'] ?? 0);
            $base = (float) $row['price'];
            $row['variants'][$i]['unit_price_formatted'] = number_format(round($base + $adj, 2), 2);
        }

        return $row;
    }

    /** @return array<string, mixed> */
    private function productPayload(Product $p): array
    {
        $catIds = $p->categories->pluck('id')->values()->all();
        if ($p->category_id && ! in_array($p->category_id, $catIds, true)) {
            $catIds[] = $p->category_id;
        }

        return [
            'id'                   => $p->id,
            'store_id'             => $p->store_id,
            'slug'                 => $p->slug,
            'name'                 => $p->name,
            'description'          => $p->description ?? '',
            'price'                => (string) $p->price,
            'compare_price'        => $p->compare_price !== null ? (string) $p->compare_price : '',
            'brand'                => $p->brand ?? '',
            'manufacturer_id'      => $p->manufacturer_id,
            'manufacturer'         => $p->manufacturer ?? '',
            'material'             => $p->material ?? '',
            'gender'               => $p->gender ?? '',
            'stock'                => $p->stock,
            'is_featured'          => $p->is_featured,
            'is_active'            => $p->is_active,
            'product_type'         => $p->product_type ?? 'physical',
            'requires_shipping'    => (bool) ($p->requires_shipping ?? true),
            'model_number'         => $p->model_number ?? '',
            'gtin'                 => $p->gtin ?? '',
            'mpn'                  => $p->mpn ?? '',
            'origin_country'       => $p->origin_country ?? '',
            'meta_title'           => $p->meta_title ?? '',
            'meta_description'     => $p->meta_description ?? '',
            'available_from'       => $p->available_from?->format('Y-m-d') ?? '',
            'category_ids'         => array_values(array_unique($catIds)),
            'categories'           => $p->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values()->all(),
            'created_at_formatted' => $p->created_at?->format('M j, Y') ?? '',
            'updated_at_formatted' => $p->updated_at?->format('D, M j, Y g:i A') ?? '',
            'images'               => $p->images->map(fn (ProductImage $im) => [
                'id'           => $im->id,
                'image'        => $im->image,
                'url'          => $im->image && str_starts_with($im->image, 'http') ? $im->image : ($im->image ? asset('storage/'.$im->image) : null),
                'is_primary'   => $im->is_primary,
                'sort_order'   => $im->sort_order,
            ])->values()->all(),
            'variants'             => $p->variants->map(fn (ProductVariant $v) => [
                'id'                 => $v->id,
                'size'               => $v->size ?? '',
                'color'              => $v->color ?? '',
                'color_hex'          => $v->color_hex ?? '',
                'stock'              => $v->stock,
                'price_adjustment'   => (string) $v->price_adjustment,
                'sku'                => $v->sku ?? '',
            ])->values()->all(),
            'variants_count'       => $p->variants->count(),
        ];
    }
}
