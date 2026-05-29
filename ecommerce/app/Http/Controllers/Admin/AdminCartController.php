<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\User;
use Inertia\Inertia;

class AdminCartController extends Controller
{
    public function index()
    {
        $carts = CartItem::with('user', 'product.images')
            ->latest()->paginate(20);

        $usersWithCarts = User::whereHas('cartItems')->count();

        return Inertia::render('Admin/Carts/Index', [
            'carts' => $carts,
            'stats' => [
                'total_items'  => CartItem::count(),
                'active_users' => $usersWithCarts,
                'total_value'  => CartItem::query()->join('products', 'user_cart_items.product_id', '=', 'products.id')
                    ->selectRaw('SUM(user_cart_items.quantity * COALESCE(products.price, products.min_price, 0)) as val')
                    ->value('val') ?? 0,
            ],
        ]);
    }
}
