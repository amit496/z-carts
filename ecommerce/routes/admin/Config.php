<?php

use App\Http\Controllers\Admin\AdminSettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
Route::get('/settings/roles', [AdminSettingsController::class, 'roles'])->name('settings.roles');
Route::get('/settings/system', [AdminSettingsController::class, 'system'])->name('settings.system');
Route::get('/settings/currencies', [AdminSettingsController::class, 'currencies'])->name('settings.currencies');
Route::get('/settings/system/config', [AdminSettingsController::class, 'config'])->name('settings.config');
Route::get('/settings/plans', [AdminSettingsController::class, 'plans'])->name('settings.plans');
Route::get('/settings/business', [AdminSettingsController::class, 'business'])->name('settings.business');
Route::get('/settings/languages', [AdminSettingsController::class, 'languages'])->name('settings.languages');
Route::get('/settings/wallet-settings', [AdminSettingsController::class, 'walletSettings'])->name('settings.wallet');
Route::get('/settings/inspector', [AdminSettingsController::class, 'inspector'])->name('settings.inspector');
Route::get('/settings/commissions', [AdminSettingsController::class, 'commissions'])->name('settings.commissions');
Route::get('/settings/search', [AdminSettingsController::class, 'search'])->name('settings.search');

