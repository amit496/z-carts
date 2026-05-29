<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminWalletController extends Controller
{
    public function index()
    {
        // Seller payouts = paid orders grouped by store
        $payouts = Order::with('store')
            ->where('payment_status', 'paid')
            ->select('store_id', DB::raw('SUM(total) as total_sales'), DB::raw('COUNT(*) as order_count'))
            ->groupBy('store_id')
            ->orderByDesc('total_sales')
            ->paginate(20);

        return Inertia::render('Admin/Wallet/Index', [
            'payouts' => $payouts,
            'stats' => [
                'total_revenue'  => Order::where('payment_status', 'paid')->sum('total'),
                'total_refunded' => Order::where('payment_status', 'refunded')->sum('total'),
                'pending_payout' => Order::where('payment_status', 'paid')->where('status', 'delivered')->sum('total'),
                'total_orders'   => Order::where('payment_status', 'paid')->count(),
            ],
        ]);
    }

    public function credits()
    {
        return Inertia::render('Admin/Wallet/Credits', [
            'stats' => [
                'total_credits_issued' => 0,
                'active_users'         => 0,
                'total_redeemed'       => 0,
            ],
            'transactions' => collect([]),
        ]);
    }

    public function commission()
    {
        $data = \App\Models\Order::with('store')
            ->where('payment_status', 'paid')
            ->selectRaw('store_id, SUM(total) as total_sales, COUNT(*) as order_count, SUM(total * 0.10) as commission')
            ->groupBy('store_id')
            ->orderByDesc('commission')
            ->paginate(20);

        return Inertia::render('Admin/Wallet/Commission', [
            'data'  => $data,
            'stats' => [
                'total_commission' => \App\Models\Order::where('payment_status', 'paid')->sum('total') * 0.10,
                'total_stores'     => \App\Models\Store::count(),
            ],
        ]);
    }

    public function deposits()
    {
        return Inertia::render('Admin/Wallet/Deposits', [
            'stats' => ['total_deposits' => 0, 'pending' => 0],
            'deposits' => collect([]),
        ]);
    }

    public function payoutRequests()
    {
        // Delivered + paid orders = ready for payout
        $requests = Order::with('store', 'user')
            ->where('payment_status', 'paid')
            ->where('status', 'delivered')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Wallet/PayoutRequests', [
            'requests' => $requests,
            'stats'    => ['total' => Order::where('payment_status', 'paid')->where('status', 'delivered')->count()],
        ]);
    }
}
