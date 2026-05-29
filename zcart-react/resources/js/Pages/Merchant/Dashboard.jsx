import MerchantLayout from '@/Layouts/MerchantLayout';
import { Link } from '@inertiajs/react';

export default function MerchantDashboard({ shop, stats, recent_orders }) {
    const cards = [
        { label: 'Total Orders',   value: stats.total_orders,   color: 'bg-indigo-500' },
        { label: 'Pending Orders', value: stats.pending_orders, color: 'bg-yellow-500' },
        { label: 'Total Revenue',  value: `$${Number(stats.total_revenue).toFixed(2)}`, color: 'bg-green-500' },
        { label: 'Products',       value: stats.total_products, color: 'bg-purple-500' },
        { label: 'Inventory',      value: stats.total_inventory, color: 'bg-pink-500' },
        { label: 'Items Sold',     value: stats.total_sold,     color: 'bg-orange-500' },
    ];

    return (
        <MerchantLayout title="Dashboard">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                {cards.map(c => (
                    <div key={c.label} className={`${c.color} text-white rounded-xl p-5 shadow`}>
                        <p className="text-sm opacity-80">{c.label}</p>
                        <p className="text-3xl font-bold mt-1">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700">Recent Orders</h2>
                        <Link href="/merchant/orders" className="text-xs text-indigo-600 hover:underline">View all →</Link>
                    </div>
                    {recent_orders?.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Order #</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
                            </tr></thead>
                            <tbody>
                                {recent_orders.map(o => (
                                    <tr key={o.id} className="border-b last:border-0">
                                        <td className="py-2 text-indigo-600">
                                            <Link href={`/merchant/orders/${o.id}`}>#{o.order_number}</Link>
                                        </td>
                                        <td className="py-2">{o.customer}</td>
                                        <td className="py-2 font-semibold">${o.grand_total}</td>
                                        <td className="py-2"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{o.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p className="text-gray-400 text-sm">No orders yet.</p>}
                </div>

                <div className="bg-white rounded-xl shadow p-5">
                    <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { href: '/merchant/products/create', label: '+ Add Product', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                            { href: '/merchant/inventory/create', label: '+ Add Inventory', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                            { href: '/merchant/orders', label: '📦 View Orders', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                            { href: '/merchant/shop', label: '⚙️ Shop Settings', color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
                        ].map(a => (
                            <Link key={a.href} href={a.href} className={`${a.color} rounded-xl p-4 text-sm font-medium text-center transition`}>{a.label}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </MerchantLayout>
    );
}
