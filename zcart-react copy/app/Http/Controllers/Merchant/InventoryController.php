<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InventoryController extends Controller
{
    private function shopId()
    {
        return Auth::user()->shop?->id;
    }

    public function index()
    {
        return Inertia::render('Merchant/Inventory/Index', [
            'inventories' => Inventory::where('shop_id', $this->shopId())
                ->with('product')->latest()->paginate(20)
                ->through(fn($i) => [
                    'id'             => $i->id,
                    'title'          => $i->title,
                    'sku'            => $i->sku,
                    'sale_price'     => $i->sale_price,
                    'stock_quantity' => $i->stock_quantity,
                    'sold_quantity'  => $i->sold_quantity,
                    'active'         => $i->active,
                    'product'        => $i->product?->name,
                    'condition'      => $i->condition,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Merchant/Inventory/Form', [
            'products' => Product::where('shop_id', $this->shopId())->where('active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'product_id'     => 'required|exists:products,id',
            'title'          => 'required|string|max:255',
            'sku'            => 'nullable|string|max:100',
            'condition'      => 'required|in:New,Used,Refurbished',
            'description'    => 'nullable|string',
            'sale_price'     => 'required|numeric|min:0',
            'offer_price'    => 'nullable|numeric|min:0',
            'offer_start'    => 'nullable|date',
            'offer_end'      => 'nullable|date|after:offer_start',
            'stock_quantity' => 'required|integer|min:0',
            'min_order_quantity' => 'nullable|integer|min:1',
            'free_shipping'  => 'boolean',
            'active'         => 'boolean',
        ]);

        $data['shop_id']        = $this->shopId();
        $data['slug']           = Str::slug($data['title']) . '-' . Str::random(5);
        $data['available_from'] = now();

        Inventory::create($data);
        return redirect('/merchant/inventory')->with('success', 'Inventory item created.');
    }

    public function edit(Inventory $inventory)
    {
        abort_if($inventory->shop_id !== $this->shopId(), 403);
        return Inertia::render('Merchant/Inventory/Form', [
            'inventory' => $inventory,
            'products'  => Product::where('shop_id', $this->shopId())->where('active', true)->get(['id', 'name']),
        ]);
    }

    public function update(Request $r, Inventory $inventory)
    {
        abort_if($inventory->shop_id !== $this->shopId(), 403);
        $data = $r->validate([
            'title'          => 'required|string|max:255',
            'sku'            => 'nullable|string|max:100',
            'condition'      => 'required|in:New,Used,Refurbished',
            'description'    => 'nullable|string',
            'sale_price'     => 'required|numeric|min:0',
            'offer_price'    => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'free_shipping'  => 'boolean',
            'active'         => 'boolean',
        ]);
        $inventory->update($data);
        return redirect('/merchant/inventory')->with('success', 'Inventory updated.');
    }

    public function destroy(Inventory $inventory)
    {
        abort_if($inventory->shop_id !== $this->shopId(), 403);
        $inventory->delete();
        return back()->with('success', 'Inventory deleted.');
    }
}
