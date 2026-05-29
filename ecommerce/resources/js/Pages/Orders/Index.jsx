import Navbar from '@/Components/Navbar';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ orders }) {
    const { data, setData, post, processing, errors, reset } = useForm({ shipping_address: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/orders', { onSuccess: () => reset() });
    };

    return (
        <>
            <Head title="Orders" />
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-10">
                {/* Checkout Form */}
                <div className="bg-white rounded-xl shadow p-6 mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Place New Order</h2>
                    <form onSubmit={submit} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Shipping address"
                            value={data.shipping_address}
                            onChange={e => setData('shipping_address', e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Place Order
                        </button>
                    </form>
                    {errors.shipping_address && <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>}
                    {errors.cart && <p className="text-red-500 text-sm mt-1">{errors.cart}</p>}
                </div>

                {/* Order History */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders yet.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                        <p className="text-sm text-gray-400">{order.shipping_address}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{order.status}</span>
                                        <p className="text-indigo-600 font-bold mt-1">${order.total}</p>
                                    </div>
                                </div>
                                <div className="divide-y">
                                    {order.items.map(item => (
                                        <div key={item.id} className="py-2 flex justify-between text-sm text-gray-600">
                                            <span>{item.product?.name} × {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
