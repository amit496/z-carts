<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFlashSaleController extends Controller
{
    public function index()
    {
        $flashSales = FlashSale::with('product.images')->latest()->paginate(15);
        $products = Product::where('is_active', true)->get(['id', 'name', 'price']);
        return Inertia::render('Admin/FlashSales/Index', [
            'flashSales' => $flashSales,
            'products' => $products,
            'stats' => [
                'active' => FlashSale::where('is_active', true)->count(),
                'scheduled' => FlashSale::where('starts_at', '>', now())->count(),
                'running' => FlashSale::where('starts_at', '<=', now())->where('ends_at', '>', now())->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'sale_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
        ]);

        FlashSale::updateOrCreate(
            ['product_id' => $request->product_id],
            $request->only('product_id', 'sale_price', 'quantity', 'starts_at', 'ends_at') + ['is_active' => true]
        );

        return back()->with('success', 'Flash sale created!');
    }

    public function toggleActive(FlashSale $flashSale)
    {
        $flashSale->update(['is_active' => !$flashSale->is_active]);
        return back();
    }

    public function destroy(FlashSale $flashSale)
    {
        $flashSale->delete();
        return back();
    }
}
