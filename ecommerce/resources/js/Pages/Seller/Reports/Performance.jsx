import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

function BarChart({ data = [], valueKey, labelKey }) {
    if (!data.length) return <p className="py-8 text-center text-sm text-gray-400">No data yet.</p>;
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="flex items-end gap-1.5 h-32 mt-3">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <p className="text-[9px] text-gray-500 truncate w-full text-center">{valueKey === 'revenue' ? fmt(d[valueKey]) : d[valueKey]}</p>
                    <div className="w-full bg-orange-400 rounded-t-lg" style={{ height: `${(d[valueKey] / max) * 80}px`, minHeight: '3px' }} />
                    <p className="text-[9px] text-gray-400 truncate">{String(d[labelKey]).slice(-5)}</p>
                </div>
            ))}
        </div>
    );
}

export default function SellerPerformance({ stats, monthly = [], topProducts = [] }) {
    return (
        <SellerLayout title="Performance Report">
            <Head title="Performance — Seller" />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Revenue', value: fmt(stats.revenue), color: 'bg-green-50 text-green-700' },
                    { label: 'Total Orders', value: stats.orders, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Delivered', value: stats.delivered, color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 text-red-700' },
                    { label: 'Products', value: stats.products, color: 'bg-purple-50 text-purple-700' },
                    { label: 'Avg Order', value: fmt(stats.avg_order), color: 'bg-orange-50 text-orange-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                        <p className="text-2xl font-black">{s.value}</p>
                        <p className="text-sm font-medium opacity-80">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-1">Monthly Revenue</h3>
                    <p className="text-xs text-gray-400">Last 12 months</p>
                    <BarChart data={monthly} valueKey="revenue" labelKey="month" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-1">Monthly Orders</h3>
                    <p className="text-xs text-gray-400">Order volume trend</p>
                    <BarChart data={monthly} valueKey="orders" labelKey="month" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">Top Products</h3>
                    <div className="space-y-2">
                        {topProducts.map((p, i) => (
                            <div key={p.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-500">{fmt(p.price)} · Stock: {p.stock}</p>
                                    </div>
                                </div>
                                <span className="shrink-0 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {p.order_items_count} sold
                                </span>
                            </div>
                        ))}
                        {!topProducts.length && <p className="py-6 text-center text-sm text-gray-400">No sales data yet.</p>}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
