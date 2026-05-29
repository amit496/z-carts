<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use App\Models\ShippingZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ShippingConfigController extends Controller
{
    private string $path = 'admin/shipping-config.json';

    public function index()
    {
        $json = Storage::exists($this->path) ? Storage::get($this->path) : "{\n  \"notes\": \"\",\n  \"defaults\": {}\n}\n";

        return Inertia::render('Admin/Settings/ShippingConfig', [
            'json' => $json,
            'zones_count' => ShippingZone::count(),
            'rates_count' => ShippingRate::count(),
        ]);
    }

    public function update(Request $r)
    {
        $data = $r->validate(['json' => 'required|string']);
        $json = $data['json'];

        json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return back()->withErrors(['json' => 'Invalid JSON: ' . json_last_error_msg()]);
        }

        Storage::put($this->path, $json);
        return back()->with('success', 'Shipping config saved.');
    }
}

