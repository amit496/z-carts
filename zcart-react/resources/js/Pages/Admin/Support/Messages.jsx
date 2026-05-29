import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

export default function MessagesIndex({ messages }) {
    const [search, setSearch] = useState('');
    const filtered = messages.data?.filter(m => {
        const q = search.toLowerCase();
        return (
            String(m.subject ?? '').toLowerCase().includes(q) ||
            String(m.message ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Messages">
            <PageHeader title="Messages" action={
                <Link href="/admin/messages/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Subject', 'Message', 'Created', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-800 font-medium">{m.subject ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-600 truncate max-w-xl">{m.message}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{m.created_at}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/messages/${m.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/messages/${m.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {messages.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

