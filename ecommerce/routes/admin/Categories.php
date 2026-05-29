<?php

use App\Http\Controllers\Admin\AdminCategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/groups', [AdminCategoryController::class, 'groups'])->name('categories.groups');
Route::post('/categories/groups', [AdminCategoryController::class, 'storeGroup'])->name('categories.groups.store');
Route::patch('/categories/groups/{category}', [AdminCategoryController::class, 'updateGroup'])->name('categories.groups.update');
Route::delete('/categories/groups/{category}', [AdminCategoryController::class, 'destroyGroup'])->name('categories.groups.destroy');
Route::get('/categories/sub-groups', [AdminCategoryController::class, 'subGroups'])->name('categories.sub-groups');
Route::post('/categories/sub-groups', [AdminCategoryController::class, 'storeSubGroup'])->name('categories.sub-groups.store');
Route::patch('/categories/sub-groups/{category}', [AdminCategoryController::class, 'updateSubGroup'])->name('categories.sub-groups.update');
Route::delete('/categories/sub-groups/{category}', [AdminCategoryController::class, 'destroySubGroup'])->name('categories.sub-groups.destroy');
Route::post('/categories/items', [AdminCategoryController::class, 'storeCatalogCategory'])->name('categories.items.store');
Route::patch('/categories/items/{category}', [AdminCategoryController::class, 'updateCatalogCategory'])->name('categories.items.update');
Route::delete('/categories/items/{category}', [AdminCategoryController::class, 'destroyCatalogCategory'])->name('categories.items.destroy');

