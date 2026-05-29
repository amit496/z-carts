import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const STATUS_COLORS = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
    refunded:   'bg-rose-100 text-rose-700',
};

const PAY_COLORS = {
    paid:     'bg-green-100 text-green-700',
    pending:  'bg-yellow-100 text-yellow-700',
    failed:   'bg-red-100 text-red-700',
    refunded: 'bg-rose-100 text-rose-700',
};

function OrderModal({ order, onClose }) {
    if (!order) return null;
    const addr = order.shipping_address || {};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b px-5 py-4 sticky top-0 bg-white">
                    <h3 className="font-bold text-zinc-800">Order #{order.order_number}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><i className="fa-solid fa-xmark" /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Customer</p>
                            <p className="font-medium text-zinc-700">{order.user?.name}</p>
                            <p className="text-xs text-zinc-400">{order.user?.email}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Store</p>
                            <p className="font-medium text-zinc-700">{order.store?.name}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Order Status</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Payment</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${PAY_COLORS[order.payment_status]}`}>{order.payment_status}</span>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Subtotal</p>
                            <p className="font-bold text-zinc-700">${order.subtotal}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Total</p>
                            <p className="font-bold text-zinc-700">${order.total}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3 col-span-2">
                            <p className="text-xs text-zinc-400 mb-1">Shipping Address</p>
                            <p className="font-medium text-zinc-700">{addr.name} — {addr.address}, {addr.city} {addr.zip}, {addr.country}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3 col-span-2">
                            <p className="text-xs text-zinc-400 mb-1">Date</p>
                            <p className="font-medium text-zinc-700">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="border-t px-5 py-3 flex justify-end">
                    <button onClick={onClose} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">Close</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminOrders({ orders }) {
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('all');

    const updateStatus = (id, status) => router.patch(`/admin/orders/${id}/status`, { status }, { preserveScroll: true });

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const filtered = tab === 'all' ? orders.data : orders.data.filter(o => o.status === tab);

    const tabs = [
        { key: 'all', label: 'All', count: orders.data.length },
        ...statuses.map(s => ({ key: s, label: s.charAt(0).toUpperCase() + s.slice(1), count: orders.data.filter(o => o.status === s).length })),
    ];

    return (
        <AdminLayout title="Orders Management">
            <Head title="Orders — Admin" />
            <OrderModal order={selected} onClose={() => setSelected(null)} />

            {/* Tabs */}
            <div className="mb-4 flex gap-1 border-b border-zinc-200 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`whitespace-nowrap px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${tab === t.key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                        {t.label}
                        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-brand-orange text-white' : 'bg-zinc-100 text-zinc-500'}`}>{t.count}</span>
                    </button>
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
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map(o => (
                            <tr key={o.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-zinc-800">{o.order_number}</p>
                                </td>
                                <td className="px-4 py-3 text-zinc-600">{o.user?.name}</td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{o.store?.name}</td>
                                <td className="px-4 py-3 font-bold text-zinc-800">${o.total}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${PAY_COLORS[o.payment_status]}`}>{o.payment_status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <button onClick={() => setSelected(o)} className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                                            <i className="fa-solid fa-eye mr-1" />View
                                        </button>
                                        {o.status === 'pending' && (
                                            <button onClick={() => updateStatus(o.id, 'confirmed')} className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                                <i className="fa-solid fa-check mr-1" />Confirm
                                            </button>
                                        )}
                                        {o.status === 'confirmed' && (
                                            <button onClick={() => updateStatus(o.id, 'processing')} className="rounded bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100">
                                                <i className="fa-solid fa-gear mr-1" />Process
                                            </button>
                                        )}
                                        {o.status === 'processing' && (
                                            <button onClick={() => updateStatus(o.id, 'shipped')} className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100">
                                                <i className="fa-solid fa-truck mr-1" />Ship
                                            </button>
                                        )}
                                        {!['delivered', 'cancelled', 'refunded'].includes(o.status) && (
                                            <button onClick={() => updateStatus(o.id, 'cancelled')} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100">
                                                <i className="fa-solid fa-xmark mr-1" />Cancel
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-zinc-400">
                        <i className="fa-solid fa-receipt text-3xl mb-2 block" />No orders found
                    </div>
                )}
            </div>

            {orders.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {orders.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 hover:border-brand-orange bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
