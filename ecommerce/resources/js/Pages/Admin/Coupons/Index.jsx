import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useAlert } from '@/hooks/useAlert';

export default function AdminCoupons({ coupons, stats }) {
    const { confirm, success } = useAlert();

    const toggle = (c) => {
        const action = c.is_active ? 'deactivate' : 'activate';
        confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} coupon "${c.code}"?`,
            () => router.patch(`/admin/coupons/${c.id}/toggle`, {}, {
                preserveScroll: true,
                onSuccess: () => success(`Coupon ${action}d!`),
            }),
            { title: 'Update Coupon?', confirmText: 'Yes', icon: 'question' }
        );
    };

    const del = (c) => {
        confirm(`Permanently delete coupon "${c.code}"?`,
            () => router.delete(`/admin/coupons/${c.id}`, {
                preserveScroll: true,
                onSuccess: () => success('Coupon deleted!'),
            }),
            { title: 'Delete Coupon?', confirmText: 'Yes, Delete', icon: 'error' }
        );
    };

    return (
        <AdminLayout title="Coupons Management">
            <Head title="Coupons — Admin" />

            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Coupons', value: stats.total,  color: 'bg-blue-50 text-blue-700',     icon: 'fa-ticket' },
                    { label: 'Active',        value: stats.active, color: 'bg-green-50 text-green-700',   icon: 'fa-circle-check' },
                    { label: 'Total Used',    value: stats.used,   color: 'bg-orange-50 text-orange-700', icon: 'fa-chart-bar' },
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
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Value</th>
                            <th className="px-4 py-3 text-left">Used / Limit</th>
                            <th className="px-4 py-3 text-left">Expires</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {coupons.data.map(c => (
                            <tr key={c.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3 font-mono font-bold text-zinc-800">{c.code}</td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{c.store?.name || '—'}</td>
                                <td className="px-4 py-3"><span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize">{c.type}</span></td>
                                <td className="px-4 py-3 font-bold text-zinc-800">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                                <td className="px-4 py-3 text-zinc-600">{c.used_count} / {c.usage_limit ?? '∞'}</td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button onClick={() => toggle(c)} className={`rounded px-2 py-1 text-xs font-medium ${c.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                            {c.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => del(c)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100"><i className="fa-solid fa-trash" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.data.length === 0 && <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-ticket text-3xl mb-2 block" />No coupons found</div>}
            </div>

            {coupons.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {coupons.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
