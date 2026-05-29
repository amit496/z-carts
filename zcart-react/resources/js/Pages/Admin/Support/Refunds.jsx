import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

const statusColors = { 1: 'bg-yellow-100 text-yellow-700', 2: 'bg-blue-100 text-blue-700', 3: 'bg-green-100 text-green-700', 4: 'bg-red-100 text-red-700' };
const statusLabels = { 1: 'Pending', 2: 'Processing', 3: 'Approved', 4: 'Rejected' };

export default function RefundsIndex({ refunds }) {
    const [search, setSearch] = useState('');
    const filtered = refunds.data?.filter(r => r.reason?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Refunds">
            <PageHeader title="Refunds" />
            <div className="mb-4">
                <input type="text" placeholder="Search refunds..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Order #', 'Customer', 'Amount', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-indigo-600 font-medium">
                                    <Link href={`/admin/orders/${r.order_id}`}>#{r.order_number}</Link>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{r.customer_name ?? '—'}</td>
                                <td className="px-4 py-3 font-semibold text-red-600">${r.amount}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{r.reason ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {statusLabels[r.status] ?? r.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{r.created_at}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/refunds/${r.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                                    <button onClick={() => router.patch(`/admin/refunds/${r.id}`, { status: 3 })}
                                        className="text-green-600 hover:underline text-xs">Approve</button>
                                    <button onClick={() => router.patch(`/admin/refunds/${r.id}`, { status: 4 })}
                                        className="text-red-500 hover:underline text-xs">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {refunds.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
