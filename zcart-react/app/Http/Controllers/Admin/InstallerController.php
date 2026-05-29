<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class InstallerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Installer', [
            'php_version' => PHP_VERSION,
            'laravel_env' => env('APP_ENV', 'production'),
        ]);
    }
}

