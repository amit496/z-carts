<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerOrderController extends Controller
{
    public function index(Request $request)
    {
        $storeId = auth()->user()->store->id;
        $query = Order::with('items.product', 'user')->where('store_id', $storeId)->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
            });
        }
        if ($request->status) $query->where('status', $request->status);

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('Seller/Orders', [
            'orders' => $orders,
            'filters' => $request->only('search', 'status'),
            'stats' => [
                'total'     => Order::where('store_id', $storeId)->count(),
                'pending'   => Order::where('store_id', $storeId)->where('status', 'pending')->count(),
                'shipped'   => Order::where('store_id', $storeId)->where('status', 'shipped')->count(),
                'delivered' => Order::where('store_id', $storeId)->where('status', 'delivered')->count(),
            ],
        ]);
    }

    public function show(Order $order)
    {
        abort_if($order->store_id !== auth()->user()->store->id, 403);
        $order->load('user', 'items.product.images');
        return response()->json($order);
    }

    public function update(Request $request, Order $order)
    {
        abort_if($order->store_id !== auth()->user()->store->id, 403);
        $request->validate(['status' => 'required|in:confirmed,processing,shipped,delivered,cancelled', 'tracking_number' => 'nullable|string']);

        $order->update($request->only('status', 'tracking_number'));

        UserNotification::create([
            'user_id' => $order->user_id,
            'type' => 'order_status',
            'title' => 'Order Update',
            'body' => "Your order #{$order->order_number} is now {$order->status}.",
            'data' => ['order_id' => $order->id],
        ]);

        return back()->with('success', 'Order updated!');
    }
}
