<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function dashboard()
    {
        $store = auth()->user()->store;
        if (!$store) return redirect()->route('seller.store.setup');

        $storeId = $store->id;

        $totalRevenue  = Order::where('store_id', $storeId)->where('payment_status', 'paid')->sum('total');
        $totalOrders   = Order::where('store_id', $storeId)->count();
        $totalProducts = Product::where('store_id', $storeId)->count();
        $pendingOrders = Order::where('store_id', $storeId)->where('status', 'pending')->count();
        $recentOrders  = Order::with('items.product', 'user')->where('store_id', $storeId)->latest()->take(5)->get();

        // Last 6 months revenue
        $monthlyRevenue = Order::where('store_id', $storeId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('SUM(total) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Seller/Dashboard', compact(
            'store', 'totalRevenue', 'totalOrders', 'totalProducts',
            'recentOrders', 'pendingOrders', 'monthlyRevenue'
        ));
    }

    public function setup()
    {
        if (auth()->user()->store) return redirect()->route('seller.dashboard');
        return Inertia::render('Seller/Setup');
    }

    public function createStore(Request $request)
    {
        $request->validate(['name' => 'required|string|max:100', 'description' => 'nullable|string']);

        $store = Store::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name).'-'.auth()->id(),
            'description' => $request->description,
        ]);

        auth()->user()->update(['role' => 'seller']);
        return redirect()->route('seller.dashboard')->with('success', 'Store created! Awaiting approval.');
    }

    public function edit()
    {
        return Inertia::render('Seller/StoreEdit', ['store' => auth()->user()->store]);
    }

    public function update(Request $request)
    {
        $store = auth()->user()->store;
        $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo')->store('stores/logos', 'public');
            $store->update(['logo' => $logo]);
        }
        if ($request->hasFile('banner')) {
            $banner = $request->file('banner')->store('stores/banners', 'public');
            $store->update(['banner' => $banner]);
        }

        $store->update(['name' => $request->name, 'description' => $request->description]);
        return back()->with('success', 'Store updated!');
    }
}
