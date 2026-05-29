<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Admin\BulkDestroyCatalogAttributesRequest;
use App\Http\Requests\Backend\Admin\StoreCatalogAttributeRequest;
use App\Http\Requests\Backend\Admin\StoreCatalogAttributeValueRequest;
use App\Http\Requests\Backend\Admin\UpdateCatalogAttributeRequest;
use App\Http\Requests\Backend\Admin\UpdateCatalogAttributeValueRequest;
use App\Models\CatalogAttribute;
use App\Models\CatalogAttributeValue;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminAttributeController extends Controller
{
    use InteractsWithImages;

    public function index(): Response
    {
        return Inertia::render('Admin/Catalog/Attributes', [
            'attributes'      => $this->attributePayload(),
            'categoryOptions' => $this->categoryOptions(),
        ]);
    }

    public function store(StoreCatalogAttributeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);

        $data['slug'] = $this->uniqueAttributeSlug($data['name']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $attribute = CatalogAttribute::query()->create($data);
        $attribute->categories()->sync($categoryIds);

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute created.');
    }

    public function update(UpdateCatalogAttributeRequest $request, CatalogAttribute $catalogAttribute): RedirectResponse
    {
        $data = $request->validated();
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);

        $data['sort_order'] = $data['sort_order'] ?? 0;

        if ($catalogAttribute->name !== $data['name']) {
            $data['slug'] = $this->uniqueAttributeSlug($data['name'], $catalogAttribute->id);
        }

        $catalogAttribute->update($data);
        $catalogAttribute->categories()->sync($categoryIds);

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute updated.');
    }

    public function destroy(CatalogAttribute $catalogAttribute): RedirectResponse
    {
        $catalogAttribute->load('values');

        foreach ($catalogAttribute->values as $value) {
            $this->deleteImage($value->image);
        }

        $catalogAttribute->categories()->detach();
        $catalogAttribute->delete();

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute deleted.');
    }

    public function bulkDestroy(BulkDestroyCatalogAttributesRequest $request): RedirectResponse
    {
        $ids = $request->validated()['ids'];

        $attributes = CatalogAttribute::query()
            ->with('values')
            ->whereIn('id', $ids)
            ->get();

        foreach ($attributes as $catalogAttribute) {
            foreach ($catalogAttribute->values as $value) {
                $this->deleteImage($value->image);
            }
            $catalogAttribute->categories()->detach();
            $catalogAttribute->delete();
        }

        return redirect()->route('admin.catalog.attributes')->with(
            'success',
            sprintf('%d attributes deleted.', $attributes->count())
        );
    }

    public function storeValue(
        StoreCatalogAttributeValueRequest $request,
        CatalogAttribute $catalogAttribute
    ): RedirectResponse {
        $data = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->storeImage($request->file('image'), 'catalog-attribute-values');
        }

        $catalogAttribute->values()->create([
            'value' => $data['value'],
            'sort_order' => $data['sort_order'] ?? 0,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute value saved.');
    }

    public function updateValue(
        UpdateCatalogAttributeValueRequest $request,
        CatalogAttributeValue $catalogAttributeValue
    ): RedirectResponse {
        $data = $request->validated();
        $attrs = [
            'value' => $data['value'],
            'sort_order' => $data['sort_order'] ?? $catalogAttributeValue->sort_order,
        ];

        if ($request->hasFile('image')) {
            $attrs['image'] = $this->replaceImage($catalogAttributeValue->image, $request->file('image'), 'catalog-attribute-values');
        }

        $catalogAttributeValue->update($attrs);

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute value updated.');
    }

    public function destroyValue(CatalogAttributeValue $catalogAttributeValue): RedirectResponse
    {
        $this->deleteImage($catalogAttributeValue->image);
        $catalogAttributeValue->delete();

        return redirect()->route('admin.catalog.attributes')->with('success', 'Attribute value deleted.');
    }

    /** @return list<array{id: int, label: string}> */
    private function categoryOptions(): array
    {
        return Category::query()
            ->with('parent.parent.parent')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
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

    /** @return list<mixed> */
    private function attributePayload(): array
    {
        return CatalogAttribute::query()
            ->with(['categories:id,name'])
            ->with(['values' => fn ($q) => $q->orderBy('sort_order')->orderBy('id')])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function (CatalogAttribute $a) {
                return [
                    'id' => $a->id,
                    'name' => $a->name,
                    'type' => $a->type,
                    'sort_order' => $a->sort_order,
                    'categories_count' => $a->categories->count(),
                    'values_count' => $a->values->count(),
                    'category_ids' => $a->categories->pluck('id')->values()->all(),
                    'categories' => $a->categories->map(fn (Category $c) => ['id' => $c->id, 'name' => $c->name])->values()->all(),
                    'values' => $a->values->map(fn (CatalogAttributeValue $v) => [
                        'id' => $v->id,
                        'catalog_attribute_id' => $v->catalog_attribute_id,
                        'value' => $v->value,
                        'sort_order' => $v->sort_order,
                        'image' => $v->image,
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();
    }

    private function uniqueAttributeSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name);
        $base = $base !== '' ? $base : 'attribute';
        $slug = $base;
        $i = 2;

        while (CatalogAttribute::query()
            ->where('slug', $slug)
            ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
