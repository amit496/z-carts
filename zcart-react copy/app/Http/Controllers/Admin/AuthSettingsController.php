<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AuthSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Auth', [
            'info' => [
                'login' => '/login',
                'logout' => '/logout',
            ],
        ]);
    }
}

