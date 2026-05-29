import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

export default function CartsIndex({ carts }) {
    const [search, setSearch] = useState('');
    const filtered = carts.data?.filter(c => {
        const q = search.toLowerCase();
        return (
            String(c.shop_name ?? '').toLowerCase().includes(q) ||
            String(c.inventory ?? '').toLowerCase().includes(q) ||
            String(c.customer ?? '').toLowerCase().includes(q) ||
            String(c.ip_address ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Carts">
            <PageHeader title="Carts" />
            <div className="mb-4">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Shop', 'Inventory', 'Customer', 'Qty', 'Unit price', 'IP', 'Created', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{c.shop_name ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-700">{c.inventory ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-700">{c.customer ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-700">{c.quantity}</td>
                                <td className="px-4 py-3 text-gray-700">{c.unit_price}</td>
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.ip_address ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => { if (confirm('Delete cart item?')) router.delete(`/admin/carts/${c.id}`); }}
                                        className="text-red-500 hover:underline text-xs">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-center gap-2 p-4 border-t">
                    {carts.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

