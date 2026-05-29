<?php

use App\Http\Controllers\Admin\AdminStoreController;
use Illuminate\Support\Facades\Route;

Route::get('/stores', [AdminStoreController::class, 'index'])->name('stores.index');
Route::get('/stores/pending', [AdminStoreController::class, 'pending'])->name('stores.pending');
Route::get('/stores/approved', [AdminStoreController::class, 'approved'])->name('stores.approved');
Route::get('/stores/suspended', [AdminStoreController::class, 'suspended'])->name('stores.suspended');
Route::patch('/stores/{store}/status', [AdminStoreController::class, 'updateStatus'])->name('stores.status');

