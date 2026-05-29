<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $shopId = Auth::user()->shop?->id;

        $monthly = Order::where('shop_id', $shopId)
            ->selectRaw("strftime('%Y-%m', created_at) as month, SUM(grand_total) as revenue, COUNT(*) as orders")
            ->groupBy('month')->orderBy('month', 'desc')->limit(12)->get();

        return Inertia::render('Merchant/Reports/Index', [
            'monthly' => $monthly,
            'totals'  => [
                'revenue'    => Order::where('shop_id', $shopId)->where('payment_status', '>=', 3)->sum('grand_total'),
                'orders'     => Order::where('shop_id', $shopId)->count(),
                'items_sold' => Auth::user()->shop?->total_item_sold ?? 0,
                'pending'    => Order::where('shop_id', $shopId)->where('order_status_id', 1)->count(),
            ],
        ]);
    }
}
