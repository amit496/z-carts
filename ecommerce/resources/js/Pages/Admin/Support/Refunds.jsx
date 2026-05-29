import { Head, router } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

function Pagination({ meta }) {
    if (!meta || meta.last_page <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => router.get('/admin/support/refunds', { page: p }, { preserveScroll: true })}
                        className={`rounded-[3px] px-2.5 py-1 font-semibold ${p === meta.current_page ? 'bg-brand-orange text-white' : 'border border-zinc-200 bg-white text-zinc-700'}`}>{p}</button>
                ))}
            </div>
        </div>
    );
}

export default function AdminRefunds({ refunds, stats }) {
    return (
        <PanelLayout title="Refunds" subtitle="All processed refunds.">
            <Head title="Refunds — Admin" />
            <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
                <StatCard label="Total Refunds" value={stats.total} icon="fa-rotate-left" />
            </div>
            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Refunded Orders" subtitle="Orders where payment has been refunded to customer." />
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Order</th>
                                <th className="py-2 pr-4">Customer</th>
                                <th className="py-2 pr-4">Store</th>
                                <th className="py-2 pr-4">Amount</th>
                                <th className="py-2 pr-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {refunds.data.map(r => (
                                <tr key={r.id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4 font-semibold text-zinc-900">{r.order_number}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{r.user?.name}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{r.store?.name}</td>
                                    <td className="py-3 pr-4 font-semibold text-rose-600">{fmt(r.total)}</td>
                                    <td className="py-3 pr-4 text-zinc-500">{new Date(r.updated_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {refunds.data.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No refunds yet.</p>}
                </div>
                <Pagination meta={refunds.meta} />
            </section>
        </PanelLayout>
    );
}
