<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Admin\StoreManufacturerRequest;
use App\Http\Requests\Backend\Admin\ToggleManufacturerActiveRequest;
use App\Http\Requests\Backend\Admin\UpdateManufacturerRequest;
use App\Models\Manufacturer;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminManufacturerController extends Controller
{
    use InteractsWithImages;

    private const ALLOWED_PER_PAGE = [10, 15, 20, 50, 100];

    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        if (! in_array($status, ['all', 'active', 'inactive', 'trash'], true)) {
            $status = 'all';
        }

        $query = Manufacturer::query()->withCount('products');

        if ($status === 'trash') {
            $query->onlyTrashed();
        } elseif ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        if ($needle = trim((string) $request->search)) {
            $query->where(function ($q) use ($needle) {
                $q->where('name', 'like', "%{$needle}%")
                    ->orWhere('email', 'like', "%{$needle}%")
                    ->orWhere('phone', 'like', "%{$needle}%")
                    ->orWhere('country', 'like', "%{$needle}%")
                    ->orWhere('slug', 'like', "%{$needle}%");
            });
        }

        $sort = $request->query('sort', 'name');
        if ($sort !== 'recent') {
            $query->orderBy('name');
        } else {
            $query->latest('id');
        }

        $perPage = (int) $request->query('per_page', 15);
        if (! in_array($perPage, self::ALLOWED_PER_PAGE, true)) {
            $perPage = 15;
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Catalog/Manufacturers', [
            'manufacturers' => $paginator,
            'filters'       => [
                'search'    => $request->search ?? '',
                'status'    => $status,
                'sort'      => $sort,
                'per_page'  => $perPage,
            ],
            'stats'         => [
                'total'     => Manufacturer::query()->count(),
                'active'    => Manufacturer::query()->where('is_active', true)->count(),
                'inactive'  => Manufacturer::query()->where('is_active', false)->count(),
                'trashed'   => Manufacturer::onlyTrashed()->count(),
                'products'  => Product::query()->whereNotNull('manufacturer_id')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Catalog/ManufacturerForm', [
            'mode'          => 'create',
            'manufacturer'  => null,
        ]);
    }

    public function store(StoreManufacturerRequest $request): RedirectResponse
    {
        $data = collect($request->validated())->except(['logo'])->all();
        $data['is_active'] = $request->boolean('is_active', true);

        if (! empty(trim((string) ($data['slug'] ?? '')))) {
            $data['slug'] = Str::slug((string) $data['slug']);
        } else {
            unset($data['slug']);
        }

        $manufacturer = Manufacturer::create($data);

        $this->persistImages($request, $manufacturer);

        return redirect()->route('admin.catalog.manufacturers.edit', $manufacturer)->with('success', 'Manufacturer created.');
    }

    public function show(Manufacturer $manufacturer): Response
    {
        abort_if($manufacturer->trashed(), 404);

        return Inertia::render('Admin/Catalog/ManufacturerShow', [
            'manufacturer' => $this->manufacturerPayload($manufacturer),
        ]);
    }

    public function edit(Manufacturer $manufacturer): Response
    {
        abort_if($manufacturer->trashed(), 404);

        return Inertia::render('Admin/Catalog/ManufacturerForm', [
            'mode'          => 'edit',
            'manufacturer'  => $this->manufacturerPayload($manufacturer),
        ]);
    }

    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer): RedirectResponse
    {
        abort_if($manufacturer->trashed(), 404);

        $data = collect($request->validated())->except(['logo'])->all();
        $data['is_active'] = $request->boolean('is_active', $manufacturer->is_active);

        if (! empty(trim((string) ($data['slug'] ?? '')))) {
            $data['slug'] = Str::slug((string) $data['slug']);
        } else {
            unset($data['slug']);
        }

        $manufacturer->update($data);

        $this->persistImages($request, $manufacturer);

        return redirect()->route('admin.catalog.manufacturers.edit', $manufacturer)->with('success', 'Manufacturer updated.');
    }

    public function toggleActive(ToggleManufacturerActiveRequest $request, Manufacturer $manufacturer): RedirectResponse
    {
        abort_if($manufacturer->trashed(), 404);

        $manufacturer->update(['is_active' => ! $manufacturer->is_active]);

        return back()->with(
            'success',
            $manufacturer->fresh()->is_active ? 'Manufacturer activated.' : 'Manufacturer deactivated.',
        );
    }

    public function destroy(Manufacturer $manufacturer): RedirectResponse
    {
        $manufacturer->delete();

        return back()->with('success', 'Manufacturer moved to trash.');
    }

    public function restore(int $id): RedirectResponse
    {
        $m = Manufacturer::onlyTrashed()->findOrFail($id);
        $m->restore();

        return back()->with('success', 'Manufacturer restored.');
    }

    public function forceDestroy(int $id): RedirectResponse
    {
        $m = Manufacturer::onlyTrashed()->findOrFail($id);

        $this->deleteImage($m->logo);

        $m->forceDelete();

        return back()->with('success', 'Manufacturer erased permanently.');
    }

    private function persistImages(Request $request, Manufacturer $manufacturer): void
    {
        $changed = false;

        if ($request->hasFile('logo')) {
            $this->deleteImage($manufacturer->logo);
            $manufacturer->logo = $this->storeImage($request->file('logo'), 'manufacturers');
            $changed = true;
        }

        if ($changed) {
            $manufacturer->save();
        }
    }

    /** @return array<string, mixed> */
    private function manufacturerPayload(Manufacturer $m): array
    {
        $m->loadCount('products');

        return [
            'id'              => $m->id,
            'name'            => $m->name,
            'slug'            => $m->slug,
            'is_active'       => $m->is_active,
            'url'             => $m->url ?? '',
            'country'         => $m->country ?? '',
            'email'           => $m->email ?? '',
            'phone'           => $m->phone ?? '',
            'description'     => $m->description ?? '',
            'logo'            => $m->logo ?? '',
            'logo_url'        => $m->imageUrl($m->logo),
            'products_count'  => $m->products_count,
            'created_at_fmt'  => $m->created_at?->format('M j, Y g:i A') ?? '',
            'deleted_at_iso'  => $m->deleted_at?->toIso8601String(),
        ];
    }
}
