<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product.images', 'store')
            ->where('user_id', auth()->id())
            ->latest()->paginate(10);
        return Inertia::render('Orders', ['orders' => $orders]);
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        $order->load('items.product.images', 'items.variant', 'store', 'coupon');
        return Inertia::render('OrderDetail', ['order' => $order]);
    }

    public function cancel(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        abort_if(!in_array($order->status, ['pending', 'confirmed']), 422, 'Cannot cancel this order.');
        $order->update(['status' => 'cancelled']);
        return back()->with('success', 'Order cancelled.');
    }
}
