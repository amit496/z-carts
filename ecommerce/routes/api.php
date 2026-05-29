<?php

use Illuminate\Support\Facades\Route;

// API routes (zCart / future); keep file present for RouteServiceProvider.
Route::get('/ping', fn () => ['ok' => true])->name('api.ping');
