import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function SlidersIndex({ sliders }) {
    const [search, setSearch] = useState('');
    const filtered = sliders.data?.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Sliders">
            <PageHeader title="Sliders" action={
                <Link href="/admin/sliders/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Slide</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search sliders..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Image', 'Title', 'Description', 'URL', 'Order', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {s.image ? (
                                        <img src={s.image} alt={s.title} className="w-20 h-12 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No img</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-800">{s.title}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{s.description ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[100px]">{s.url ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{s.order}</td>
                                <td className="px-4 py-3"><StatusBadge active={s.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/sliders/${s.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/sliders/${s.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {sliders.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
