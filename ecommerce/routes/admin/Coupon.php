<?php

use App\Http\Controllers\Admin\AdminCouponController;
use Illuminate\Support\Facades\Route;

Route::get('/coupons', [AdminCouponController::class, 'index'])->name('coupons.index');
Route::patch('/coupons/{coupon}/toggle', [AdminCouponController::class, 'toggle'])->name('coupons.toggle');
Route::delete('/coupons/{coupon}', [AdminCouponController::class, 'destroy'])->name('coupons.destroy');

