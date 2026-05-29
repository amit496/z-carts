import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';

export default function Cart({ carts = [], total = 0 }) {
    function remove(cartId) {
        router.delete(`/cart/${cartId}`);
    }

    function updateQty(cartId, qty) {
        if (qty < 1) return;
        router.patch(`/cart/${cartId}`, { quantity: qty }, { preserveScroll: true });
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>

                {carts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-lg">Your cart is empty.</p>
                        <a href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">Continue Shopping</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {carts.map((cart) => (
                            <div key={cart.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {cart.inventory?.image ? (
                                        <img src={cart.inventory.image} alt={cart.inventory.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{cart.inventory?.title}</p>
                                    <p className="text-sm text-gray-500">{cart.shop?.name}</p>
                                    <p className="text-indigo-600 font-bold mt-1">${cart.unit_price}</p>
                                </div>

                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button onClick={() => updateQty(cart.id, cart.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 text-lg">−</button>
                                    <span className="px-3 py-1 text-sm">{cart.quantity}</span>
                                    <button onClick={() => updateQty(cart.id, cart.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 text-lg">+</button>
                                </div>

                                <p className="w-20 text-right font-semibold text-gray-800">${(cart.unit_price * cart.quantity).toFixed(2)}</p>

                                <button onClick={() => remove(cart.id)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                            </div>
                        ))}

                        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total</p>
                                <p className="text-2xl font-bold text-gray-900">${total}</p>
                            </div>
                            <a href="/checkout" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                Checkout
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
