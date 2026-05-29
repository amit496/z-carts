<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Inertia\Inertia;

class InventoryProductController extends Controller
{
    public function index()
    {
        $rows = Inventory::query()
            ->with(['product', 'shop'])
            ->latest()
            ->paginate(25)
            ->through(fn ($i) => [
                'id' => $i->id,
                'shop' => $i->shop?->name,
                'product' => $i->product?->name,
                'sku' => $i->sku,
                'title' => $i->title,
                'active' => (bool)$i->active,
                'stock' => (int)$i->stock_quantity,
                'sold' => (int)$i->sold_quantity,
                'price' => (float)$i->sale_price,
                'offer_price' => (float)$i->offer_price,
            ]);

        return Inertia::render('Admin/Catalog/InventoryProducts', [
            'rows' => $rows,
        ]);
    }
}

