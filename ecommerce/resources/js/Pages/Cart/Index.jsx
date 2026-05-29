import Navbar from '@/Components/Navbar';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Index({ cartItems }) {
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const remove = (id) => router.delete(`/cart/${id}`, { preserveScroll: true });

    const updateQty = (id, qty) => {
        if (qty < 1) return;
        router.patch(`/cart/${id}`, { quantity: qty }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Cart" />
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
                        <Link href="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Shop Now</Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                                        <p className="text-indigo-600 font-bold">${item.product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">−</button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">+</button>
                                    </div>
                                    <p className="w-20 text-right font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-white rounded-xl shadow p-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">Total</p>
                                <p className="text-3xl font-bold text-indigo-600">${total.toFixed(2)}</p>
                            </div>
                            <Link href="/orders" className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
