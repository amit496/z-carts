import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const STATUS_COLORS = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700', processing:'bg-purple-100 text-purple-700', shipped:'bg-indigo-100 text-indigo-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' };

export default function OrderDetail({ order }) {
    const addr = order.shipping_address;
    return (
        <MainLayout>
            <Head title={`Order ${order.order_number}`} />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Link href="/orders" className="text-indigo-600 text-sm hover:underline mb-6 inline-block">← Back to Orders</Link>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black text-gray-900">{order.order_number}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <h3 className="font-bold text-gray-700 mb-3">Shipping Address</h3>
                        <p className="text-sm text-gray-600">{addr?.name}</p>
                        <p className="text-sm text-gray-600">{addr?.address}</p>
                        <p className="text-sm text-gray-600">{addr?.city}, {addr?.zip}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <h3 className="font-bold text-gray-700 mb-3">Order Info</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Store</span><span className="font-medium">{order.store?.name}</span></div>
                            <div className="flex justify-between"><span>Payment</span><span className="font-medium capitalize">{order.payment_method}</span></div>
                            <div className="flex justify-between"><span>Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
                            {order.tracking_number && <div className="flex justify-between"><span>Tracking</span><span className="font-medium text-indigo-600">{order.tracking_number}</span></div>}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                    <div className="p-5 border-b"><h3 className="font-bold text-gray-700">Items</h3></div>
                    {order.items.map(item => {
                        const img = item.product?.images?.[0]?.image ? `/storage/${item.product.images[0].image}` : `https://placehold.co/80x96/e2e8f0/64748b?text=Item`;
                        return (
                            <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-0">
                                <img src={img} alt={item.product_name} className="w-16 h-20 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.product_name}</p>
                                    {(item.size || item.color) && <p className="text-xs text-gray-500">{item.size} / {item.color}</p>}
                                    <p className="text-sm text-gray-500">×{item.quantity}</p>
                                </div>
                                <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.subtotal}</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount}</span></div>}
                        <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping == 0 ? 'Free' : `$${order.shipping}`}</span></div>
                        <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2"><span>Total</span><span>${order.total}</span></div>
                    </div>
                </div>

                {['pending','confirmed'].includes(order.status) && (
                    <button onClick={() => router.patch(`/orders/${order.id}/cancel`)} className="mt-4 w-full border-2 border-red-400 text-red-500 font-semibold py-3 rounded-xl hover:bg-red-50 transition">
                        Cancel Order
                    </button>
                )}
            </div>
        </MainLayout>
    );
}
