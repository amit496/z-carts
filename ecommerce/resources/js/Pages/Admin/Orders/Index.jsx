import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import AdminTableIconAction from '@/Components/Admin/AdminTableIconAction';
import Modal from '@/Components/Admin/Modal';
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

/** Same fixed width for filter / bulk dropdowns (compact, equal) */
const SEL = 'w-full rounded-[3px] border border-zinc-200 px-2 py-2 text-sm outline-none focus:border-brand-orange';
const SEL_SMALL = 'w-full rounded-[3px] border border-zinc-200 px-2 py-2 text-xs outline-none focus:border-brand-orange';

function escapeCsv(cell) {
    const s = String(cell ?? '');
    return `"${s.replace(/"/g, '""')}"`;
}

/** @param {object[]} orders */
function ordersToCsv(orders, includeDisputedFulfillment = true) {
    const hdr = ['Order ID', 'Date', 'Store', 'Customer', 'Total', 'Payment', 'Status', 'Fulfillment', 'Delivery', 'Disputed'];
    const lines = [hdr.join(',')];
    for (const o of orders) {
        const row = [
            o.order_number,
            o.created_at,
            o.store?.name ?? '',
            o.user?.name ?? '',
            o.total,
            o.payment_status,
            o.status,
            o.fulfillment_type ?? '',
            o.delivery_partner ?? '',
            o.is_disputed ? 'yes' : 'no',
        ];
        if (!includeDisputedFulfillment) {
            row.splice(7, 3);
        }
        lines.push(row.map(escapeCsv).join(','));
    }
    return lines.join('\n');
}

function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

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

function AssignDeliveryBoyModal({ order, partners, onClose, onProceed }) {
    const [selectedName, setSelectedName] = useState('');

    useEffect(() => {
        setSelectedName(order?.delivery_partner || '');
    }, [order]);

    return (
        <Modal
            show={!!order}
            onClose={onClose}
            title="Assign delivery boy"
            maxWidth="max-w-md"
        >
            {order && (
                <>
                    <div className="px-5 py-4">
                        <p className="mb-3 text-center text-[11px] text-zinc-500">
                            Order <span className="font-mono font-semibold text-zinc-700">#{order.order_number}</span>
                        </p>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Delivery partner</label>
                        <SearchablePicker
                            items={partners}
                            value={selectedName}
                            onChange={setSelectedName}
                            getValue={(p) => p.name}
                            getLabel={(p) => p.name}
                            buttonPlaceholder="Select delivery partner"
                            searchPlaceholder="Search delivery partners…"
                            clearLabel="— Unassign —"
                        />
                    </div>
                    <div className="flex justify-end gap-2 border-t border-zinc-100 px-5 py-3">
                        <button type="button" onClick={onClose} className="rounded-[3px] border border-zinc-200 px-4 py-2 text-xs font-semibold">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onProceed(order, selectedName)}
                            className="rounded-[3px] bg-zinc-900 px-6 py-2 text-[10px] font-black uppercase tracking-wide text-white hover:bg-zinc-800"
                        >
                            Proceed
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}

function ShipTrackingModal({ order, onClose, onSubmit }) {
    const [tracking, setTracking] = useState('');
    useEffect(() => {
        setTracking(order?.tracking_number || '');
    }, [order]);

    return (
        <Modal show={!!order} onClose={onClose} title={order ? `Ship — #${order.order_number}` : 'Ship'} maxWidth="max-w-md">
            {order && (
                <>
                    <div className="space-y-3 p-5">
                        <label className="block text-[10px] font-bold uppercase text-zinc-500">Tracking number</label>
                        <input
                            value={tracking}
                            onChange={(e) => setTracking(e.target.value)}
                            className="mx-auto block w-full max-w-[18rem] rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            placeholder="Carrier tracking…"
                        />
                        <p className="text-[11px] text-zinc-500">Sets status to Shipped and saves tracking.</p>
                    </div>
                    <div className="flex justify-end gap-2 border-t px-5 py-3">
                        <button type="button" onClick={onClose} className="rounded-[3px] border border-zinc-200 px-4 py-2 text-sm">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSubmit(order, tracking)}
                            className="rounded-[3px] bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
                        >
                            Save
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default function AdminOrders({ orders, stats, filters = {}, optionSets = {}, archived_preview = [] }) {
    const { flash, delivery_partner_options: deliveryPartnerOptions = [] } = usePage().props;
    const [shipTarget, setShipTarget] = useState(null);
    const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
    const [bulkPaymentAssign, setBulkPaymentAssign] = useState('');
    const [bulkStatusAssign, setBulkStatusAssign] = useState('');
    const [search, setSearch] = useState(filters.search ?? '');
    const { confirm, success, error } = useAlert();

    const orderStatuses = optionSets.order_statuses ?? [];
    const paymentOpts = optionSets.payments ?? [];
    const fulfilOpts = optionSets.fulfillment ?? [];

    /** Local checkbox overlay (ids set) — Inertia pagination won't persist across visits */
    const [checkedMap, setCheckedMap] = useState(() => ({}));
    useEffect(() => {
        /** reset unchecked when page slice changes */
        setCheckedMap((prev) => {
            const idsOnPage = new Set((orders?.data ?? []).map((o) => o.id));
            const next = { ...prev };
            Object.keys(next).forEach((k) => {
                if (!idsOnPage.has(Number(k))) delete next[k];
            });
            return next;
        });
    }, [orders?.data]);

    const selectedBulkIds = useMemo(() => Object.keys(checkedMap).filter((k) => checkedMap[k]).map(Number), [checkedMap]);

    useEffect(() => {
        const err = flash?.error ?? flash?.message;
        if (typeof err === 'string' && err) error(err);
    }, [flash?.error]);

    const applyFilters = (patch) => {
        const q = { ...snapshotQuery(), ...patch };
        Object.keys(q).forEach((k) => {
            if (q[k] === '' || q[k] === null || q[k] === undefined || q[k] === 'all') delete q[k];
        });
        router.get('/admin/orders', q, {
            preserveScroll: true,
            preserveState: true,
            only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
        });
    };

    const snapshotQuery = () => ({
        search: search.trim() || undefined,
        status: filters.status && filters.status !== 'all' ? filters.status : undefined,
        payment_status: filters.payment_status && filters.payment_status !== 'all' ? filters.payment_status : undefined,
        fulfillment: filters.fulfillment && filters.fulfillment !== 'all' ? filters.fulfillment : undefined,
        per_page: filters.per_page ?? 10,
        archived: filters.archived ? 1 : undefined,
    });

    const setFilter = (key, val) =>
        applyFilters({
            ...snapshotQuery(),
            [key]: val,
        });

    /** @param {'copy'|'csv'|'excel'|'pdf'} mode */
    const exportOrders = async (mode) => {
        const rows = orders?.data ?? [];
        const csvBody = ordersToCsv(rows);

        try {
            if (mode === 'copy') await navigator.clipboard.writeText(csvBody.replace(/"/g, '').split('\n').join('\t'));
            else if (mode === 'csv') downloadText(`orders-export.csv`, csvBody, 'text/csv;charset=utf-8;');
            else if (mode === 'excel')
                downloadText(`orders-export.xls`, `\ufeff${csvBody}`, 'application/vnd.ms-excel;charset=utf-8;');
            else if (mode === 'pdf') {
                const w = window.open('', '_blank');
                if (!w) return;
                w.document.write(
                    `<html><head><title>Orders</title><style>
                    body{font-family:sans-serif;padding:24px;color:#171717}
                    table{width:100%;border-collapse:collapse;font-size:12px}
                    th,td{border:1px solid #e4e4e7;padding:6px;text-align:left}
                    th{background:#fafafa;text-transform:uppercase;font-size:10px}</style></head><body>`,
                );
                w.document.write('<h2>Orders (current page)</h2><table><thead><tr>');
                ['Order', 'Date', 'Shop', 'Customer', 'Total', 'Payment', 'Status'].forEach((h) => {
                    w.document.write(`<th>${h}</th>`);
                });
                w.document.write('</tr></thead><tbody>');
                for (const o of rows) {
                    w.document.write(
                        `<tr><td>${o.order_number}</td><td>${fmtOrderDate(o.created_at)}</td><td>${o.store?.name ?? ''}</td>` +
                            `<td>${o.user?.name ?? ''}</td><td>${o.total}</td><td>${PAY_LABEL[o.payment_status] ?? o.payment_status}</td>` +
                            `<td>${ORDER_LABEL[o.status] ?? o.status}</td></tr>`,
                    );
                }
                w.document.write('</tbody></table><p style="margin-top:16px;color:#71717a;font-size:11px">Use browser Print → Save as PDF</p></body></html>');
                w.document.close();
                w.focus();
                return;
            }
            success(mode === 'copy' ? 'Copied current page rows.' : 'Download started.');
        } catch {
            error('Could not export. Try CSV instead.');
        }
    };

    const printPage = () => window.print();

    const patchBulk = ({ payment_status: pay = null, status: st = null }) => {
        if (selectedBulkIds.length === 0) {
            error('Select orders with the checkbox first.');
            return;
        }
        const body = { ids: selectedBulkIds };
        if (pay) body.payment_status = pay;
        if (st) body.status = st;

        router.patch('/admin/orders/bulk', body, {
            preserveScroll: true,
            only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
            onSuccess: () => {
                success('Bulk update saved.');
                setCheckedMap({});
                setBulkPaymentAssign('');
                setBulkStatusAssign('');
            },
        });
    };

    const applyBulkAssignMenus = () => {
        if (selectedBulkIds.length === 0) {
            error('Select orders with the checkbox first.');
            return;
        }
        if (bulkPaymentAssign && paymentOpts.includes(bulkPaymentAssign)) {
            patchBulk({ payment_status: bulkPaymentAssign });
            return;
        }
        if (bulkStatusAssign && orderStatuses.includes(bulkStatusAssign)) {
            patchBulk({ status: bulkStatusAssign });
            return;
        }
        error('Pick a payment or order status, then Apply bulk.');
    };

    const saveShip = (order, tracking_number) =>
        router.patch(`/admin/orders/${order.id}/status`, { status: 'shipped', tracking_number: tracking_number?.trim?.() ?? '' }, {
            preserveScroll: true,
            only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
            onSuccess: () => {
                success('Shipment saved.');
                setShipTarget(null);
            },
        });

    const saveDeliveryPartner = (order, name) =>
        router.patch(`/admin/orders/${order.id}/delivery`, { delivery_partner: name?.trim?.() ? name.trim() : '' }, {
            preserveScroll: true,
            only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
            onSuccess: () => {
                success('Delivery partner assigned.');
                setDeliveryModalOrder(null);
            },
        });

    const toggleDispute = (o) =>
        confirm(
            `${o.is_disputed ? 'Clear dispute flag' : 'Mark as disputed'} for #${o.order_number}?`,
            () =>
                router.patch(`/admin/orders/${o.id}/dispute`, {}, {
                    preserveScroll: true,
                    only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
                    onSuccess: () => success('Dispute flag updated.'),
                }),
            { title: 'Dispute', confirmText: 'Yes', icon: 'question' },
        );

    const toggleArchive = (o) =>
        confirm(
            `${o.archived_at ? 'Restore' : 'Archive'} order ${o.order_number}?`,
            () =>
                router.patch(`/admin/orders/${o.id}/archive`, {}, {
                    preserveScroll: true,
                    only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
                    onSuccess: () => success('Done.'),
                }),
            { title: o.archived_at ? 'Restore order?' : 'Archive order?', confirmText: 'Yes', icon: 'question' },
        );

    const toggleSelectAllPage = () => {
        const pageIds = (orders?.data ?? []).map((o) => o.id);
        const allOn = pageIds.length > 0 && pageIds.every((id) => checkedMap[id]);
        const next = { ...checkedMap };
        pageIds.forEach((id) => {
            next[id] = !allOn;
        });
        setCheckedMap(next);
    };

    const allPageSelected =
        (orders?.data ?? []).length > 0 && (orders.data ?? []).every((o) => checkedMap[o.id]);

    const from = orders.from;
    const to = orders.to;
    const total = orders.total ?? 0;

    const customerMailto = (o) => {
        const mail = o.user?.email;
        if (!mail) return;
        window.location.href = `mailto:${encodeURIComponent(mail)}?subject=${encodeURIComponent(`Order ${o.order_number}`)}`;
    };

    return (
        <PanelLayout
            title="Orders"
            subtitle={filters.archived ? 'Archived orders.' : 'Filter, export, bulk update, fulfillment & delivery signals.'}
        >
            <Head title="Orders — Admin" />

            <ShipTrackingModal order={shipTarget} onClose={() => setShipTarget(null)} onSubmit={(o, t) => saveShip(o, t)} />
            <AssignDeliveryBoyModal
                order={deliveryModalOrder}
                partners={deliveryPartnerOptions}
                onClose={() => setDeliveryModalOrder(null)}
                onProceed={(o, name) => saveDeliveryPartner(o, name)}
            />

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <StatCard label="Active orders" value={stats.total ?? 0} icon="fa-receipt" />
                <StatCard label="Archived" value={stats.archived ?? 0} icon="fa-box-archive" />
                <StatCard label="Awaiting fulfillment" value={stats.pending ?? 0} icon="fa-clock" />
                <StatCard label="Paid (cash in)" value={stats.paid ?? 0} icon="fa-circle-check" />
                <StatCard label="Disputes" value={stats.dispute_count ?? 0} icon="fa-triangle-exclamation" />
                <StatCard label="Revenue paid" value={`$${Number(stats.revenue ?? 0).toFixed(2)}`} icon="fa-sack-dollar" />
            </div>

            {!filters.archived && (
                <div className="mb-4 flex flex-wrap gap-3 rounded-[3px] border border-amber-200 bg-amber-50/70 px-3 py-2 text-[11px] text-amber-900">
                    <strong className="uppercase tracking-wide">Tip — each option:</strong>
                    <span>
                        Filters trim the dataset; bulk dropdowns affect <em>checkbox-selected</em> rows; export downloads only the{' '}
                        <em>current page</em>; truck opens ship dialog; envelope opens email client for the buyer.
                    </span>
                </div>
            )}

            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Orders" subtitle="Payments, statuses, archived preview, invoices." />

                <div className="mb-4 flex flex-wrap items-end gap-3 border-b border-zinc-100 pb-4">
                    <button
                        type="button"
                        onClick={() => applyFilters({ ...snapshotQuery(), archived: filters.archived ? undefined : 1 })}
                        className={`rounded-[3px] px-3 py-2 text-[10px] font-black uppercase tracking-wide ${
                            filters.archived ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-700'
                        }`}
                    >
                        {filters.archived ? 'Archived view' : 'Show archived-only'}
                    </button>
                    {filters.archived && (
                        <button
                            type="button"
                            onClick={() => applyFilters({ ...snapshotQuery(), archived: undefined })}
                            className="rounded-[3px] border border-zinc-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-zinc-700"
                        >
                            Back to live orders
                        </button>
                    )}
                </div>

                {/* Zone 1: dataset filters only (grid so columns line up) */}
                <div className="mb-4 border border-zinc-200 bg-zinc-100 p-4">
                    <h3 className="mb-3 border-b border-zinc-200 pb-2 font-display text-xs font-bold uppercase tracking-widest text-zinc-700">
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <label className="flex min-w-0 flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Filter by order status</span>
                            <select className={SEL} value={filters.status ?? 'all'} onChange={(e) => setFilter('status', e.target.value)}>
                                <option value="all">All statuses</option>
                                {orderStatuses.map((s) => (
                                    <option key={s} value={s}>
                                        {ORDER_LABEL[s] ?? s}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex min-w-0 flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Filter by payment status</span>
                            <select
                                className={SEL}
                                value={filters.payment_status ?? 'all'}
                                onChange={(e) => setFilter('payment_status', e.target.value)}
                            >
                                <option value="all">All payments</option>
                                {paymentOpts.map((p) => (
                                    <option key={p} value={p}>
                                        {PAY_LABEL[p] ?? p}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex min-w-0 flex-col gap-1 sm:col-span-2 xl:col-span-1">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Fulfillment type</span>
                            <select
                                className={SEL}
                                value={filters.fulfillment ?? 'all'}
                                onChange={(e) => setFilter('fulfillment', e.target.value)}
                            >
                                <option value="all">All types</option>
                                {fulfilOpts.map((f) => (
                                    <option key={f} value={f}>
                                        {FFUL_LABEL[f] ?? f}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {/* Zone 2: bulk updates (separate from filters so the red-box clutter is gone) */}
                <div className="mb-4 border border-zinc-300 bg-white p-4">
                    <h3 className="mb-3 border-b border-zinc-200 pb-2 font-display text-xs font-bold uppercase tracking-widest text-zinc-700">
                        Bulk actions
                    </h3>
                    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
                        <label className="flex min-w-0 flex-col gap-1 lg:w-52">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                                Assign payment ({selectedBulkIds.length} selected)
                            </span>
                            <select
                                className={SEL_SMALL}
                                value={bulkPaymentAssign}
                                onChange={(e) => setBulkPaymentAssign(e.target.value)}
                            >
                                <option value="">Payment…</option>
                                {paymentOpts.map((p) => (
                                    <option key={p} value={p}>
                                        {PAY_LABEL[p] ?? p}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex min-w-0 flex-1 flex-col gap-1 lg:min-w-[12rem] lg:max-w-md">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                                Assign order status ({selectedBulkIds.length} selected)
                            </span>
                            <select className={SEL_SMALL} value={bulkStatusAssign} onChange={(e) => setBulkStatusAssign(e.target.value)}>
                                <option value="">Order status…</option>
                                {orderStatuses.map((s) => (
                                    <option key={s} value={s}>
                                        {ORDER_LABEL[s] ?? s}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="button"
                            onClick={applyBulkAssignMenus}
                            className="h-[42px] shrink-0 rounded-[3px] bg-zinc-900 px-5 text-[10px] font-black uppercase tracking-wide text-white hover:bg-zinc-800 lg:mb-px"
                        >
                            Apply bulk
                        </button>
                    </div>
                </div>

                {/* Zone 3: search + pagination + export — orange accent so it cannot be mistaken for a plain link */}
                <div className="mb-4 border-2 border-brand-orange bg-orange-50 p-4">
                    <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-widest text-brand-orange">Search and export</h3>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                        <div className="flex min-w-0 w-full flex-1 items-stretch gap-2 lg:max-w-2xl">
                            <div className="relative min-w-0 flex-1">
                                <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-xs text-zinc-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') applyFilters({ ...snapshotQuery(), search: search.trim() });
                                    }}
                                    placeholder="Search order #, buyer, shop…"
                                    className="h-10 w-full rounded-[3px] border border-zinc-200 bg-white py-0 pl-9 pr-3 text-sm leading-normal outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => applyFilters({ ...snapshotQuery(), search: search.trim() })}
                                className="inline-flex h-10 shrink-0 items-center justify-center rounded-[3px] bg-brand-orange px-5 text-xs font-semibold text-white hover:opacity-95"
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:w-auto lg:justify-end lg:gap-4">
                            <label className="inline-flex items-center gap-2">
                                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                                    Rows per page
                                </span>
                                <select
                                    className="h-10 w-[10rem] rounded-[3px] border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-brand-orange"
                                    value={String(filters.per_page ?? 10)}
                                    onChange={(e) =>
                                        applyFilters({
                                            ...snapshotQuery(),
                                            per_page: Number(e.target.value),
                                        })
                                    }
                                >
                                    {[10, 25, 50, 100].map((n) => (
                                        <option key={n} value={String(n)}>
                                            Show {n} rows
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex flex-wrap items-center gap-1 border-t border-orange-200 pt-3 sm:border-t-0 sm:pt-0">
                                <span className="mr-1 text-[10px] font-bold uppercase text-zinc-500">Export:</span>
                                {[
                                    { k: 'copy', label: 'Copy' },
                                    { k: 'csv', label: 'CSV' },
                                    { k: 'excel', label: 'Excel' },
                                    { k: 'pdf', label: 'PDF' },
                                    { print: true, label: 'Print' },
                                ].map((b) =>
                                    'print' in b && b.print ? (
                                        <button
                                            key="print"
                                            type="button"
                                            onClick={printPage}
                                            className="inline-flex h-9 items-center rounded-[3px] border border-zinc-200 bg-white px-3 text-[10px] font-bold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
                                        >
                                            Print
                                        </button>
                                    ) : (
                                        <button
                                            key={b.k}
                                            type="button"
                                            onClick={() => exportOrders(b.k)}
                                            className="inline-flex h-9 items-center rounded-[3px] border border-zinc-200 bg-white px-3 text-[10px] font-bold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
                                        >
                                            {b.label}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto print:table">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="border-b border-zinc-200 text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                            <tr>
                                <th className="w-10 py-2 pr-2">
                                    <input
                                        type="checkbox"
                                        aria-label="Select page"
                                        checked={allPageSelected}
                                        onChange={toggleSelectAllPage}
                                        className="rounded border-zinc-300"
                                    />
                                </th>
                                <th className="py-2 pr-3"># Order</th>
                                <th className="py-2 pr-3">Order date</th>
                                <th className="py-2 pr-3">Delivery</th>
                                <th className="py-2 pr-3">Shop</th>
                                <th className="py-2 pr-3">Customer</th>
                                <th className="py-2 pr-3">Fulfill</th>
                                <th className="py-2 pr-3">Grand total</th>
                                <th className="py-2 pr-3">Payment</th>
                                <th className="py-2 pr-3">Order status</th>
                                <th className="py-2 pr-3 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(orders.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="py-12 text-center text-zinc-400">
                                        No orders in this filter.
                                    </td>
                                </tr>
                            ) : (
                                (orders.data ?? []).map((o) => (
                                    <tr key={o.id} className="border-t border-zinc-100 hover:bg-orange-50/20">
                                        <td className="py-2 pr-2 align-middle">
                                            <input
                                                type="checkbox"
                                                checked={!!checkedMap[o.id]}
                                                onChange={(e) =>
                                                    setCheckedMap((cm) => ({ ...cm, [o.id]: e.target.checked }))
                                                }
                                                aria-label={`Select ${o.order_number}`}
                                                className="rounded border-zinc-300"
                                            />
                                        </td>
                                        <td className="py-2 pr-3 font-semibold text-zinc-900">
                                            <Link
                                                href={`/admin/orders/${o.id}`}
                                                className="text-left font-semibold text-zinc-900 hover:text-brand-orange"
                                            >
                                                #{o.order_number}
                                            </Link>
                                            {o.is_disputed && (
                                                <span className="ml-2 inline-flex rounded-[3px] border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-red-700">
                                                    Disputed
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 pr-3 text-xs text-zinc-600">{fmtOrderDate(o.created_at)}</td>
                                        <td className="py-2 pr-3">
                                            <div className="flex flex-wrap items-center gap-1">
                                                {o.delivery_partner ? (
                                                    <span className="text-xs font-medium text-zinc-800">{o.delivery_partner}</span>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-400">—</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setDeliveryModalOrder(o)}
                                                    className="rounded-[3px] border border-brand-orange px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-orange hover:bg-orange-50"
                                                >
                                                    {o.delivery_partner ? (
                                                        <>
                                                            <i className="fa-solid fa-pen mr-1" /> edit
                                                        </>
                                                    ) : (
                                                        <>
                                                            + Assign
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="max-w-[8rem] truncate py-2 pr-3 text-xs text-zinc-600" title={o.store?.name}>
                                            {o.store?.name ?? '—'}
                                        </td>
                                        <td className="py-2 pr-3 text-xs font-medium text-zinc-800">{o.user?.name ?? '—'}</td>
                                        <td className="py-2 pr-3">
                                            <span className="text-[9px] font-bold uppercase text-zinc-500">
                                                {(o.fulfillment_type && FFUL_LABEL[o.fulfillment_type]) ?? '—'}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3 font-bold tabular-nums text-zinc-900">${Number(o.total).toFixed(2)}</td>
                                        <td className="py-2 pr-3">
                                            <span className={`inline-flex rounded-[3px] px-2 py-0.5 text-[9px] font-black uppercase ${PAY_ROW_CLASS[o.payment_status] ?? 'border border-zinc-200 bg-zinc-50'}`}>
                                                {PAY_LABEL[o.payment_status] ?? o.payment_status}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3">
                                            <span className={`inline-flex rounded-[3px] px-2 py-0.5 text-[9px] font-black uppercase ${ORDER_ROW_CLASS[o.status] ?? ''}`}>
                                                {ORDER_LABEL[o.status] ?? o.status}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3 align-middle">
                                            <div className="flex flex-wrap justify-end gap-1">
                                                <AdminTableIconAction
                                                    variant="toggleOn"
                                                    title="Shipment & tracking"
                                                    label="Shipping"
                                                    onClick={() => {
                                                        if (o.status === 'cancelled') error('Cancelled orders cannot ship.');
                                                        else setShipTarget(o);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-truck text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction
                                                    as={Link}
                                                    href={`/admin/orders/${o.id}`}
                                                    variant="view"
                                                    label="View order"
                                                >
                                                    <i className="fa-regular fa-eye text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction
                                                    variant="featured"
                                                    label="Download invoice"
                                                    onClick={async () => {
                                                        try {
                                                            await downloadAdminInvoice(o.id);
                                                        } catch (e) {
                                                            error(e?.message ?? 'Could not download invoice.');
                                                        }
                                                    }}
                                                >
                                                    <i className="fa-solid fa-file-lines text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction variant="danger" label={o.archived_at ? 'Restore' : 'Archive'} onClick={() => toggleArchive(o)}>
                                                    <i className={`fa-solid text-sm ${o.archived_at ? 'fa-arrow-rotate-left' : 'fa-trash-can'}`} />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction
                                                    variant={o.is_disputed ? 'danger' : 'restore'}
                                                    title="Disputed"
                                                    label="Toggle dispute"
                                                    onClick={() => toggleDispute(o)}
                                                >
                                                    <i className="fa-solid fa-flag text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction variant="view" title="Email customer" label="Mail" onClick={() => customerMailto(o)}>
                                                    <i className="fa-regular fa-envelope text-sm" />
                                                </AdminTableIconAction>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {(orders.links ?? []).length > 0 && total > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
                        <p className="text-xs text-zinc-500">
                            {from ?? '–'} to {to ?? '–'} of {total}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {orders.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                            only: ['orders', 'filters', 'stats', 'optionSets', 'archived_preview'],
                                        })
                                    }
                                    className={`min-h-8 min-w-8 rounded-[3px] border px-2.5 py-1 text-xs font-semibold ${
                                        link.active ? 'border-brand-orange bg-brand-orange text-white' : 'border-zinc-200 bg-white text-zinc-700'
                                    } ${!link.url ? 'opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Archived collapsible */}
            {!filters.archived && archived_preview && archived_preview.length > 0 && (
                <details className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <summary className="cursor-pointer text-[12px] font-black uppercase tracking-wide text-zinc-800">
                        Archived orders ({stats.archived ?? 0}) — preview
                    </summary>
                    <div className="mt-4 space-y-2 text-xs text-zinc-600">
                        {archived_preview.map((ao) => (
                            <div key={ao.id} className="flex flex-wrap justify-between gap-2 border-b border-zinc-50 pb-2">
                                <span className="font-mono font-semibold">#{ao.order_number}</span>
                                <span>{fmtOrderDate(ao.created_at)}</span>
                                <span>{ao.store?.name}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.get('/admin/orders', { archived: 1, search: ao.order_number, per_page: filters.per_page ?? 10 })
                                    }
                                    className="font-semibold text-brand-orange hover:underline"
                                >
                                    Open archived +
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => applyFilters({ ...snapshotQuery(), archived: 1 })}
                            className="mt-2 rounded-[3px] bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white"
                        >
                            Open full archived view
                        </button>
                    </div>
                </details>
            )}

            <style>{`
                @media print {
                    aside, nav, button { display: none !important; }
                }
            `}</style>
        </PanelLayout>
    );
}

