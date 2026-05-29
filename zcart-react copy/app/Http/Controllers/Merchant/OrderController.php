<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $shopId = Auth::user()->shop?->id;
        return Inertia::render('Merchant/Orders/Index', [
            'orders' => Order::where('shop_id', $shopId)
                ->with('customer')->latest()->paginate(20)
                ->through(fn($o) => [
                    'id'             => $o->id,
                    'order_number'   => $o->order_number,
                    'customer_name'  => $o->customer_name ?? $o->customer?->name,
                    'grand_total'    => $o->grand_total,
                    'status'         => $o->statusLabel(),
                    'order_status_id'=> $o->order_status_id,
                    'payment_status' => $o->paymentStatusLabel(),
                    'created_at'     => $o->created_at->format('M d, Y'),
                ]),
        ]);
    }

    public function show(Order $order)
    {
        abort_if($order->shop_id !== Auth::user()->shop?->id, 403);
        return Inertia::render('Merchant/Orders/Show', [
            'order' => array_merge($order->load('items.inventory', 'paymentMethod', 'carrier')->toArray(), [
                'status_label'         => $order->statusLabel(),
                'payment_status_label' => $order->paymentStatusLabel(),
            ]),
        ]);
    }

    public function updateStatus(Request $r, Order $order)
    {
        abort_if($order->shop_id !== Auth::user()->shop?->id, 403);
        $r->validate(['order_status_id' => 'required|integer|between:1,9']);
        $order->update(['order_status_id' => $r->order_status_id]);
        return back()->with('success', 'Order status updated.');
    }
}
