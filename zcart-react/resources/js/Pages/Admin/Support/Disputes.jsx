import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

const statusColors = { 1: 'bg-blue-100 text-blue-700', 2: 'bg-yellow-100 text-yellow-700', 3: 'bg-green-100 text-green-700', 4: 'bg-gray-100 text-gray-500' };
const statusLabels = { 1: 'Open', 2: 'Under Review', 3: 'Solved', 4: 'Closed' };

export default function DisputesIndex({ disputes }) {
    const [search, setSearch] = useState('');
    const filtered = disputes.data?.filter(d => d.description?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Disputes">
            <PageHeader title="Disputes" />
            <div className="mb-4">
                <input type="text" placeholder="Search disputes..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Order #', 'Customer', 'Shop', 'Description', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-indigo-600 font-medium">
                                    <Link href={`/admin/orders/${d.order_id}`}>#{d.order_number}</Link>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{d.customer_name ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{d.shop_name ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{d.description}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {statusLabels[d.status] ?? d.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{d.created_at}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/disputes/${d.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/disputes/${d.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {disputes.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
