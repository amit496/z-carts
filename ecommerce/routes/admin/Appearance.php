<?php

use App\Http\Controllers\Admin\AdminAppearanceController;
use Illuminate\Support\Facades\Route;

Route::get('/appearance/banners', [AdminAppearanceController::class, 'banners'])->name('appearance.banners');
Route::get('/appearance/sliders', [AdminAppearanceController::class, 'sliders'])->name('appearance.sliders');
Route::get('/appearance/custom-css', [AdminAppearanceController::class, 'customCss'])->name('appearance.custom-css');
Route::get('/appearance/themes', [AdminAppearanceController::class, 'themes'])->name('appearance.themes');
Route::get('/appearance/popups', [AdminAppearanceController::class, 'popups'])->name('appearance.popups');

