import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

export default function VisitorsReport({ visitors }) {
    const [search, setSearch] = useState('');
    const filtered = visitors.data?.filter(v => {
        const q = search.toLowerCase();
        return (
            String(v.ip_address ?? '').toLowerCase().includes(q) ||
            String(v.url ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Visitors">
            <PageHeader title="Visitors" />
            <div className="mb-4">
                <input type="text" placeholder="Search IP / URL..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['IP', 'URL', 'Visited At', 'Created At'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.ip_address}</td>
                                <td className="px-4 py-3 text-gray-600 truncate max-w-xl">{v.url ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{v.visited_at ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{v.created_at ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {visitors.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

