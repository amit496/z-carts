<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FlashSale;
use App\Models\Product;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function home()
    {
        $flashSales = FlashSale::with('product.images')
            ->where('is_active', true)->where('ends_at', '>', now())->where('starts_at', '<=', now())
            ->get();

        $featured = Product::with(['images', 'store', 'flashSale'])
            ->where('is_featured', true)->where('is_active', true)->take(10)->get();

        $newArrivals = Product::with(['images', 'store', 'flashSale'])
            ->where('is_active', true)->latest()->take(12)->get();

        $categories = Category::whereNull('parent_id')->with('children')->get();

        $dealOfDay = Product::with(['images', 'flashSale'])
            ->where('is_active', true)->where('is_featured', true)
            ->whereNotNull('compare_price')->inRandomOrder()->first();

        $brands = Product::where('is_active', true)->whereNotNull('brand')
            ->distinct()->pluck('brand')->take(8);

        $wishlistIds = auth()->check()
            ? Wishlist::where('user_id', auth()->id())->pluck('product_id')->toArray()
            : [];

        return Inertia::render('Home', compact('flashSales', 'featured', 'newArrivals', 'categories', 'wishlistIds', 'dealOfDay', 'brands'));
    }

    public function shop(Request $request)
    {
        $query = Product::with(['images', 'store', 'category', 'flashSale'])
            ->where('is_active', true);

        if ($request->search) $query->where('name', 'like', "%{$request->search}%");
        if ($request->category) $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        if ($request->gender) $query->where('gender', $request->gender);
        if ($request->brand) $query->where('brand', $request->brand);
        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);
        if ($request->size) $query->whereHas('variants', fn($q) => $q->where('size', $request->size)->where('stock', '>', 0));
        if ($request->color) $query->whereHas('variants', fn($q) => $q->where('color', 'like', "%{$request->color}%"));

        $sort = $request->sort ?? 'latest';
        match($sort) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'rating'     => $query->orderByDesc('rating'),
            'popular'    => $query->orderByDesc('reviews_count'),
            default      => $query->latest(),
        };

        $products = $query->paginate(20)->withQueryString();
        $categories = Category::whereNull('parent_id')->with('children')->get();
        $brands = Product::where('is_active', true)->whereNotNull('brand')->distinct()->pluck('brand');

        $wishlistIds = auth()->check()
            ? Wishlist::where('user_id', auth()->id())->pluck('product_id')->toArray()
            : [];

        return Inertia::render('Shop', compact('products', 'categories', 'brands', 'wishlistIds'));
    }

    public function product(Product $product)
    {
        $product->load(['images', 'variants', 'store', 'category', 'flashSale', 'reviews.user']);

        $related = Product::with(['images', 'flashSale'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(6)->get();

        $inWishlist = auth()->check()
            ? Wishlist::where('user_id', auth()->id())->where('product_id', $product->id)->exists()
            : false;

        return Inertia::render('Product', compact('product', 'related', 'inWishlist'));
    }

    public function store(Store $store)
    {
        $store->load('user');
        $products = Product::with(['images', 'flashSale'])
            ->where('store_id', $store->id)->where('is_active', true)
            ->paginate(12);

        return Inertia::render('StorePage', compact('store', 'products'));
    }
}
