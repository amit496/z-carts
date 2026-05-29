import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function AttributesIndex({ attributes }) {
    const [search, setSearch] = useState('');
    const filtered = attributes.data?.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()) || a.slug?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Attributes">
            <PageHeader title="Attributes" action={
                <Link href="/admin/attributes/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Attribute</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name', 'Slug', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{a.slug}</td>
                                <td className="px-4 py-3"><StatusBadge active={a.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/attributes/${a.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/attributes/${a.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {attributes.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

