<?php
namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\Category;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    private function shopId()
    {
        return Auth::user()->shop?->id;
    }

    public function index()
    {
        return Inertia::render('Merchant/Products/Index', [
            'products' => Product::where('shop_id', $this->shopId())
                ->with('manufacturer', 'categories')->latest()->paginate(20)
                ->through(fn($p) => [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'min_price'    => $p->min_price,
                    'sale_count'   => $p->sale_count,
                    'active'       => $p->active,
                    'manufacturer' => $p->manufacturer?->name,
                    'categories'   => $p->categories->pluck('name')->join(', '),
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Merchant/Products/Form', [
            'categories'    => Category::where('active', true)->get(['id', 'name']),
            'manufacturers' => Manufacturer::where('active', true)->get(['id', 'name']),
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'min_price'       => 'required|numeric|min:0',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'active'          => 'boolean',
            'categories'      => 'nullable|array',
        ]);

        $data['shop_id'] = $this->shopId();
        $data['slug']    = Str::slug($data['name']) . '-' . Str::random(5);

        $product = Product::create($data);
        if (!empty($data['categories'])) {
            $product->categories()->sync($data['categories']);
        }

        return redirect('/merchant/products')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        abort_if($product->shop_id !== $this->shopId(), 403);
        return Inertia::render('Merchant/Products/Form', [
            'product'       => $product->load('categories'),
            'categories'    => Category::where('active', true)->get(['id', 'name']),
            'manufacturers' => Manufacturer::where('active', true)->get(['id', 'name']),
        ]);
    }

    public function update(Request $r, Product $product)
    {
        abort_if($product->shop_id !== $this->shopId(), 403);
        $data = $r->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'min_price'       => 'required|numeric|min:0',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'active'          => 'boolean',
            'categories'      => 'nullable|array',
        ]);
        $product->update($data);
        if (isset($data['categories'])) {
            $product->categories()->sync($data['categories']);
        }
        return redirect('/merchant/products')->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        abort_if($product->shop_id !== $this->shopId(), 403);
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }
}
