import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

function Pagination({ meta, filters }) {
    if (!meta || meta.last_page <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-4 pb-4">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => router.get('/seller/orders', { ...filters, page: p }, { preserveScroll: true })}
                        className={`rounded-lg px-2.5 py-1 font-semibold text-xs ${p === meta.current_page ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-400'}`}
                    >{p}</button>
                ))}
            </div>
        </div>
    );
}

function OrderDetailModal({ order, onClose }) {
    if (!order) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        <p className="font-bold text-gray-800">{order.order_number}</p>
                        <p className="text-xs text-gray-500">{order.user?.name} · {order.user?.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Status</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Payment</p>
                            <p className="font-semibold capitalize">{order.payment_status}</p>
                        </div>
                        {order.tracking_number && (
                            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                                <p className="text-xs text-gray-400 mb-1">Tracking Number</p>
                                <p className="font-mono font-semibold">{order.tracking_number}</p>
                            </div>
                        )}
                    </div>

                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="py-2 text-left">Product</th>
                                <th className="py-2 text-left">Qty</th>
                                <th className="py-2 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {order.items?.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.product?.images?.[0]?.image ? `/storage/${item.product.images[0].image}` : `https://picsum.photos/seed/${item.product_id}/60/60`}
                                                className="w-9 h-9 rounded-lg object-cover"
                                            />
                                            <span className="font-medium text-gray-800 line-clamp-1">{item.product?.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 text-gray-500">{item.quantity}</td>
                                    <td className="py-2 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="border-t pt-3 text-right text-sm space-y-1">
                        <p className="text-gray-500">Subtotal: ${Number(order.subtotal).toFixed(2)}</p>
                        {order.discount > 0 && <p className="text-green-600">Discount: -${Number(order.discount).toFixed(2)}</p>}
                        <p className="text-gray-500">Shipping: ${Number(order.shipping || 0).toFixed(2)}</p>
                        <p className="text-base font-black text-gray-900">Total: ${Number(order.total).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SellerOrders({ orders, stats = {}, filters = {} }) {
    const [editing, setEditing] = useState(null);
    const [detailOrder, setDetailOrder] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const { data, setData, patch, processing } = useForm({ status: '', tracking_number: '' });

    const applyFilters = (overrides = {}) => {
        router.get('/seller/orders', { search, status: statusFilter, ...overrides }, { preserveScroll: true });
    };

    const openEdit = (order) => {
        setEditing(order.id);
        setData({ status: order.status, tracking_number: order.tracking_number || '' });
    };

    const save = (orderId) => patch(`/seller/orders/${orderId}`, { onSuccess: () => setEditing(null) });

    const viewDetail = async (order) => {
        setLoadingDetail(true);
        const res = await fetch(`/seller/orders/${order.id}`, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
        const d = await res.json();
        setDetailOrder(d);
        setLoadingDetail(false);
    };

    return (
        <SellerLayout title="Orders">
            <Head title="Orders — Seller" />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', value: stats.total ?? 0, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Pending', value: stats.pending ?? 0, color: 'bg-yellow-50 text-yellow-700' },
                    { label: 'Shipped', value: stats.shipped ?? 0, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Delivered', value: stats.delivered ?? 0, color: 'bg-green-50 text-green-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                        <p className="text-2xl font-black">{s.value}</p>
                        <p className="text-sm font-medium opacity-80">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b flex flex-wrap gap-2">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                        placeholder="Search order # or customer..."
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 w-52"
                    />
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                    >
                        <option value="">All Statuses</option>
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                    </select>
                    <button onClick={() => applyFilters({ search })} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">Search</button>
                    {(search || statusFilter) && (
                        <button onClick={() => { setSearch(''); setStatusFilter(''); router.get('/seller/orders'); }} className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600">Clear</button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Items</th>
                                <th className="px-4 py-3 text-left">Total</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <button onClick={() => viewDetail(order)} className="text-left hover:text-orange-500">
                                            <p className="font-semibold text-gray-800">{order.order_number}</p>
                                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{order.user?.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{order.items?.length} items</td>
                                    <td className="px-4 py-3 font-bold">${order.total}</td>
                                    <td className="px-4 py-3">
                                        {editing === order.id ? (
                                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none">
                                                {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editing === order.id ? (
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={data.tracking_number}
                                                    onChange={e => setData('tracking_number', e.target.value)}
                                                    placeholder="Tracking #"
                                                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-24 outline-none"
                                                />
                                                <button onClick={() => save(order.id)} disabled={processing} className="text-green-600 hover:underline text-xs font-semibold">Save</button>
                                                <button onClick={() => setEditing(null)} className="text-gray-400 text-xs">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button onClick={() => openEdit(order)} className="text-orange-500 hover:underline text-xs font-semibold">Update</button>
                                                <button onClick={() => viewDetail(order)} className="text-indigo-500 hover:underline text-xs">Details</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.data.length === 0 && <p className="text-center py-10 text-gray-400">No orders found.</p>}
                </div>
                <Pagination meta={orders.meta} filters={{ search, status: statusFilter }} />
            </div>

            {loadingDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-gray-700">Loading...</div>
                </div>
            )}
            <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
        </SellerLayout>
    );
}
