<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Models\FlashSale;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'users'            => User::count(),
                'active_users'     => User::where('is_active', true)->count(),
                'sellers'          => User::where('role', 'seller')->count(),
                'stores'           => Store::count(),
                'pending_stores'   => Store::where('status', 'pending')->count(),
                'approved_stores'  => Store::where('status', 'approved')->count(),
                'products'         => Product::count(),
                'active_products'  => Product::where('is_active', true)->count(),
                'featured_products'=> Product::where('is_featured', true)->count(),
                'low_stock'        => Product::where('stock', '<=', 5)->count(),
                'orders'           => Order::count(),
                'pending_orders'   => Order::where('status', 'pending')->count(),
                'delivered_orders' => Order::where('status', 'delivered')->count(),
                'revenue'          => Order::where('payment_status', 'paid')->sum('total'),
                'flash_sales'      => FlashSale::where('is_active', true)->count(),
                'categories'       => Category::count(),
            ],
            'recentOrders'   => Order::with('user', 'store')->latest()->take(6)->get(),
            'recentStores'   => Store::with('user')->latest()->take(6)->get(),
            'recentProducts' => Product::with('store', 'category')->latest()->take(6)->get(),
        ]);
    }
}
