<?php

use App\Http\Controllers\Admin\AdminCartController;
use Illuminate\Support\Facades\Route;

Route::get('/carts', [AdminCartController::class, 'index'])->name('carts.index');

