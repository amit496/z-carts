<?php

use App\Http\Controllers\Admin\AdminAttributeController;
use App\Http\Controllers\Admin\AdminManufacturerController;
use Illuminate\Support\Facades\Route;

Route::get('/catalog/manufacturers', [AdminManufacturerController::class, 'index'])->name('catalog.manufacturers.index');
Route::get('/catalog/manufacturers/create', [AdminManufacturerController::class, 'create'])->name('catalog.manufacturers.create');
Route::post('/catalog/manufacturers', [AdminManufacturerController::class, 'store'])->name('catalog.manufacturers.store');
Route::get('/catalog/manufacturers/{manufacturer}', [AdminManufacturerController::class, 'show'])->name('catalog.manufacturers.show');
Route::get('/catalog/manufacturers/{manufacturer}/edit', [AdminManufacturerController::class, 'edit'])->name('catalog.manufacturers.edit');
Route::patch('/catalog/manufacturers/{manufacturer}', [AdminManufacturerController::class, 'update'])->name('catalog.manufacturers.update');
Route::patch('/catalog/manufacturers/{manufacturer}/active', [AdminManufacturerController::class, 'toggleActive'])->name('catalog.manufacturers.active');
Route::delete('/catalog/manufacturers/{manufacturer}', [AdminManufacturerController::class, 'destroy'])->name('catalog.manufacturers.destroy');
Route::post('/catalog/manufacturers/{id}/restore', [AdminManufacturerController::class, 'restore'])
    ->whereNumber('id')
    ->name('catalog.manufacturers.restore');
Route::delete('/catalog/manufacturers/{id}/force', [AdminManufacturerController::class, 'forceDestroy'])
    ->whereNumber('id')
    ->name('catalog.manufacturers.force-destroy');

Route::get('/catalog/attributes', [AdminAttributeController::class, 'index'])->name('catalog.attributes');
Route::post('/catalog/attributes', [AdminAttributeController::class, 'store'])->name('catalog.attributes.store');
Route::patch('/catalog/attributes/{catalog_attribute}', [AdminAttributeController::class, 'update'])->name('catalog.attributes.update');
Route::delete('/catalog/attributes/bulk', [AdminAttributeController::class, 'bulkDestroy'])->name('catalog.attributes.bulk-destroy');
Route::delete('/catalog/attributes/{catalog_attribute}', [AdminAttributeController::class, 'destroy'])->name('catalog.attributes.destroy');
Route::post('/catalog/attributes/{catalog_attribute}/values', [AdminAttributeController::class, 'storeValue'])->name('catalog.attributes.values.store');
Route::patch('/catalog/attribute-values/{catalog_attribute_value}', [AdminAttributeController::class, 'updateValue'])->name('catalog.attribute-values.update');
Route::delete('/catalog/attribute-values/{catalog_attribute_value}', [AdminAttributeController::class, 'destroyValue'])->name('catalog.attribute-values.destroy');

