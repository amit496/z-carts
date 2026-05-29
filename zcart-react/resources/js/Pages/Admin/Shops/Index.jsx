import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';
import { useState } from 'react';

export default function ShopsIndex({ shops }) {
    const [search, setSearch] = useState('');
    const filtered = shops.data?.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout title="Shops">
            <PageHeader title="All Shops"/>
            <div className="mb-4">
                <input type="text" placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name','Owner','Email','Items Sold','Verified','Status','Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                                <td className="px-4 py-3 text-gray-500">{s.owner}</td>
                                <td className="px-4 py-3 text-gray-500">{s.email ?? '—'}</td>
                                <td className="px-4 py-3">{s.total_item_sold}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.verified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {s.verified ? '✓ Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td className="px-4 py-3"><StatusBadge active={s.active}/></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/shops/${s.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                                    <button onClick={() => router.patch(`/admin/shops/${s.id}/toggle`)} className="text-yellow-600 hover:underline text-xs">Toggle</button>
                                    <button onClick={() => { if(confirm('Delete?')) router.delete(`/admin/shops/${s.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {shops.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}/>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
