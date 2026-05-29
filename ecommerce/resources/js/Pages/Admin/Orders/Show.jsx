import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SearchablePicker from '@/Components/Admin/SearchablePicker';
import { useAlert } from '@/hooks/useAlert';
import { downloadAdminInvoice } from '@/utils/downloadAdminInvoice';

const ORDER_LABEL = {
    pending: 'WAITING FOR PAYMENT',
    confirmed: 'CONFIRMED',
    processing: 'PROCESSING',
    shipped: 'SHIPPED',
    delivered: 'DELIVERED',
    cancelled: 'CANCELLED',
    refunded: 'REFUNDED',
};

const PAY_LABEL = {
    pending: 'PENDING',
    paid: 'PAID',
    failed: 'UNPAID',
    refunded: 'REFUNDED',
};

const ORDER_ROW_CLASS = {
    pending: 'bg-rose-50 text-rose-800 border border-rose-200',
    confirmed: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
    processing: 'bg-violet-50 text-violet-800 border border-violet-200',
    shipped: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    delivered: 'bg-blue-50 text-blue-800 border border-blue-200',
    cancelled: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
    refunded: 'bg-orange-50 text-orange-900 border border-orange-200',
};

const PAY_ROW_CLASS = {
    pending: 'bg-sky-50 text-sky-800 border border-sky-200',
    paid: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    failed: 'bg-red-50 text-red-700 border border-red-200',
    refunded: 'bg-orange-50 text-orange-900 border border-orange-200',
};

const FFUL_LABEL = {
    standard: 'STANDARD',
    express: 'EXPRESS',
    pickup: 'PICKUP',
    digital: 'DIGITAL',
};

function fmtOrderDate(iso) {
    try {
        return new Date(iso).toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function money(n) {
    return `$${Number(n ?? 0).toFixed(2)}`;
}

export default function AdminOrderShow({ order, optionSets = {} }) {
    const { delivery_partner_options: partners = [] } = usePage().props;
    const { success, error, confirm } = useAlert();
    const { flash } = usePage().props;

    const [deliveryName, setDeliveryName] = useState(order.delivery_partner || '');
    const [savingDelivery, setSavingDelivery] = useState(false);
    const [statusPick, setStatusPick] = useState(order.status);
    const [payPick, setPayPick] = useState(order.payment_status);

    useEffect(() => {
        setDeliveryName(order.delivery_partner || '');
        setStatusPick(order.status);
        setPayPick(order.payment_status);
    }, [order.delivery_partner, order.status, order.payment_status]);

    useEffect(() => {
        const err = flash?.error ?? flash?.message;
        if (typeof err === 'string' && err) error(err);
    }, [flash?.error, flash?.message]);

    const addr = order.shipping_address || {};
    const addressLine = [addr.name, addr.address, [addr.city, addr.zip].filter(Boolean).join(' '), addr.country]
        .filter(Boolean)
        .join(', ');

    const mapSearchUrl = useMemo(() => {
        const q = encodeURIComponent(addressLine || order.store?.name || '');
        return `https://www.google.com/maps/search/?api=1&query=${q}`;
    }, [addressLine, order.store?.name]);

    const history = useMemo(() => {
        const rows = [
            {
                at: order.created_at,
                title: 'Order placed',
                detail: `Order ${order.order_number} was created.${order.payment_method ? ` Payment method: ${order.payment_method}.` : ''}`,
            },
        ];
        if (order.tracking_number) {
            rows.push({
                at: order.updated_at,
                title: 'Tracking',
                detail: `Carrier reference: ${order.tracking_number}`,
            });
        }
        return rows.sort((a, b) => new Date(b.at) - new Date(a.at));
    }, [order]);

    const orderStatuses = optionSets.order_statuses ?? [];
    const payOpts = optionSets.payments ?? [];

    const saveDelivery = () => {
        setSavingDelivery(true);
        router.patch(
            `/admin/orders/${order.id}/delivery`,
            { delivery_partner: deliveryName?.trim() ? deliveryName.trim() : '' },
            {
                preserveScroll: true,
                onFinish: () => setSavingDelivery(false),
                onSuccess: () => success('Delivery assignment saved.'),
            },
        );
    };

    const patchOrder = (payload, msg) => {
        router.patch(`/admin/orders/${order.id}/status`, payload, {
            preserveScroll: true,
            onSuccess: () => success(msg ?? 'Order updated.'),
        });
    };

    const markPaid = () =>
        confirm('Mark this order as paid?', () => patchOrder({ payment_status: 'paid' }, 'Marked as paid.'), {
            title: 'Payment',
            confirmText: 'Mark paid',
        });

    const cancelOrder = () =>
        confirm('Cancel this order?', () => patchOrder({ status: 'cancelled' }, 'Order cancelled.'), {
            title: 'Cancel',
            confirmText: 'Cancel order',
            icon: 'warning',
        });

    const downloadInvoice = async () => {
        try {
            await downloadAdminInvoice(order.id);
        } catch (e) {
            error(e?.message ?? 'Could not download invoice.');
        }
    };

    const applyStatusPay = () => {
        const body = {};
        if (statusPick && statusPick !== order.status) body.status = statusPick;
        if (payPick && payPick !== order.payment_status) body.payment_status = payPick;
        if (Object.keys(body).length === 0) {
            error('Change status or payment first.');
            return;
        }
        patchOrder(body, 'Order updated.');
    };

    return (
        <PanelLayout title={`Order #${order.order_number}`} subtitle="Details, delivery partner, shipping, and history.">
            <Head title={`Order #${order.order_number} — Admin`} />

            <div className="mb-4">
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-brand-orange"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back to orders
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order</p>
                                <h1 className="font-display text-xl font-bold uppercase tracking-wide text-zinc-900">
                                    #{order.order_number}
                                </h1>
                            </div>
                            <a
                                href="#delivery-boy"
                                className="inline-flex shrink-0 items-center justify-center rounded-[3px] border-2 border-brand-orange bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wide text-brand-orange hover:bg-orange-50"
                            >
                                Assign delivery boy
                            </a>
                        </div>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex rounded-[3px] px-2.5 py-1 text-[10px] font-black uppercase ${PAY_ROW_CLASS[order.payment_status] ?? 'border border-zinc-200'}`}
                            >
                                {PAY_LABEL[order.payment_status] ?? order.payment_status}
                            </span>
                            <span
                                className={`inline-flex rounded-[3px] px-2.5 py-1 text-[10px] font-black uppercase ${ORDER_ROW_CLASS[order.status] ?? ''}`}
                            >
                                {ORDER_LABEL[order.status] ?? order.status}
                            </span>
                            {order.fulfillment_type && (
                                <span className="text-[10px] font-bold uppercase text-zinc-500">
                                    Fulfill: {FFUL_LABEL[order.fulfillment_type] ?? order.fulfillment_type}
                                </span>
                            )}
                            {order.is_disputed && (
                                <span className="inline-flex rounded-[3px] border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase text-red-700">
                                    Disputed
                                </span>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[480px] text-left text-sm">
                                <thead className="border-b border-zinc-200 text-[10px] uppercase tracking-wider text-zinc-400">
                                    <tr>
                                        <th className="py-2 pr-3">Product</th>
                                        <th className="py-2 pr-3">Qty</th>
                                        <th className="py-2 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.items ?? []).map((it) => (
                                        <tr key={it.id} className="border-b border-zinc-100">
                                            <td className="py-3 pr-3">
                                                <p className="font-medium text-zinc-900">{it.product_name}</p>
                                                {(it.size || it.color) && (
                                                    <p className="text-[11px] text-zinc-500">
                                                        {[it.size, it.color].filter(Boolean).join(' · ')}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 pr-3 tabular-nums text-zinc-600">{it.quantity}</td>
                                            <td className="py-3 text-right font-semibold tabular-nums text-zinc-900">
                                                {money((it.price ?? 0) * (it.quantity ?? 0))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 space-y-1 border-t border-zinc-100 pt-4 text-sm">
                            <div className="flex justify-between text-zinc-600">
                                <span>Subtotal</span>
                                <span className="tabular-nums font-medium">{money(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Discount</span>
                                <span className="tabular-nums font-medium">−{money(order.discount)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Shipping</span>
                                <span className="tabular-nums font-medium">{money(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
                                <span>Grand total</span>
                                <span className="tabular-nums text-brand-orange">{money(order.total)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
                            {order.payment_status === 'pending' && order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={markPaid}
                                    className="rounded-[3px] bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white hover:bg-zinc-800"
                                >
                                    Mark as paid
                                </button>
                            )}
                            <div className="flex flex-wrap items-end gap-2">
                                <label className="text-[10px] font-bold uppercase text-zinc-500">
                                    Status
                                    <select
                                        value={statusPick}
                                        onChange={(e) => setStatusPick(e.target.value)}
                                        className="mt-1 block w-44 rounded-[3px] border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-brand-orange"
                                    >
                                        {orderStatuses.map((s) => (
                                            <option key={s} value={s}>
                                                {ORDER_LABEL[s] ?? s}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="text-[10px] font-bold uppercase text-zinc-500">
                                    Payment
                                    <select
                                        value={payPick}
                                        onChange={(e) => setPayPick(e.target.value)}
                                        className="mt-1 block w-36 rounded-[3px] border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-brand-orange"
                                    >
                                        {payOpts.map((p) => (
                                            <option key={p} value={p}>
                                                {PAY_LABEL[p] ?? p}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={applyStatusPay}
                                    className="rounded-[3px] border border-zinc-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-800 hover:bg-zinc-50"
                                >
                                    Update status
                                </button>
                            </div>
                            {order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={cancelOrder}
                                    className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-red-800 hover:bg-red-100"
                                >
                                    Cancel order
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={downloadInvoice}
                                className="inline-flex items-center rounded-[3px] border border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
                            >
                                Download invoice
                            </button>
                        </div>
                    </section>

                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-zinc-700">History</h2>
                        <ul className="relative space-y-0 border-l border-zinc-200 pl-6">
                            {history.map((row, i) => (
                                <li key={i} className="relative pb-6 last:pb-0">
                                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-orange shadow ring-1 ring-zinc-200" />
                                    <p className="text-[10px] font-bold uppercase text-zinc-400">{fmtOrderDate(row.at)}</p>
                                    <p className="font-semibold text-zinc-800">{row.title}</p>
                                    <p className="text-sm text-zinc-600">{row.detail}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shop</h2>
                        <p className="text-sm font-semibold text-zinc-900">{order.store?.name ?? '—'}</p>
                    </section>

                    <section id="delivery-boy" className="scroll-mt-24 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-3 font-display text-[10px] font-bold uppercase tracking-widest text-zinc-500">Delivery boy</h2>
                        <p className="mb-2 text-xs text-zinc-500">Assign a partner for this shipment. Same searchable control as catalog sub-groups.</p>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Delivery partner</label>
                        <SearchablePicker
                            items={partners}
                            value={deliveryName}
                            onChange={setDeliveryName}
                            getValue={(p) => p.name}
                            getLabel={(p) => p.name}
                            buttonPlaceholder="Select delivery partner"
                            searchPlaceholder="Search delivery partners…"
                            clearLabel="— Unassign —"
                        />
                        <button
                            type="button"
                            disabled={savingDelivery}
                            onClick={saveDelivery}
                            className="mt-3 w-full rounded-[3px] bg-brand-orange py-2.5 text-[10px] font-black uppercase tracking-wide text-white hover:opacity-95 disabled:opacity-50"
                        >
                            {savingDelivery ? 'Saving…' : 'Save delivery partner'}
                        </button>
                    </section>

                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer</h2>
                        <p className="text-sm font-semibold text-zinc-900">{order.user?.name ?? 'Guest customer'}</p>
                        <p className="text-xs text-zinc-500">{order.user?.email ?? '—'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {order.user?.email && (
                                <a
                                    href={`mailto:${encodeURIComponent(order.user.email)}?subject=${encodeURIComponent(`Order ${order.order_number}`)}`}
                                    className="inline-flex rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase text-zinc-700 hover:bg-zinc-50"
                                >
                                    Send message
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={downloadInvoice}
                                className="inline-flex rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase text-zinc-700 hover:bg-zinc-50"
                            >
                                Download invoice
                            </button>
                        </div>
                    </section>

                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shipping address</h2>
                        <p className="text-sm leading-relaxed text-zinc-800">{addressLine || '—'}</p>
                        <a
                            href={mapSearchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex text-xs font-semibold text-brand-orange hover:underline"
                        >
                            Open in maps
                        </a>
                        <div className="mt-3 h-28 overflow-hidden rounded-[3px] border border-zinc-100 bg-zinc-50">
                            <div className="flex h-full items-center justify-center text-[10px] text-zinc-400">
                                <i className="fa-solid fa-map-location-dot mr-2 text-lg" />
                                Map preview — use “Open in maps”
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-display text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shipping info</h2>
                        {order.tracking_number ? (
                            <>
                                <p className="text-xs text-zinc-500">Tracking</p>
                                <p className="font-mono text-sm font-semibold text-zinc-900">{order.tracking_number}</p>
                            </>
                        ) : (
                            <p className="text-sm text-zinc-500">No tracking number yet.</p>
                        )}
                        <button
                            type="button"
                            onClick={downloadInvoice}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-[3px] border border-zinc-200 py-2 text-[10px] font-black uppercase text-zinc-700 hover:bg-zinc-50"
                        >
                            Download invoice
                        </button>
                    </section>
                </div>
            </div>
        </PanelLayout>
    );
}
