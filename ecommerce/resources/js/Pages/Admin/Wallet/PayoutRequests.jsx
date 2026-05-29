import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import StatusPill from '@/Components/Admin/StatusPill';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

export default function AdminPayoutRequests({ requests, stats }) {
    return (
        <PanelLayout title="Payout Requests" subtitle="Delivered orders ready for seller payout.">
            <Head title="Payout Requests — Admin" />
            <div className="grid gap-4 sm:grid-cols-1">
                <StatCard label="Ready for Payout" value={stats.total} icon="fa-money-bill-transfer" />
            </div>
            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Payout Queue" subtitle="Paid and delivered orders awaiting seller payout." />
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Order</th>
                                <th className="py-2 pr-4">Customer</th>
                                <th className="py-2 pr-4">Store</th>
                                <th className="py-2 pr-4">Amount</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.data.map(r => (
                                <tr key={r.id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4 font-semibold text-zinc-900">{r.order_number}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{r.user?.name}</td>
                                    <td className="py-3 pr-4 text-zinc-600">{r.store?.name}</td>
                                    <td className="py-3 pr-4 font-bold text-emerald-600">{fmt(r.total)}</td>
                                    <td className="py-3 pr-4"><StatusPill value={r.status} /></td>
                                    <td className="py-3 pr-4 text-zinc-500 text-xs">{new Date(r.updated_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.data.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No payout requests yet.</p>}
                </div>
            </section>
        </PanelLayout>
    );
}
