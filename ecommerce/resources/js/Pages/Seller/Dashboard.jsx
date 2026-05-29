import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

function RevenueChart({ data = [] }) {
    if (!data.length) return <p className="text-center py-8 text-gray-400 text-sm">No revenue data yet.</p>;

    const max = Math.max(...data.map(d => d.revenue), 1);

    return (
        <div className="flex items-end gap-2 h-32 mt-2">
            {data.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-gray-600">${Number(d.revenue).toFixed(0)}</p>
                    <div
                        className="w-full bg-orange-400 rounded-t-lg transition-all"
                        style={{ height: `${(d.revenue / max) * 80}px`, minHeight: '4px' }}
                    />
                    <p className="text-[9px] text-gray-400">{d.month?.slice(5)}</p>
                </div>
            ))}
        </div>
    );
}

export default function SellerDashboard({ store, totalRevenue, totalOrders, totalProducts, recentOrders, pendingOrders, monthlyRevenue = [] }) {
    const stats = [
        { label: 'Total Revenue', value: `$${Number(totalRevenue).toFixed(2)}`, icon: '💰', color: 'bg-green-50 text-green-700' },
        { label: 'Total Orders', value: totalOrders, icon: '📦', color: 'bg-blue-50 text-blue-700' },
        { label: 'Products', value: totalProducts, icon: '👗', color: 'bg-purple-50 text-purple-700' },
        { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    ];

    return (
        <SellerLayout title="Dashboard">
            <Head title="Seller Dashboard" />

            {store.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-yellow-800 text-sm">
                    ⏳ Your store is pending approval. You can add products but they won't be visible until approved.
                </div>
            )}
            {store.status === 'suspended' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-800 text-sm">
                    🚫 Your store has been suspended. Please contact support.
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
                        <p className="text-2xl mb-1">{s.icon}</p>
                        <p className="text-2xl font-black">{s.value}</p>
                        <p className="text-sm font-medium opacity-80">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b flex items-center justify-between">
                        <h2 className="font-bold text-gray-800">Recent Orders</h2>
                        <Link href="/seller/orders" className="text-orange-500 text-sm hover:underline font-semibold">View all →</Link>
                    </div>
                    <div className="divide-y">
                        {recentOrders.length === 0 ? (
                            <p className="text-center py-10 text-gray-400">No orders yet</p>
                        ) : recentOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{order.order_number}</p>
                                    <p className="text-xs text-gray-500">{order.user?.name} · {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <span className="font-bold text-sm">${order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-800 mb-1">Monthly Revenue</h2>
                    <p className="text-xs text-gray-400 mb-3">Last 6 months</p>
                    <RevenueChart data={monthlyRevenue} />

                    {/* Quick Links */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link href="/seller/products/create" className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm px-4 py-3 rounded-xl transition">
                            <span>➕</span> Add Product
                        </Link>
                        <Link href="/seller/coupons" className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm px-4 py-3 rounded-xl transition">
                            <span>🎟️</span> Coupons
                        </Link>
                        <Link href="/seller/store/edit" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm px-4 py-3 rounded-xl transition">
                            <span>🏪</span> Store Settings
                        </Link>
                        <Link href="/chat" className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm px-4 py-3 rounded-xl transition">
                            <span>💬</span> Messages
                        </Link>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
