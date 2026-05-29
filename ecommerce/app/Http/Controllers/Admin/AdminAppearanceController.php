<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminAppearanceController extends Controller
{
    public function themes() { return Inertia::render('Admin/Appearance/Themes'); }
    public function popups() { return Inertia::render('Admin/Appearance/Popups'); }
    public function banners()
    {
        return Inertia::render('Admin/Appearance/Banners');
    }

    public function sliders()
    {
        return Inertia::render('Admin/Appearance/Sliders');
    }

    public function customCss()
    {
        return Inertia::render('Admin/Appearance/CustomCss');
    }
}
