<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function payouts()
    {
        return redirect('/admin/wallet');
    }

    public function salesOrders()   { return Inertia::render('Admin/Reports/Sales', $this->salesData()); }
    public function salesProducts() { return Inertia::render('Admin/Reports/Sales', $this->salesData()); }
    public function salesPayments() { return Inertia::render('Admin/Reports/Sales', $this->salesData()); }
    public function analytics()     { return Inertia::render('Admin/Reports/Sales', $this->salesData()); }

    private function salesData()
    {
        $monthly = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('SUM(total) as revenue'), DB::raw('COUNT(*) as orders'))
            ->groupBy('month')->orderBy('month')->get();
        $topProducts = Product::withCount('orderItems')->withSum('orderItems', 'price')->orderByDesc('order_items_count')->take(10)->get();
        $topStores = Store::withCount('orders')->withSum(['orders' => fn($q) => $q->where('payment_status', 'paid')], 'total')->orderByDesc('orders_count')->take(10)->get();
        return ['monthly' => $monthly, 'topProducts' => $topProducts, 'topStores' => $topStores, 'stats' => ['total_revenue' => Order::where('payment_status', 'paid')->sum('total'), 'total_orders' => Order::count(), 'avg_order' => Order::where('payment_status', 'paid')->avg('total') ?? 0, 'total_products' => Product::count()]];
    }

    public function sales()
    {
        $monthly = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(DB::raw("strftime('%Y-%m', created_at) as month"), DB::raw('SUM(total) as revenue'), DB::raw('COUNT(*) as orders'))
            ->groupBy('month')->orderBy('month')->get();

        $topProducts = Product::withCount('orderItems')
            ->withSum('orderItems', 'price')
            ->orderByDesc('order_items_count')->take(10)->get();

        $topStores = Store::withCount('orders')
            ->withSum(['orders' => fn($q) => $q->where('payment_status', 'paid')], 'total')
            ->orderByDesc('orders_count')->take(10)->get();

        return Inertia::render('Admin/Reports/Sales', [
            'monthly'     => $monthly,
            'topProducts' => $topProducts,
            'topStores'   => $topStores,
            'stats' => [
                'total_revenue'  => Order::where('payment_status', 'paid')->sum('total'),
                'total_orders'   => Order::count(),
                'avg_order'      => Order::where('payment_status', 'paid')->avg('total') ?? 0,
                'total_products' => Product::count(),
            ],
        ]);
    }

    public function performance()
    {
        return Inertia::render('Admin/Reports/Performance', [
            'stats' => [
                'users'          => User::count(),
                'new_users'      => User::where('created_at', '>=', now()->subDays(30))->count(),
                'stores'         => Store::count(),
                'approved_stores'=> Store::where('status', 'approved')->count(),
                'orders'         => Order::count(),
                'revenue'        => Order::where('payment_status', 'paid')->sum('total'),
                'avg_order'      => Order::where('payment_status', 'paid')->avg('total') ?? 0,
                'cancelled'      => Order::where('status', 'cancelled')->count(),
            ],
            'daily' => Order::where('created_at', '>=', now()->subDays(30))
                ->select(DB::raw("strftime('%Y-%m-%d', created_at) as date"), DB::raw('COUNT(*) as orders'), DB::raw('SUM(total) as revenue'))
                ->groupBy('date')->orderBy('date')->get(),
        ]);
    }
}
