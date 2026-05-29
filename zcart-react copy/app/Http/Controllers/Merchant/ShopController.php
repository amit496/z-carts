<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function show()
    {
        $shop = Auth::user()->shop;
        if (!$shop) return redirect('/merchant/setup');
        return Inertia::render('Merchant/Shop/Show', [
            'shop' => $shop->load('config'),
        ]);
    }

    public function setup()
    {
        return Inertia::render('Merchant/Shop/Setup');
    }

    public function storeSetup(Request $r)
    {
        $r->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email',
            'description' => 'nullable|string',
        ]);

        $shop = Shop::create([
            'owner_id'    => Auth::id(),
            'name'        => $r->name,
            'email'       => $r->email,
            'description' => $r->description,
            'slug'        => Str::slug($r->name) . '-' . Str::random(5),
            'active'      => false,
        ]);

        Config::create(['shop_id' => $shop->id]);

        Auth::user()->update(['shop_id' => $shop->id]);

        return redirect('/merchant')->with('success', 'Shop created! Awaiting admin approval.');
    }

    public function update(Request $r)
    {
        $shop = Auth::user()->shop;
        abort_if(!$shop, 404);

        $r->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'nullable|email',
            'description' => 'nullable|string',
        ]);

        $shop->update($r->only('name', 'email', 'description'));
        return back()->with('success', 'Shop updated.');
    }
}
