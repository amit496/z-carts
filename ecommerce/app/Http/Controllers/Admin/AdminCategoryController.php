<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Admin\StoreCatalogCategoryRequest;
use App\Http\Requests\Backend\Admin\StoreCategoryGroupRequest;
use App\Http\Requests\Backend\Admin\StoreCategorySubGroupRequest;
use App\Http\Requests\Backend\Admin\UpdateCatalogCategoryRequest;
use App\Http\Requests\Backend\Admin\UpdateCategoryGroupRequest;
use App\Http\Requests\Backend\Admin\UpdateCategorySubGroupRequest;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    use InteractsWithImages;

    private function stats()
    {
        return [
            'total'    => Category::count(),
            'roots'    => Category::whereNull('parent_id')->count(),
            'children' => Category::whereNotNull('parent_id')->count(),
        ];
    }

    /** Categories shown on catalog CRUD — direct children of sub-groups only. */
    protected function leafCategoryBaseQuery(): Builder
    {
        return Category::query()->whereHas('parent', function ($q) {
            $q->whereNotNull('parent_id')->whereHas('parent', fn ($gq) => $gq->whereNull('parent_id'));
        });
    }

    protected function assertIsSubGroup(Category $category): void
    {
        $category->loadMissing('parent');
        abort_unless(
            $category->parent_id
            && $category->parent
            && $category->parent->parent_id === null,
            404
        );
    }

    protected function assertCatalogLeaf(Category $category): void
    {
        $category->loadMissing('parent.parent');
        $p = $category->parent;
        abort_unless(
            $p
            && $p->parent_id
            && $p->parent
            && $p->parent->parent_id === null,
            404
        );
    }

    public function index(Request $request)
    {
        $q = $this->leafCategoryBaseQuery()
            ->with([
                'parent' => fn ($rel) => $rel->select('id', 'name', 'parent_id')->with(['parent:id,name']),
            ])
            ->withCount(['products', 'children']);

        if ($request->filled('search')) {
            $s = '%'.trim((string) $request->input('search')).'%';
            $q->where(fn ($qq) => $qq->where('categories.name', 'like', $s)->orWhere('categories.slug', 'like', $s));
        }

        $categories = $q->orderBy('order')->orderBy('name')->paginate(15)->withQueryString();

        $subGroups = Category::query()
            ->select('id', 'name', 'parent_id')
            ->whereHas('parent', fn ($pq) => $pq->whereNull('parent_id'))
            ->with(['parent:id,name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories'   => $categories,
            'subGroups'    => $subGroups,
            'stats'        => $this->stats(),
            'filters'      => ['search' => $request->input('search')],
            'catalogStats' => [
                'total'    => $this->leafCategoryBaseQuery()->count(),
                'featured' => $this->leafCategoryBaseQuery()->where('is_featured', true)->count(),
            ],
        ]);
    }

    public function groups()
    {
        $groups = Category::whereNull('parent_id')
            ->withCount('children')
            ->orderBy('order')
            ->paginate(20);

        return Inertia::render('Admin/Categories/Groups', [
            'groups' => $groups,
            'stats'  => $this->stats(),
        ]);
    }

    public function subGroups()
    {
        $subGroups = Category::query()
            ->whereNotNull('parent_id')
            ->whereHas('parent', fn ($q) => $q->whereNull('parent_id'))
            ->with('parent')
            ->withCount('children')
            ->orderBy('order')
            ->paginate(20);

        $roots = Category::whereNull('parent_id')->orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Categories/SubGroups', [
            'subGroups' => $subGroups,
            'roots'     => $roots,
            'stats'     => $this->stats(),
        ]);
    }

    public function storeGroup(StoreCategoryGroupRequest $request)
    {
        $data = $request->only('name','icon','order','active','description','meta_title','meta_description');
        $data['slug']      = $request->slug ?: Str::slug($request->name);
        $data['parent_id'] = null;
        $data['order']     = $request->order ?? 99;
        $data['active']    = $request->boolean('active', true);

        if ($request->hasFile('image'))       $data['image']       = $this->storeImage($request->file('image'), 'categories');
        if ($request->hasFile('cover_image')) $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        if ($request->hasFile('icon_image'))  $data['icon_image']  = $this->storeImage($request->file('icon_image'), 'categories');

        Category::create($data);
        return back()->with('success', 'Category group created!');
    }

    public function updateGroup(UpdateCategoryGroupRequest $request, Category $category)
    {
        abort_unless($category->parent_id === null, 404);

        $data = $request->only('name','icon','order','active','description','meta_title','meta_description');
        if ($request->slug) $data['slug'] = $request->slug;

        if ($request->hasFile('image')) {
            $data['image'] = $this->replaceImage($category->image, $request->file('image'), 'categories');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($category->cover_image, $request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('icon_image')) {
            $data['icon_image'] = $this->replaceImage($category->icon_image, $request->file('icon_image'), 'categories');
        }

        $category->update($data);
        return back()->with('success', 'Category group updated!');
    }

    public function destroyGroup(Category $category)
    {
        abort_unless($category->parent_id === null, 404);

        $category->delete();
        return back()->with('success', 'Category group deleted.');
    }

    public function storeSubGroup(StoreCategorySubGroupRequest $request)
    {
        $data = $request->validated();
        unset($data['cover_image']);
        $data['active'] = $request->boolean('active', true);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Sub-group created!');
    }

    public function updateSubGroup(UpdateCategorySubGroupRequest $request, Category $category)
    {
        $this->assertIsSubGroup($category);

        $data = $request->validated();
        unset($data['cover_image']);
        $data['active'] = $request->boolean('active', true);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($category->cover_image, $request->file('cover_image'), 'categories');
        }

        $category->update($data);

        return back()->with('success', 'Sub-group updated!');
    }

    public function destroySubGroup(Category $category)
    {
        $this->assertIsSubGroup($category);

        $category->delete();

        return back()->with('success', 'Sub-group deleted.');
    }

    public function storeCatalogCategory(StoreCatalogCategoryRequest $request)
    {
        $data = $request->validated();
        unset($data['cover_image'], $data['image']);
        $data['active']       = $request->boolean('active', true);
        $data['is_featured']  = $request->boolean('is_featured', false);
        $data['order']         = $data['order'] ?? 100;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Category created!');
    }

    public function updateCatalogCategory(UpdateCatalogCategoryRequest $request, Category $category)
    {
        $this->assertCatalogLeaf($category);

        $data = $request->validated();
        unset($data['cover_image'], $data['image']);
        $data['active']       = $request->boolean('active', true);
        $data['is_featured']  = $request->boolean('is_featured', false);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($category->cover_image, $request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('image')) {
            $data['image'] = $this->replaceImage($category->image, $request->file('image'), 'categories');
        }

        $category->update($data);

        return back()->with('success', 'Category updated!');
    }

    public function destroyCatalogCategory(Category $category)
    {
        $this->assertCatalogLeaf($category);

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
