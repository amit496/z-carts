<?php

use App\Http\Controllers\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
Route::get('/users/customers', [AdminUserController::class, 'customers'])->name('users.customers');
Route::get('/users/sellers', [AdminUserController::class, 'sellers'])->name('users.sellers');
Route::get('/users/affiliates', [AdminUserController::class, 'affiliates'])->name('users.affiliates');
Route::patch('/users/{user}/toggle', [AdminUserController::class, 'toggleActive'])->name('users.toggle');
Route::patch('/users/{user}/role', [AdminUserController::class, 'changeRole'])->name('users.role');

