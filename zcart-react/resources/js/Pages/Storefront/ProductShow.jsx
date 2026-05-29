import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductShow({ product, inventory, relatedProducts = [] }) {
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    function addToCart() {
        setAdding(true);
        router.post(`/cart/add/${inventory.slug}`, { quantity: qty }, {
            onFinish: () => setAdding(false),
        });
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Image */}
                    <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <p className="text-sm text-indigo-600 font-medium mb-1">{product.manufacturer?.name}</p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                        <p className="text-2xl font-bold text-indigo-600 mb-4">${inventory?.sale_price ?? product.min_price}</p>

                        {product.description && (
                            <div className="text-gray-600 text-sm mb-6 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-medium text-gray-700">Qty:</label>
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100">−</button>
                                <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
                            </div>
                        </div>

                        <button onClick={addToCart} disabled={adding}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 transition">
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Related */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                            {relatedProducts.map((p) => (
                                <a key={p.id} href={`/product/${p.slug}`}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                                    <div className="aspect-square bg-gray-100">
                                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                        <p className="text-indigo-600 font-bold text-sm mt-1">${p.min_price}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
