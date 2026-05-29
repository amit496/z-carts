import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function BannersIndex({ banners }) {
    const [search, setSearch] = useState('');
    const filtered = banners.data?.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Banners">
            <PageHeader title="Banners" action={
                <Link href="/admin/banners/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Banner</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search banners..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Image', 'Title', 'Group', 'URL', 'Order', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {b.image ? (
                                        <img src={b.image} alt={b.title} className="w-16 h-10 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No img</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-800">{b.title}</td>
                                <td className="px-4 py-3 text-gray-500">{b.group ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[120px]">{b.url ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{b.order}</td>
                                <td className="px-4 py-3"><StatusBadge active={b.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/banners/${b.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/banners/${b.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {banners.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
