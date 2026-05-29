<?php
namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = CartItem::with('product.images', 'product.flashSale', 'variant')
            ->where('user_id', auth()->id())->get();
        return Inertia::render('Cart', ['cartItems' => $items]);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id', 'variant_id' => 'nullable|exists:product_variants,id', 'quantity' => 'integer|min:1']);

        $existing = CartItem::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $request->quantity ?? 1);
        } else {
            CartItem::create(['user_id' => auth()->id(), 'product_id' => $request->product_id, 'variant_id' => $request->variant_id, 'quantity' => $request->quantity ?? 1]);
        }

        return back()->with('success', 'Added to cart!');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        abort_if($cartItem->user_id !== auth()->id(), 403);
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);
        return back();
    }

    public function destroy(CartItem $cartItem)
    {
        abort_if($cartItem->user_id !== auth()->id(), 403);
        $cartItem->delete();
        return back();
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip' => 'required|string',
            'payment_method' => 'required|string',
            'coupon_code' => 'nullable|string',
        ]);

        $cartItems = CartItem::with('product.store', 'product.images', 'product.flashSale', 'variant')
            ->where('user_id', auth()->id())->get();

        if ($cartItems->isEmpty()) return back()->withErrors(['cart' => 'Cart is empty.']);

        // Group by store
        $byStore = $cartItems->groupBy('product.store_id');

        $coupon = null;
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->first();
            if (!$coupon || !$coupon->isValid()) return back()->withErrors(['coupon' => 'Invalid or expired coupon.']);
        }

        DB::transaction(function () use ($byStore, $coupon, $request) {
            foreach ($byStore as $storeId => $items) {
                $subtotal = $items->sum(fn($i) => $i->product->effective_price * $i->quantity);
                $discount = $coupon ? $coupon->calculateDiscount($subtotal) : 0;
                $shipping = $subtotal >= 100 ? 0 : 9.99;
                $total = max(0, $subtotal - $discount + $shipping);

                $order = Order::create([
                    'user_id' => auth()->id(),
                    'store_id' => $storeId,
                    'coupon_id' => $coupon?->id,
                    'order_number' => Order::generateNumber(),
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'shipping' => $shipping,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                    'shipping_address' => $request->shipping_address,
                    'payment_status' => 'paid',
                ]);

                foreach ($items as $item) {
                    $unit = $item->product->effective_price;
                    $order->items()->create([
                        'product_id' => $item->product_id,
                        'variant_id' => $item->variant_id,
                        'product_name' => $item->product->name,
                        'size' => $item->variant?->size,
                        'color' => $item->variant?->color,
                        'quantity' => $item->quantity,
                        'price' => $unit,
                        'item_description' => $item->product->name,
                        'unit_price' => $unit,
                    ]);
                    if ($item->variant) $item->variant->decrement('stock', $item->quantity);
                    else $item->product->decrement('stock', $item->quantity);
                    if ($item->product->flashSale) $item->product->flashSale->increment('sold', $item->quantity);
                }

                if ($coupon) {
                    $coupon->increment('used_count');
                    $coupon->usages()->create(['user_id' => auth()->id(), 'order_id' => $order->id]);
                }

                UserNotification::create([
                    'user_id' => auth()->id(),
                    'type' => 'order_placed',
                    'title' => 'Order Placed!',
                    'body' => "Your order #{$order->order_number} has been placed successfully.",
                    'data' => ['order_id' => $order->id],
                ]);
            }

            CartItem::where('user_id', auth()->id())->delete();
        });

        return redirect()->route('orders.index')->with('success', 'Order placed successfully!');
    }
}
