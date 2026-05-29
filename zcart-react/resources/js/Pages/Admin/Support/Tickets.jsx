import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

const priorityColors = { 1: 'bg-gray-100 text-gray-600', 2: 'bg-yellow-100 text-yellow-700', 3: 'bg-red-100 text-red-700' };
const priorityLabels = { 1: 'Low', 2: 'Medium', 3: 'High' };
const statusColors = { 1: 'bg-blue-100 text-blue-700', 2: 'bg-yellow-100 text-yellow-700', 3: 'bg-green-100 text-green-700', 4: 'bg-gray-100 text-gray-500' };
const statusLabels = { 1: 'Open', 2: 'In Progress', 3: 'Solved', 4: 'Closed' };

export default function TicketsIndex({ tickets }) {
    const [search, setSearch] = useState('');
    const filtered = tickets.data?.filter(t => t.subject?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Support Tickets">
            <PageHeader title="Support Tickets" action={
                <Link href="/admin/tickets/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ New Ticket</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search by subject..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Subject', 'Customer', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{t.subject}</td>
                                <td className="px-4 py-3 text-gray-500">{t.customer_name ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[t.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {priorityLabels[t.priority] ?? t.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {statusLabels[t.status] ?? t.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{t.created_at}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/tickets/${t.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/tickets/${t.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {tickets.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
