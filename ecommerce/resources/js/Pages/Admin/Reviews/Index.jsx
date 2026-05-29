import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useAlert } from '@/hooks/useAlert';

export default function AdminReviews({ reviews, stats }) {
    const { confirm, success } = useAlert();

    const toggle = (r) => {
        const action = r.is_verified ? 'unverify' : 'verify';
        confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this review by ${r.user?.name}?`,
            () => router.patch(`/admin/reviews/${r.id}/toggle`, {}, {
                preserveScroll: true,
                onSuccess: () => success(`Review ${action}d!`),
            }),
            { title: 'Update Review?', confirmText: 'Yes', icon: 'question' }
        );
    };

    const del = (r) => {
        confirm(`Delete review by ${r.user?.name}? This cannot be undone.`,
            () => router.delete(`/admin/reviews/${r.id}`, {
                preserveScroll: true,
                onSuccess: () => success('Review deleted!'),
            }),
            { title: 'Delete Review?', confirmText: 'Yes, Delete', icon: 'error' }
        );
    };

    return (
        <AdminLayout title="Reviews Management">
            <Head title="Reviews — Admin" />

            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Reviews', value: stats.total,    color: 'bg-blue-50 text-blue-700',     icon: 'fa-star' },
                    { label: 'Verified',      value: stats.verified, color: 'bg-green-50 text-green-700',   icon: 'fa-circle-check' },
                    { label: 'Avg Rating',    value: stats.avg,      color: 'bg-yellow-50 text-yellow-700', icon: 'fa-chart-bar' },
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
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Rating</th>
                            <th className="px-4 py-3 text-left">Comment</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {reviews.data.map(r => (
                            <tr key={r.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3 font-medium text-zinc-800">{r.user?.name}</td>
                                <td className="px-4 py-3 text-zinc-500 text-xs max-w-[140px] truncate">{r.product?.name}</td>
                                <td className="px-4 py-3 text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                                <td className="px-4 py-3 text-zinc-600 text-xs max-w-[200px] truncate">{r.comment}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.is_verified ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{r.is_verified ? 'Verified' : 'Unverified'}</span></td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button onClick={() => toggle(r)} className={`rounded px-2 py-1 text-xs font-medium ${r.is_verified ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                            {r.is_verified ? 'Unverify' : 'Verify'}
                                        </button>
                                        <button onClick={() => del(r)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100"><i className="fa-solid fa-trash" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reviews.data.length === 0 && <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-star text-3xl mb-2 block" />No reviews found</div>}
            </div>

            {reviews.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {reviews.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
