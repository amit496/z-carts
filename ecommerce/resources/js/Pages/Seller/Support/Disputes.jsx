import { Head, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

function Pagination({ meta }) {
    if (!meta || meta.last_page <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-4 pb-4">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => router.get('/seller/support/disputes', { page: p }, { preserveScroll: true })}
                        className={`rounded-lg px-2.5 py-1 font-semibold text-xs ${p === meta.current_page ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>{p}</button>
                ))}
            </div>
        </div>
    );
}

export default function SellerDisputes({ disputes, stats }) {
    return (
        <SellerLayout title="Disputes">
            <Head title="Disputes — Seller" />

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 text-red-700 rounded-2xl p-4">
                    <p className="text-2xl font-black">{stats.total}</p>
                    <p className="text-sm font-medium opacity-80">Active Disputes</p>
                </div>
                <div className="bg-green-50 text-green-700 rounded-2xl p-4">
                    <p className="text-2xl font-black">{stats.refunded}</p>
                    <p className="text-sm font-medium opacity-80">Refunded</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="font-bold text-gray-800">Payment Disputes</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Orders that are in progress but payment is unpaid.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Total</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {disputes.data.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold text-gray-800">{d.order_number}</td>
                                    <td className="px-4 py-3 text-gray-600">{d.user?.name}</td>
                                    <td className="px-4 py-3 font-bold">{fmt(d.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {disputes.data.length === 0 && <p className="text-center py-10 text-gray-400">No disputes found.</p>}
                </div>
                <Pagination meta={disputes.meta} />
            </div>
        </SellerLayout>
    );
}
