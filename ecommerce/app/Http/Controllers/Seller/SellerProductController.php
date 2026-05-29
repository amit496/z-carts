<?php
namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Concerns\InteractsWithImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SellerProductController extends Controller
{
    use InteractsWithImages;

    private function getStore() { return auth()->user()->store; }

    public function index(Request $request)
    {
        $query = Product::with('images', 'category')
            ->where('store_id', $this->getStore()->id)->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('brand', 'like', "%{$request->search}%");
            });
        }

        $products = $query->paginate(15)->withQueryString();
        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
            'filters'  => $request->only('search'),
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Seller/Products/Form', ['categories' => $categories]);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create([
            ...$request->only('name','description','price','compare_price','category_id','brand','material','gender','stock'),
            'store_id' => $this->getStore()->id,
            'slug' => Str::slug($request->name).'-'.Str::random(5),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $this->storeImage($file, 'products');
                ProductImage::create(['product_id' => $product->id, 'image' => $path, 'is_primary' => $i === 0, 'sort_order' => $i]);
            }
        }

        if ($request->variants) {
            foreach ($request->variants as $v) {
                ProductVariant::create([...$v, 'product_id' => $product->id, 'sku' => 'SKU-'.strtoupper(Str::random(8))]);
            }
        }

        return redirect()->route('seller.products.index')->with('success', 'Product created!');
    }

    public function edit(Product $product)
    {
        abort_if($product->store_id !== $this->getStore()->id, 403);
        $product->load('images', 'variants', 'category');
        $categories = Category::all();
        return Inertia::render('Seller/Products/Form', ['product' => $product, 'categories' => $categories]);
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->store_id !== $this->getStore()->id, 403);
        $request->validate(['name' => 'required|string', 'price' => 'required|numeric|min:0']);

        $product->update($request->only('name','description','price','compare_price','category_id','brand','material','gender','stock','is_active','is_featured'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $this->storeImage($file, 'products');
                ProductImage::create(['product_id' => $product->id, 'image' => $path, 'is_primary' => false, 'sort_order' => $product->images()->count() + $i]);
            }
        }

        return back()->with('success', 'Product updated!');
    }

    public function destroy(Product $product)
    {
        abort_if($product->store_id !== $this->getStore()->id, 403);
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }
}
