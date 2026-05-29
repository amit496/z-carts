import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

export default function AdminWallet({ payouts, stats }) {
    return (
        <PanelLayout title="Wallet" subtitle="Platform revenue and seller payout overview.">
            <Head title="Wallet — Admin" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Revenue" value={fmt(stats.total_revenue)} icon="fa-sack-dollar" />
                <StatCard label="Paid Orders" value={stats.total_orders} icon="fa-credit-card" />
                <StatCard label="Pending Payout" value={fmt(stats.pending_payout)} icon="fa-clock" />
                <StatCard label="Total Refunded" value={fmt(stats.total_refunded)} icon="fa-rotate-left" />
            </div>
            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Store Revenue Breakdown" subtitle="Total sales per store from paid orders." />
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Store</th>
                                <th className="py-2 pr-4">Orders</th>
                                <th className="py-2 pr-4">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.data.map(p => (
                                <tr key={p.store_id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4 font-semibold text-zinc-900">{p.store?.name ?? `Store #${p.store_id}`}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{p.order_count}</td>
                                    <td className="py-3 pr-4 font-bold text-emerald-600">{fmt(p.total_sales)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {payouts.data.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No payout data yet.</p>}
                </div>
            </section>
        </PanelLayout>
    );
}
