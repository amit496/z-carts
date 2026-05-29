<?php

use App\Http\Controllers\Admin\AdminUtilityController;
use Illuminate\Support\Facades\Route;

Route::get('/utilities/email-templates', [AdminUtilityController::class, 'emailTemplates'])->name('utilities.email-templates');
Route::get('/utilities/pdf-templates', [AdminUtilityController::class, 'pdfTemplates'])->name('utilities.pdf-templates');
Route::get('/utilities/smart-forms', [AdminUtilityController::class, 'smartForms'])->name('utilities.smart-forms');
Route::get('/utilities/pages', [AdminUtilityController::class, 'pages'])->name('utilities.pages');
Route::get('/utilities/blogs', [AdminUtilityController::class, 'blogs'])->name('utilities.blogs');
Route::get('/utilities/events', [AdminUtilityController::class, 'events'])->name('utilities.events');
Route::get('/utilities/faqs', [AdminUtilityController::class, 'faqs'])->name('utilities.faqs');

