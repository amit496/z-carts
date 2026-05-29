<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SellerReportController extends Controller
{
    public function performance()
    {
        $store = auth()->user()->store;

        $monthly = Order::where('store_id', $store->id)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('SUM(total) as revenue'), DB::raw('COUNT(*) as orders'))
            ->groupBy('month')->orderBy('month')->get();

        $topProducts = Product::where('store_id', $store->id)
            ->withCount('orderItems')
            ->orderByDesc('order_items_count')->take(5)->get(['id', 'name', 'price', 'stock']);

        return Inertia::render('Seller/Reports/Performance', [
            'monthly'     => $monthly,
            'topProducts' => $topProducts,
            'stats' => [
                'revenue'   => Order::where('store_id', $store->id)->where('payment_status', 'paid')->sum('total'),
                'orders'    => Order::where('store_id', $store->id)->count(),
                'delivered' => Order::where('store_id', $store->id)->where('status', 'delivered')->count(),
                'cancelled' => Order::where('store_id', $store->id)->where('status', 'cancelled')->count(),
                'products'  => Product::where('store_id', $store->id)->count(),
                'avg_order' => Order::where('store_id', $store->id)->where('payment_status', 'paid')->avg('total') ?? 0,
            ],
        ]);
    }
}
