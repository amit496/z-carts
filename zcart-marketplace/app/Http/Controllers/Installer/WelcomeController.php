<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class WelcomeController extends Controller
{
    public function welcome()
    {
        // Calls the storage:link artisan command
        Artisan::call('storage:link');

        // Returns the installer welcome view
        return view('installer.welcome');
    }
}
