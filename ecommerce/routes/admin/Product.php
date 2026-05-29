<?php

use App\Http\Controllers\Admin\AdminProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
Route::get('/products/{product}', [AdminProductController::class, 'show'])
    ->whereNumber('product')
    ->name('products.show');
Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
Route::patch('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
Route::patch('/products/{product}/active', [AdminProductController::class, 'toggleActive'])->name('products.active');
Route::patch('/products/{product}/featured', [AdminProductController::class, 'toggleFeatured'])->name('products.featured');
Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
Route::post('/products/{id}/restore', [AdminProductController::class, 'restore'])->whereNumber('id')->name('products.restore');
Route::delete('/products/{id}/force', [AdminProductController::class, 'forceDestroy'])->whereNumber('id')->name('products.force_destroy');

