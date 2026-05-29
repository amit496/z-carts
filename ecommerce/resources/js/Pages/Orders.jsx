import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
};

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function Orders({ orders }) {
    return (
        <MainLayout>
            <Head title="My Orders — ZMarket" />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Orders</h1>

                {orders.data.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📦</p>
                        <p className="text-xl font-semibold text-gray-700 mb-2">No orders yet</p>
                        <Link href="/shop" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b">
                                    <div>
                                        <p className="font-bold text-gray-900">{order.order_number}</p>
                                        <p className="text-sm text-gray-500">{order.store?.name} · {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                                        <span className="font-bold text-gray-900">${order.total}</span>
                                        <Link href={`/orders/${order.id}`} className="text-indigo-600 text-sm hover:underline">Details →</Link>
                                    </div>
                                </div>

                                {/* Progress */}
                                {!['cancelled','refunded'].includes(order.status) && (
                                    <div className="px-5 py-3">
                                        <div className="flex items-center justify-between">
                                            {STEPS.map((step, i) => {
                                                const stepIdx = STEPS.indexOf(order.status);
                                                const done = i <= stepIdx;
                                                return (
                                                    <div key={step} className="flex flex-col items-center flex-1">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {done ? '✓' : i + 1}
                                                        </div>
                                                        <p className={`text-xs mt-1 capitalize hidden sm:block ${done ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>{step}</p>
                                                        {i < STEPS.length - 1 && (
                                                            <div className={`absolute h-0.5 w-full ${done ? 'bg-indigo-600' : 'bg-gray-100'}`} style={{ display: 'none' }} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Items preview */}
                                <div className="px-5 pb-4 flex gap-2 flex-wrap">
                                    {order.items?.slice(0, 3).map(item => {
                                        const img = item.product?.images?.[0]?.image ? `/storage/${item.product.images[0].image}` : `https://placehold.co/60x70/e2e8f0/64748b?text=${encodeURIComponent(item.product_name)}`;
                                        return (
                                            <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                                <img src={img} alt={item.product_name} className="w-10 h-12 object-cover rounded-lg" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 line-clamp-1 max-w-[120px]">{item.product_name}</p>
                                                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {order.items?.length > 3 && <div className="flex items-center px-3 py-2 text-xs text-gray-400">+{order.items.length - 3} more</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
