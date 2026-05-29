<?php
namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $items = Wishlist::with('product.images', 'product.store', 'product.flashSale')
            ->where('user_id', auth()->id())->get();
        return Inertia::render('Wishlist', ['items' => $items]);
    }

    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);
        $existing = Wishlist::where('user_id', auth()->id())->where('product_id', $request->product_id)->first();
        if ($existing) {
            $existing->delete();
            return back()->with('wishlist', 'removed');
        }
        Wishlist::create(['user_id' => auth()->id(), 'product_id' => $request->product_id]);
        return back()->with('wishlist', 'added');
    }
}
