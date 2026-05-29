import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_COLORS = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700', processing:'bg-purple-100 text-purple-700', shipped:'bg-indigo-100 text-indigo-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' };

export default function AdminDashboard({ stats, recentOrders }) {
    const cards = [
        { label: 'Total Users', value: stats.users, icon: '👥', color: 'bg-blue-50 text-blue-700' },
        { label: 'Sellers', value: stats.sellers, icon: '🏪', color: 'bg-purple-50 text-purple-700' },
        { label: 'Products', value: stats.products, icon: '👗', color: 'bg-pink-50 text-pink-700' },
        { label: 'Orders', value: stats.orders, icon: '📦', color: 'bg-orange-50 text-orange-700' },
        { label: 'Revenue', value: `$${Number(stats.revenue).toFixed(2)}`, icon: '💰', color: 'bg-green-50 text-green-700' },
        { label: 'Pending Stores', value: stats.pending_stores, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {cards.map(c => (
                    <div key={c.label} className={`${c.color} rounded-2xl p-5`}>
                        <p className="text-2xl mb-1">{c.icon}</p>
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-sm font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between">
                    <h2 className="font-bold text-gray-800">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-indigo-600 text-sm hover:underline">View all →</Link>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {recentOrders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold text-gray-800">{o.order_number}</td>
                                <td className="px-4 py-3 text-gray-600">{o.user?.name}</td>
                                <td className="px-4 py-3 text-gray-600">{o.store?.name}</td>
                                <td className="px-4 py-3 font-bold">${o.total}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
