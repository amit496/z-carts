import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function InventoryIndex({ inventories }) {
    const [search, setSearch] = useState('');
    const filtered = inventories.data?.filter(i =>
        i.title?.toLowerCase().includes(search.toLowerCase()) ||
        i.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Inventory">
            <PageHeader title="All Inventory" action={
                <Link href="/admin/inventory/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Item</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search by title or SKU..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Title', 'Product', 'Shop', 'SKU', 'Price', 'Stock', 'Sold', 'Condition', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(i => (
                            <tr key={i.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{i.title}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{i.product}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{i.shop}</td>
                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i.sku ?? '—'}</td>
                                <td className="px-4 py-3 text-indigo-600 font-semibold">${i.sale_price}</td>
                                <td className="px-4 py-3">
                                    <span className={`font-semibold ${i.stock_quantity <= 5 ? 'text-red-600' : 'text-gray-800'}`}>{i.stock_quantity}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{i.sold_quantity}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{i.condition}</td>
                                <td className="px-4 py-3"><StatusBadge active={i.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/inventory/${i.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/inventory/${i.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {inventories.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
