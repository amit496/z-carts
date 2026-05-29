<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\Shop;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $shop = Auth::user()->shop;

        if (!$shop) {
            return redirect('/merchant/setup');
        }

        $recentOrders = Order::where('shop_id', $shop->id)
            ->with('customer')->latest()->take(5)->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'customer'     => $o->customer_name ?? $o->customer?->name,
                'grand_total'  => $o->grand_total,
                'status'       => $o->statusLabel(),
                'created_at'   => $o->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Merchant/Dashboard', [
            'shop' => $shop,
            'stats' => [
                'total_orders'    => Order::where('shop_id', $shop->id)->count(),
                'pending_orders'  => Order::where('shop_id', $shop->id)->where('order_status_id', 1)->count(),
                'total_products'  => Product::where('shop_id', $shop->id)->count(),
                'total_inventory' => Inventory::where('shop_id', $shop->id)->count(),
                'total_revenue'   => Order::where('shop_id', $shop->id)->where('payment_status', '>=', 3)->sum('grand_total'),
                'total_sold'      => $shop->total_item_sold,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
