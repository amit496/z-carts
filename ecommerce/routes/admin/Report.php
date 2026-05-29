<?php

use App\Http\Controllers\Admin\AdminReportController;
use Illuminate\Support\Facades\Route;

Route::get('/reports/payouts', [AdminReportController::class, 'payouts'])->name('reports.payouts');
Route::get('/reports/sales', [AdminReportController::class, 'sales'])->name('reports.sales');
Route::get('/reports/performance', [AdminReportController::class, 'performance'])->name('reports.performance');
Route::get('/reports/sales/orders', [AdminReportController::class, 'salesOrders'])->name('reports.sales.orders');
Route::get('/reports/sales/products', [AdminReportController::class, 'salesProducts'])->name('reports.sales.products');
Route::get('/reports/sales/payments', [AdminReportController::class, 'salesPayments'])->name('reports.sales.payments');
Route::get('/reports/analytics', [AdminReportController::class, 'analytics'])->name('reports.analytics');

