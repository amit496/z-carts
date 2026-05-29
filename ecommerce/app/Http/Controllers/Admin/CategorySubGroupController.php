<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Requests\Validations\CreateCategorySubGroupRequest;
use App\Http\Requests\Validations\UpdateCategorySubGroupRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategorySubGroupController extends Controller
{
    use InteractsWithImages;

    public function index()
    {
        $subGroups = Category::query()
            ->whereNotNull('parent_id')
            ->whereHas('parent', fn ($q) => $q->whereNull('parent_id'))
            ->with('parent')
            ->withCount('children')
            ->orderBy('order')
            ->paginate(20);

        $roots = Category::whereNull('parent_id')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/SubGroups', [
            'subGroups' => $subGroups,
            'roots' => $roots,
            'stats' => $this->stats(),
        ]);
    }

    public function store(CreateCategorySubGroupRequest $request)
    {
        $data = $request->validated();
        $data['active'] = $request->boolean('active', true);

        unset($data['cover_image']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Category sub-group created!');
    }

    public function edit(Category $categorySubGroup)
    {
        $this->assertIsSubGroup($categorySubGroup);

        $roots = Category::whereNull('parent_id')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/SubGroups', [
            'subGroups' => Category::query()
                ->whereNotNull('parent_id')
                ->whereHas('parent', fn ($q) => $q->whereNull('parent_id'))
                ->with('parent')
                ->withCount('children')
                ->orderBy('order')
                ->paginate(20),
            'roots' => $roots,
            'editing' => $categorySubGroup,
            'stats' => $this->stats(),
        ]);
    }

    public function update(UpdateCategorySubGroupRequest $request, Category $categorySubGroup)
    {
        $this->assertIsSubGroup($categorySubGroup);

        $data = $request->validated();
        $data['active'] = $request->boolean('active', true);

        unset($data['cover_image']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($categorySubGroup->cover_image, $request->file('cover_image'), 'categories');
        }

        $categorySubGroup->update($data);

        return back()->with('success', 'Category sub-group updated!');
    }

    public function trash(Request $request, Category $categorySubGroup)
    {
        $this->assertIsSubGroup($categorySubGroup);

        $categorySubGroup->delete();

        return back()->with('success', 'Sub-group trashed!');
    }

    public function restore(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Sub-group restored!');
    }

    public function destroy(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Sub-group deleted permanently!');
    }

    public function massTrash(Request $request)
    {
        Category::whereIn('id', $request->ids)->delete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Sub-groups trashed!']);
        }

        return back()->with('success', 'Sub-groups trashed!');
    }

    public function massDestroy(Request $request)
    {
        Category::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Sub-groups deleted!']);
        }

        return back()->with('success', 'Sub-groups deleted!');
    }

    public function emptyTrash(Request $request)
    {
        Category::onlyTrashed()
            ->whereNotNull('parent_id')
            ->whereHas('parent', fn ($q) => $q->whereNull('parent_id'))
            ->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Trash emptied!']);
        }

        return back()->with('success', 'Trash emptied!');
    }

    public function showParentCategories(Category $categorySubGroup)
    {
        $this->assertIsSubGroup($categorySubGroup);

        $categories = $categorySubGroup->children()->orderBy('order')->get();
        $trashes = $categorySubGroup->children()->onlyTrashed()->get();

        return Inertia::render('Admin/Categories/Index', [
            'categorySubGroup' => $categorySubGroup,
            'categories' => $categories,
            'trashes' => $trashes,
        ]);
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

    private function stats(): array
    {
        return [
            'total' => Category::count(),
            'roots' => Category::whereNull('parent_id')->count(),
            'children' => Category::whereNotNull('parent_id')->count(),
        ];
    }
}
