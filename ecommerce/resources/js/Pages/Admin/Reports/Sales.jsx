import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

function BarChart({ data = [], valueKey = 'revenue', labelKey = 'month' }) {
    if (!data.length) return <p className="py-8 text-center text-sm text-zinc-400">No data yet.</p>;
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="flex items-end gap-1.5 h-36 mt-3">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <p className="text-[9px] text-zinc-500 truncate w-full text-center">{fmt(d[valueKey])}</p>
                    <div className="w-full bg-brand-orange rounded-t-[2px]" style={{ height: `${(d[valueKey] / max) * 90}px`, minHeight: '3px' }} />
                    <p className="text-[9px] text-zinc-400 truncate">{String(d[labelKey]).slice(-5)}</p>
                </div>
            ))}
        </div>
    );
}

export default function AdminSalesReport({ monthly, topProducts, topStores, stats }) {
    return (
        <PanelLayout title="Sales Reports" subtitle="Revenue, orders and top performers.">
            <Head title="Sales Reports — Admin" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Revenue" value={fmt(stats.total_revenue)} icon="fa-sack-dollar" />
                <StatCard label="Total Orders" value={stats.total_orders} icon="fa-receipt" />
                <StatCard label="Avg Order Value" value={fmt(stats.avg_order)} icon="fa-chart-line" />
                <StatCard label="Total Products" value={stats.total_products} icon="fa-boxes-stacked" />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Monthly Revenue" subtitle="Last 12 months" />
                    <BarChart data={monthly} valueKey="revenue" labelKey="month" />
                </section>

                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Monthly Orders" subtitle="Order volume trend" />
                    <BarChart data={monthly} valueKey="orders" labelKey="month" />
                </section>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Top Products" subtitle="By order count" />
                    <div className="space-y-2 mt-2">
                        {topProducts.map((p, i) => (
                            <div key={p.id} className="flex items-center justify-between gap-3 rounded-[3px] border border-zinc-100 p-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-[11px] font-bold text-zinc-400 w-5">#{i + 1}</span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-zinc-900">{p.name}</p>
                                        <p className="text-[11px] text-zinc-500">{fmt(p.price)}</p>
                                    </div>
                                </div>
                                <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold text-brand-orange">
                                    {p.order_items_count} sold
                                </span>
                            </div>
                        ))}
                        {!topProducts.length && <p className="py-6 text-center text-sm text-zinc-400">No data yet.</p>}
                    </div>
                </section>

                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Top Stores" subtitle="By order count" />
                    <div className="space-y-2 mt-2">
                        {topStores.map((s, i) => (
                            <div key={s.id} className="flex items-center justify-between gap-3 rounded-[3px] border border-zinc-100 p-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-[11px] font-bold text-zinc-400 w-5">#{i + 1}</span>
                                    <p className="truncate text-sm font-semibold text-zinc-900">{s.name}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[11px] font-bold text-zinc-900">{fmt(s.orders_sum_total)}</p>
                                    <p className="text-[10px] text-zinc-400">{s.orders_count} orders</p>
                                </div>
                            </div>
                        ))}
                        {!topStores.length && <p className="py-6 text-center text-sm text-zinc-400">No data yet.</p>}
                    </div>
                </section>
            </div>
        </PanelLayout>
    );
}
