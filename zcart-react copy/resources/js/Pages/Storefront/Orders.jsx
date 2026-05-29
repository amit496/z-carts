import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
const statusColors = { 1:'bg-yellow-100 text-yellow-700', 3:'bg-blue-100 text-blue-700', 4:'bg-purple-100 text-purple-700', 6:'bg-green-100 text-green-700', 8:'bg-red-100 text-red-700' };
export default function Orders({ orders }) {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
                {orders.data?.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map(order => (
                            <Link key={order.id} href={`/account/orders/${order.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">#{order.order_number}</p>
                                        <p className="text-sm text-gray-400 mt-1">{order.shop?.name} · {order.created_at}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">${order.grand_total}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${statusColors[order.order_status_id] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {order.order_status_id}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">📦</p>
                        <p>No orders yet.</p>
                        <Link href="/products" className="text-indigo-600 hover:underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
