import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminCommissionReport({ data, stats }) {
    return (
        <AdminLayout title="Affiliate Commission">
            <Head title="Commission — Admin" />
            <div className="mb-4 grid grid-cols-2 gap-3">
                {[
                    { label: 'Total Commission', value: `$${Number(stats.total_commission).toFixed(2)}`, color: 'bg-green-50 text-green-700', icon: 'fa-percent' },
                    { label: 'Total Stores',     value: stats.total_stores, color: 'bg-blue-50 text-blue-700', icon: 'fa-store' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>
            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="border-b px-5 py-4"><h3 className="font-bold text-zinc-800">Commission by Store (10% rate)</h3></div>
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Orders</th>
                            <th className="px-4 py-3 text-left">Total Sales</th>
                            <th className="px-4 py-3 text-left">Commission (10%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {data.data.map(row => (
                            <tr key={row.store_id} className="hover:bg-zinc-50">
                                <td className="px-4 py-3 font-medium text-zinc-800">{row.store?.name ?? `Store #${row.store_id}`}</td>
                                <td className="px-4 py-3 text-zinc-600">{row.order_count}</td>
                                <td className="px-4 py-3 font-bold text-zinc-800">${Number(row.total_sales).toFixed(2)}</td>
                                <td className="px-4 py-3 font-bold text-green-600">${Number(row.commission).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.data.length === 0 && <div className="py-12 text-center text-zinc-400">No commission data yet</div>}
            </div>
        </AdminLayout>
    );
}
