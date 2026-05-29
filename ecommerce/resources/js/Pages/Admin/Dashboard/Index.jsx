import { Head, Link } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import StatusPill from '@/Components/Admin/StatusPill';

const statusText = (value) => (value ? value : '—');

function formatMoney(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

export default function AdminDashboard({ stats, recentOrders = [], recentStores = [], recentProducts = [] }) {
    const cards = [
        { label: 'Users', value: stats.users, hint: `${stats.active_users} active users`, icon: 'fa-users' },
        { label: 'Sellers', value: stats.sellers, hint: `${stats.pending_stores} pending stores`, icon: 'fa-store' },
        { label: 'Products', value: stats.products, hint: `${stats.low_stock} low stock items`, icon: 'fa-boxes-stacked' },
        { label: 'Orders', value: stats.orders, hint: `${stats.pending_orders} pending orders`, icon: 'fa-receipt' },
        { label: 'Revenue', value: formatMoney(stats.revenue), hint: `${stats.delivered_orders} delivered orders`, icon: 'fa-sack-dollar' },
        { label: 'Flash Sales', value: stats.flash_sales, hint: `${stats.featured_products} featured items`, icon: 'fa-bolt' },
    ];

    return (
        <PanelLayout
            title="Dashboard"
            subtitle="Marketplace overview with live numbers and moderation queues."
            actions={
                <>
                    <Link href="/admin/stores" className="rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
                        Review Vendors
                    </Link>
                    <Link href="/admin/products" className="rounded-[3px] bg-brand-orange px-3 py-2 text-xs font-semibold text-white">
                        Moderate Products
                    </Link>
                </>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader
                        title="Recent Orders"
                        subtitle="Latest marketplace orders across all stores."
                        actions={<Link href="/admin/orders" className="text-xs font-semibold text-brand-orange">View all</Link>}
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                <tr>
                                    <th className="py-2 pr-4">Order</th>
                                    <th className="py-2 pr-4">Customer</th>
                                    <th className="py-2 pr-4">Store</th>
                                    <th className="py-2 pr-4">Total</th>
                                    <th className="py-2 pr-4">Payment</th>
                                    <th className="py-2 pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-t border-zinc-100">
                                        <td className="py-3 pr-4 font-semibold text-zinc-900">{order.order_number}</td>
                                        <td className="py-3 pr-4 text-zinc-600">{statusText(order.user?.name)}</td>
                                        <td className="py-3 pr-4 text-zinc-600">{statusText(order.store?.name)}</td>
                                        <td className="py-3 pr-4 font-semibold text-zinc-900">{formatMoney(order.total)}</td>
                                        <td className="py-3 pr-4">
                                            <StatusPill value={order.payment_status} />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusPill value={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="grid gap-4">
                    <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <SectionHeader title="Recent Stores" subtitle="Stores that need admin attention." />
                        <div className="space-y-3">
                            {recentStores.map((store) => (
                                <div key={store.id} className="flex items-center justify-between gap-3 rounded-[3px] border border-zinc-100 p-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-zinc-900">{store.name}</p>
                                        <p className="truncate text-[11px] text-zinc-500">{store.user?.name}</p>
                                    </div>
                                    <StatusPill value={store.status} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <SectionHeader title="Recent Products" subtitle="Latest catalog items entered into the platform." />
                        <div className="space-y-3">
                            {recentProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-3 rounded-[3px] border border-zinc-100 p-3">
                                    <img
                                        src={product.images?.[0]?.image ? `/storage/${product.images[0].image}` : `https://picsum.photos/seed/${product.id}/120/120`}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-[3px] object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-zinc-900">{product.name}</p>
                                        <p className="text-[11px] text-zinc-500">{product.store?.name}</p>
                                    </div>
                                    <StatusPill value={product.is_active ? 'active' : 'inactive'} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PanelLayout>
    );
}
