import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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

export default function AdminTickets({ tickets, stats, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <PanelLayout title="Support Tickets" subtitle="Cancelled orders requiring attention.">
            <Head title="Tickets — Admin" />
            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Cancelled Orders" value={stats.total} icon="fa-circle-xmark" />
                <StatCard label="Refunded" value={stats.refunded} icon="fa-rotate-left" />
            </div>
            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Cancelled Orders" subtitle="Review and process refunds for cancelled orders." />
                <div className="mb-4 flex gap-2">
                    <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && router.get('/admin/support/tickets', { search: e.target.value })}
                        placeholder="Search order # or customer..." className="rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange w-56" />
                    <button onClick={() => router.get('/admin/support/tickets', { search })} className="rounded-[3px] bg-brand-orange px-4 py-2 text-sm font-semibold text-white">Search</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Order</th>
                                <th className="py-2 pr-4">Customer</th>
                                <th className="py-2 pr-4">Store</th>
                                <th className="py-2 pr-4">Total</th>
                                <th className="py-2 pr-4">Payment</th>
                                <th className="py-2 pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.data.map(t => (
                                <tr key={t.id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4">
                                        <p className="font-semibold text-zinc-900">{t.order_number}</p>
                                        <p className="text-[11px] text-zinc-500">{new Date(t.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-3 pr-4 text-zinc-600">{t.user?.name}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{t.store?.name}</td>
                                    <td className="py-3 pr-4 font-semibold">{fmt(t.total)}</td>
                                    <td className="py-3 pr-4"><StatusPill value={t.payment_status} /></td>
                                    <td className="py-3 pr-4">
                                        {t.payment_status === 'paid' && (
                                            <button onClick={() => router.patch(`/admin/support/refunds/${t.id}`, {}, { preserveScroll: true })}
                                                className="rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">
                                                Process Refund
                                            </button>
                                        )}
                                        {t.payment_status === 'refunded' && <StatusPill value="refunded" />}
                                        {t.payment_status === 'unpaid' && <StatusPill value="unpaid" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tickets.data.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No cancelled orders.</p>}
                </div>
                <Pagination meta={tickets.meta} path="/admin/support/tickets" />
            </section>
        </PanelLayout>
    );
}
