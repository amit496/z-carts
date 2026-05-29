import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats, recent_orders = [], top_products = [] }) {
    const cards = [
        { label: 'Total Orders',   value: stats.orders,         color: 'bg-indigo-500',  icon: '🛒' },
        { label: 'Total Revenue',  value: `$${stats.revenue}`,  color: 'bg-green-500',   icon: '💰' },
        { label: 'Products',       value: stats.products,       color: 'bg-purple-500',  icon: '📦' },
        { label: 'Customers',      value: stats.customers,      color: 'bg-orange-500',  icon: '👥' },
        { label: 'Shops',          value: stats.shops,          color: 'bg-pink-500',    icon: '🏪' },
        { label: 'Pending Orders', value: stats.pending_orders, color: 'bg-yellow-500',  icon: '⏳' },
    ];

    const statusColors = {
        'Pending':          'bg-yellow-100 text-yellow-700',
        'Confirmed':        'bg-blue-100 text-blue-700',
        'Fulfilled':        'bg-purple-100 text-purple-700',
        'Delivered':        'bg-green-100 text-green-700',
        'Cancelled':        'bg-red-100 text-red-700',
        'Payment Error':    'bg-red-100 text-red-700',
        'Awaiting Delivery':'bg-indigo-100 text-indigo-700',
    };

    return (
        <AdminLayout title="Dashboard">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                {cards.map(c => (
                    <div key={c.label} className={`${c.color} text-white rounded-xl p-5 shadow`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">{c.label}</p>
                                <p className="text-3xl font-bold mt-1">{c.value}</p>
                            </div>
                            <span className="text-3xl opacity-60">{c.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs text-indigo-600 hover:underline">View all →</Link>
                    </div>
                    {recent_orders.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b">
                                    <th className="pb-2">Order #</th>
                                    <th className="pb-2">Customer</th>
                                    <th className="pb-2">Total</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_orders.map(o => (
                                    <tr key={o.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            <Link href={`/admin/orders/${o.id}`} className="text-indigo-600 hover:underline font-medium">
                                                #{o.order_number}
                                            </Link>
                                        </td>
                                        <td className="py-2 text-gray-600">{o.customer}</td>
                                        <td className="py-2 font-semibold">${o.grand_total}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-6">No orders yet.</p>
                    )}
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700">Top Products</h2>
                        <Link href="/admin/products" className="text-xs text-indigo-600 hover:underline">View all →</Link>
                    </div>
                    {top_products.length > 0 ? (
                        <ul className="space-y-3">
                            {top_products.map((p, i) => (
                                <li key={p.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-gray-700">{p.name}</span>
                                    </div>
                                    <span className="text-indigo-600 font-semibold text-sm">{p.sale_count} sold</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-6">No sales data yet.</p>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 bg-white rounded-xl shadow p-5">
                <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { href: '/admin/products/create', label: '+ Add Product',    color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                        { href: '/admin/categories',      label: '🗂 Categories',    color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                        { href: '/admin/orders',          label: '🛒 All Orders',    color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                        { href: '/admin/customers',       label: '👥 Customers',     color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                        { href: '/admin/shops',           label: '🏪 Shops',         color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
                        { href: '/admin/coupons',         label: '🎟 Coupons',       color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
                        { href: '/admin/banners',         label: '🖼 Banners',       color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                        { href: '/admin/reports',         label: '📈 Reports',       color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
                    ].map(a => (
                        <Link key={a.href} href={a.href}
                            className={`${a.color} rounded-xl p-3 text-sm font-medium text-center transition`}>
                            {a.label}
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
