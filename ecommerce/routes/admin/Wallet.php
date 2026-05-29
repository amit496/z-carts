<?php

use App\Http\Controllers\Admin\AdminWalletController;
use Illuminate\Support\Facades\Route;

Route::get('/wallet', [AdminWalletController::class, 'index'])->name('wallet.index');
Route::get('/wallet/payout-requests', [AdminWalletController::class, 'payoutRequests'])->name('wallet.payout-requests');
Route::get('/wallet/credits', [AdminWalletController::class, 'credits'])->name('wallet.credits');
Route::get('/wallet/commission', [AdminWalletController::class, 'commission'])->name('wallet.commission');
Route::get('/wallet/deposits', [AdminWalletController::class, 'deposits'])->name('wallet.deposits');

