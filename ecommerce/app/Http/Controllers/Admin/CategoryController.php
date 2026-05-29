<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Requests\Validations\CreateCategoryRequest;
use App\Http\Requests\Validations\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use InteractsWithImages;

    protected function leafCategoryBaseQuery(): Builder
    {
        return Category::query()->whereHas('parent', function ($q) {
            $q->whereNotNull('parent_id')->whereHas('parent', fn ($gq) => $gq->whereNull('parent_id'));
        });
    }

    public function index(Request $request)
    {
        $q = $this->leafCategoryBaseQuery()
            ->with([
                'parent' => fn ($rel) => $rel->select('id', 'name', 'parent_id')->with(['parent:id,name']),
            ])
            ->withCount(['products', 'children']);

        if ($request->filled('search')) {
            $s = '%' . trim((string) $request->input('search')) . '%';
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
            'categories' => $categories,
            'subGroups' => $subGroups,
            'stats' => $this->stats(),
            'filters' => ['search' => $request->input('search')],
            'catalogStats' => [
                'total' => $this->leafCategoryBaseQuery()->count(),
                'featured' => $this->leafCategoryBaseQuery()->where('is_featured', true)->count(),
            ],
        ]);
    }

    public function store(CreateCategoryRequest $request)
    {
        $data = $request->validated();
        $data['active'] = $request->boolean('active', true);
        $data['is_featured'] = $request->boolean('is_featured', false);
        $data['order'] = $data['order'] ?? 100;

        unset($data['cover_image'], $data['image']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Category created!');
    }

    public function edit(Category $category)
    {
        $this->assertCatalogLeaf($category);

        return back()->with('editing', $category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->assertCatalogLeaf($category);

        $data = $request->validated();
        $data['active'] = $request->boolean('active', true);
        $data['is_featured'] = $request->boolean('is_featured', false);

        unset($data['cover_image'], $data['image']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($category->cover_image, $request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('image')) {
            $data['image'] = $this->replaceImage($category->image, $request->file('image'), 'categories');
        }

        $category->update($data);

        return back()->with('success', 'Category updated!');
    }

    public function trash(Request $request, Category $category)
    {
        $this->assertCatalogLeaf($category);

        if ($category->products()->count()) {
            return back()->with('error', 'Cannot trash category with associated products.');
        }

        $category->delete();

        return back()->with('success', 'Category trashed!');
    }

    public function restore(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Category restored!');
    }

    public function destroy(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Category deleted permanently!');
    }

    public function massTrash(Request $request)
    {
        Category::whereIn('id', $request->ids)->delete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Categories trashed!']);
        }

        return back()->with('success', 'Categories trashed!');
    }

    public function massDestroy(Request $request)
    {
        Category::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Categories deleted!']);
        }

        return back()->with('success', 'Categories deleted!');
    }

    public function emptyTrash(Request $request)
    {
        $this->leafCategoryBaseQuery()->onlyTrashed()->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Trash emptied!']);
        }

        return back()->with('success', 'Trash emptied!');
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

    private function stats(): array
    {
        return [
            'total' => Category::count(),
            'roots' => Category::whereNull('parent_id')->count(),
            'children' => Category::whereNotNull('parent_id')->count(),
        ];
    }
}
