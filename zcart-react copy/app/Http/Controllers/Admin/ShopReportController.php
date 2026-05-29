<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shop;
use Inertia\Inertia;

class ShopReportController extends Controller
{
    public function index()
    {
        $shops = Shop::query()
            ->with('owner')
            ->latest()
            ->paginate(25)
            ->through(function ($s) {
                $orders = Order::where('shop_id', $s->id);

                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'owner' => $s->owner?->name,
                    'active' => (bool)$s->active,
                    'orders_count' => (clone $orders)->count(),
                    'paid_orders' => (clone $orders)->where('payment_status', '>=', Order::PAYMENT_STATUS_PAID)->count(),
                    'revenue' => (clone $orders)->where('payment_status', '>=', Order::PAYMENT_STATUS_PAID)->sum('grand_total'),
                ];
            });

        return Inertia::render('Admin/Reports/ShopReport', [
            'shops' => $shops,
        ]);
    }
}

