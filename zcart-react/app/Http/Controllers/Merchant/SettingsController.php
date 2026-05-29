<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use App\Models\Carrier;
use App\Models\ShippingZone;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $shopId = Auth::user()->shop?->id;
        return Inertia::render('Merchant/Settings/Index', [
            'shop'          => Auth::user()->shop,
            'taxes'         => Tax::where('shop_id', $shopId)->get(['id', 'name', 'rate', 'active']),
            'carriers'      => Carrier::where('shop_id', $shopId)->get(['id', 'name', 'tracking_url', 'active']),
            'shippingZones' => ShippingZone::where('shop_id', $shopId)->get(['id', 'name', 'active']),
        ]);
    }
}
