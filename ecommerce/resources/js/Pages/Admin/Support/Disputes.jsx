import { Head, router } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import StatusPill from '@/Components/Admin/StatusPill';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

function Pagination({ meta, path }) {
    if (!meta || meta.last_page <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => router.get(path, { page: p }, { preserveScroll: true })}
                        className={`rounded-[3px] px-2.5 py-1 font-semibold ${p === meta.current_page ? 'bg-brand-orange text-white' : 'border border-zinc-200 bg-white text-zinc-700'}`}>{p}</button>
                ))}
            </div>
        </div>
    );
}

export default function AdminDisputes({ disputes, stats }) {
    return (
        <PanelLayout title="Disputes" subtitle="Orders with payment issues.">
            <Head title="Disputes — Admin" />
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Active Disputes" value={stats.total} icon="fa-triangle-exclamation" />
                <StatCard label="Unpaid Orders" value={stats.unpaid} icon="fa-credit-card" />
                <StatCard label="Refunded" value={stats.refunded} icon="fa-rotate-left" />
            </div>
            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Payment Disputes" subtitle="Orders that are confirmed/shipped but payment is unpaid." />
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Order</th>
                                <th className="py-2 pr-4">Customer</th>
                                <th className="py-2 pr-4">Store</th>
                                <th className="py-2 pr-4">Total</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disputes.data.map(d => (
                                <tr key={d.id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4">
                                        <p className="font-semibold text-zinc-900">{d.order_number}</p>
                                        <p className="text-[11px] text-zinc-500">{new Date(d.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-3 pr-4 text-zinc-600">{d.user?.name}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{d.store?.name}</td>
                                    <td className="py-3 pr-4 font-semibold">{fmt(d.total)}</td>
                                    <td className="py-3 pr-4"><StatusPill value={d.status} /></td>
                                    <td className="py-3 pr-4">
                                        <button onClick={() => router.patch(`/admin/orders/${d.id}/status`, { status: d.status, payment_status: 'paid' }, { preserveScroll: true })}
                                            className="rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">
                                            Mark Paid
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {disputes.data.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No disputes found.</p>}
                </div>
                <Pagination meta={disputes.meta} path="/admin/support/disputes" />
            </section>
        </PanelLayout>
    );
}
