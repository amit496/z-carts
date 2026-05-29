import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import Modal from '@/Components/Admin/Modal';

const PAY_COLORS = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-rose-100 text-rose-700' };

function OrderDetailModal({ order, onClose }) {
    if (!order) return null;
    const addr = order.shipping_address || {};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="font-bold text-zinc-800">Order #{order.order_number}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><i className="fa-solid fa-xmark" /></button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Customer</p><p className="font-medium">{order.user?.name}</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Store</p><p className="font-medium">{order.store?.name}</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Total</p><p className="font-bold">${order.total}</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Payment</p><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${PAY_COLORS[order.payment_status]}`}>{order.payment_status}</span></div>
                    <div className="rounded-lg bg-zinc-50 p-3 col-span-2"><p className="text-xs text-zinc-400 mb-1">Address</p><p className="font-medium">{addr.name} — {addr.address}, {addr.city}</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 col-span-2"><p className="text-xs text-zinc-400 mb-1">Date</p><p className="font-medium">{new Date(order.created_at).toLocaleString()}</p></div>
                </div>
                <div className="border-t px-5 py-3 flex justify-end">
                    <button onClick={onClose} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">Close</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminCancellations({ orders, stats }) {
    const [selected, setSelected] = useState(null);
    const { confirm, success } = useAlert();

    const processRefund = (order) => {
        confirm(
            `Process refund of $${order.total} for order #${order.order_number}?`,
            () => router.patch(`/admin/support/refunds/${order.id}`, {}, {
                preserveScroll: true,
                onSuccess: () => success('Refund processed successfully!'),
            }),
            { title: 'Process Refund?', confirmText: 'Yes, Refund', icon: 'question' }
        );
    };

    return (
        <AdminLayout title="Cancellations">
            <Head title="Cancellations — Admin" />
            <OrderDetailModal order={selected} onClose={() => setSelected(null)} />

            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Cancelled', value: stats.total,          color: 'bg-red-50 text-red-700',    icon: 'fa-circle-xmark' },
                    { label: 'Pending Refund',  value: stats.pending_refund, color: 'bg-yellow-50 text-yellow-700', icon: 'fa-clock' },
                    { label: 'Refunded',        value: stats.refunded,       color: 'bg-green-50 text-green-700', icon: 'fa-rotate-left' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {orders.data.map(o => (
                            <tr key={o.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3 font-semibold text-zinc-800">{o.order_number}</td>
                                <td className="px-4 py-3 text-zinc-600">{o.user?.name}</td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{o.store?.name}</td>
                                <td className="px-4 py-3 font-bold text-zinc-800">${o.total}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${PAY_COLORS[o.payment_status]}`}>{o.payment_status}</span></td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button onClick={() => setSelected(o)} className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                                            <i className="fa-solid fa-eye mr-1" />View
                                        </button>
                                        {o.payment_status === 'paid' && (
                                            <button onClick={() => processRefund(o)} className="rounded bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100">
                                                <i className="fa-solid fa-rotate-left mr-1" />Refund
                                            </button>
                                        )}
                                        {o.payment_status === 'refunded' && (
                                            <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                                                <i className="fa-solid fa-check mr-1" />Refunded
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.data.length === 0 && <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-circle-xmark text-3xl mb-2 block" />No cancellations found</div>}
            </div>

            {orders.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {orders.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
