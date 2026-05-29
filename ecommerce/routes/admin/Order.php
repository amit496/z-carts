<?php

use App\Http\Controllers\Admin\AdminOrderController;
use Illuminate\Support\Facades\Route;

Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
Route::get('/orders/cancellations', [AdminOrderController::class, 'cancellations'])->name('orders.cancellations');
Route::patch('/orders/bulk', [AdminOrderController::class, 'bulkUpdate'])->name('orders.bulk');
Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice')->whereNumber('order');
Route::patch('/orders/{order}/archive', [AdminOrderController::class, 'archive'])->name('orders.archive')->whereNumber('order');
Route::patch('/orders/{order}/delivery', [AdminOrderController::class, 'assignDelivery'])->name('orders.delivery')->whereNumber('order');
Route::patch('/orders/{order}/dispute', [AdminOrderController::class, 'toggleDispute'])->name('orders.dispute')->whereNumber('order');
Route::patch('/orders/{order}/status', [AdminOrderController::class, 'update'])->name('orders.update')->whereNumber('order');
Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show')->whereNumber('order');

