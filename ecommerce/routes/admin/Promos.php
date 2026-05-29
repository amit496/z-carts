<?php

use App\Http\Controllers\Admin\AdminPromotionController;
use Illuminate\Support\Facades\Route;

Route::get('/promotions', [AdminPromotionController::class, 'index'])->name('promotions.index');
Route::get('/promotions/trending', [AdminPromotionController::class, 'trending'])->name('promotions.trending');

