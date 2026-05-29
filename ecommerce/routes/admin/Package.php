<?php

use App\Http\Controllers\Admin\AdminPluginController;
use Illuminate\Support\Facades\Route;

Route::get('/plugins', [AdminPluginController::class, 'index'])->name('plugins.index');

