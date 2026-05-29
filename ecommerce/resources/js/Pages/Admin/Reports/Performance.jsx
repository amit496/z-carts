import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

export default function AdminPerformance({ stats, daily = [] }) {
    const max = Math.max(...daily.map(d => d.revenue), 1);

    return (
        <PanelLayout title="Performance" subtitle="Platform KPIs and daily activity.">
            <Head title="Performance — Admin" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Users" value={stats.users} hint={`+${stats.new_users} this month`} icon="fa-users" />
                <StatCard label="Total Stores" value={stats.stores} hint={`${stats.approved_stores} approved`} icon="fa-store" />
                <StatCard label="Total Revenue" value={fmt(stats.revenue)} hint={`Avg ${fmt(stats.avg_order)}/order`} icon="fa-sack-dollar" />
                <StatCard label="Cancellations" value={stats.cancelled} hint={`of ${stats.orders} total orders`} icon="fa-circle-xmark" />
            </div>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Daily Revenue — Last 30 Days" subtitle="Revenue trend across the platform." />
                {daily.length === 0 ? (
                    <p className="py-10 text-center text-sm text-zinc-400">No data yet.</p>
                ) : (
                    <div className="flex items-end gap-1 h-40 mt-3 overflow-x-auto">
                        {daily.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 shrink-0" style={{ minWidth: '28px' }}>
                                <div
                                    className="w-5 bg-brand-orange rounded-t-[2px] hover:bg-orange-400 transition-all cursor-default"
                                    style={{ height: `${(d.revenue / max) * 110}px`, minHeight: '3px' }}
                                    title={`${d.date}: ${fmt(d.revenue)}`}
                                />
                                <p className="text-[8px] text-zinc-400 rotate-45 origin-left mt-1">{d.date?.slice(5)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400">Conversion Rate</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">
                        {stats.orders > 0 ? ((stats.orders / Math.max(stats.users, 1)) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-[11px] text-zinc-500">Orders per user</p>
                </div>
                <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400">Cancellation Rate</p>
                    <p className="mt-2 text-3xl font-bold text-rose-600">
                        {stats.orders > 0 ? ((stats.cancelled / stats.orders) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-[11px] text-zinc-500">Of total orders</p>
                </div>
                <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400">Store Approval Rate</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                        {stats.stores > 0 ? ((stats.approved_stores / stats.stores) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-[11px] text-zinc-500">Approved stores</p>
                </div>
            </div>
        </PanelLayout>
    );
}
