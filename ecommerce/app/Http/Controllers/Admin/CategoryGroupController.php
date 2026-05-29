<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Requests\Validations\CreateCategoryGroupRequest;
use App\Http\Requests\Validations\UpdateCategoryGroupRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryGroupController extends Controller
{
    use InteractsWithImages;

    public function index()
    {
        $groups = Category::whereNull('parent_id')
            ->withCount('children')
            ->orderBy('order')
            ->paginate(20);

        return Inertia::render('Admin/Categories/Groups', [
            'groups' => $groups,
            'stats' => $this->stats(),
        ]);
    }

    public function store(CreateCategoryGroupRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $data['parent_id'] = null;
        $data['order'] = $data['order'] ?? 99;
        $data['active'] = $request->boolean('active', true);

        unset($data['image'], $data['cover_image'], $data['icon_image']);

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->storeImage($request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('icon_image')) {
            $data['icon_image'] = $this->storeImage($request->file('icon_image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Category group created!');
    }

    public function edit(Category $categoryGroup)
    {
        abort_unless($categoryGroup->parent_id === null, 404);

        return Inertia::render('Admin/Categories/Groups', [
            'groups' => Category::whereNull('parent_id')->withCount('children')->orderBy('order')->paginate(20),
            'editing' => $categoryGroup,
            'stats' => $this->stats(),
        ]);
    }

    public function update(UpdateCategoryGroupRequest $request, Category $categoryGroup)
    {
        abort_unless($categoryGroup->parent_id === null, 404);

        $data = $request->validated();
        unset($data['image'], $data['cover_image'], $data['icon_image']);

        if ($request->hasFile('image')) {
            $data['image'] = $this->replaceImage($categoryGroup->image, $request->file('image'), 'categories');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $this->replaceImage($categoryGroup->cover_image, $request->file('cover_image'), 'categories');
        }
        if ($request->hasFile('icon_image')) {
            $data['icon_image'] = $this->replaceImage($categoryGroup->icon_image, $request->file('icon_image'), 'categories');
        }

        $categoryGroup->update($data);

        return back()->with('success', 'Category group updated!');
    }

    public function trash(Request $request, Category $categoryGroup)
    {
        abort_unless($categoryGroup->parent_id === null, 404);

        $categoryGroup->delete();

        return back()->with('success', 'Category group trashed!');
    }

    public function restore(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Category group restored!');
    }

    public function destroy(Request $request, $id)
    {
        Category::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Category group deleted permanently!');
    }

    public function massTrash(Request $request)
    {
        Category::whereNull('parent_id')->whereIn('id', $request->ids)->delete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Category groups trashed!']);
        }

        return back()->with('success', 'Category groups trashed!');
    }

    public function massDestroy(Request $request)
    {
        Category::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Category groups deleted!']);
        }

        return back()->with('success', 'Category groups deleted!');
    }

    public function emptyTrash(Request $request)
    {
        Category::onlyTrashed()->whereNull('parent_id')->forceDelete();

        if ($request->ajax()) {
            return response()->json(['success' => 'Trash emptied!']);
        }

        return back()->with('success', 'Trash emptied!');
    }

    public function showChildSubGroups(Category $categoryGroup)
    {
        abort_unless($categoryGroup->parent_id === null, 404);

        $categorySubGrps = $categoryGroup->children()->orderBy('order')->get();
        $trashes = $categoryGroup->children()->onlyTrashed()->get();

        return Inertia::render('Admin/Categories/SubGroups', [
            'categoryGroup' => $categoryGroup,
            'subGroups' => $categorySubGrps,
            'trashes' => $trashes,
            'roots' => Category::whereNull('parent_id')->orderBy('name')->get(['id', 'name']),
            'stats' => $this->stats(),
        ]);
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
