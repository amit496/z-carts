<?php

use App\Http\Controllers\Admin\AdminFlashSaleController;
use Illuminate\Support\Facades\Route;

Route::get('/flash-sales', [AdminFlashSaleController::class, 'index'])->name('flash-sales.index');
Route::post('/flash-sales', [AdminFlashSaleController::class, 'store'])->name('flash-sales.store');
Route::patch('/flash-sales/{flashSale}/toggle', [AdminFlashSaleController::class, 'toggleActive'])->name('flash-sales.toggle');
Route::delete('/flash-sales/{flashSale}', [AdminFlashSaleController::class, 'destroy'])->name('flash-sales.destroy');

