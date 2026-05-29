<?php

use App\Http\Controllers\Admin\AdminSupportController;
use Illuminate\Support\Facades\Route;

Route::get('/support/messages', [AdminSupportController::class, 'messages'])->name('support.messages');
Route::get('/support/tickets', [AdminSupportController::class, 'tickets'])->name('support.tickets');
Route::get('/support/disputes', [AdminSupportController::class, 'disputes'])->name('support.disputes');
Route::get('/support/refunds', [AdminSupportController::class, 'refunds'])->name('support.refunds');
Route::patch('/support/refunds/{order}', [AdminSupportController::class, 'processRefund'])->name('support.refund');

