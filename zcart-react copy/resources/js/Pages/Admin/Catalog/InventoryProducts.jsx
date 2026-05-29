import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function InventoryProducts({ rows }) {
    const [q, setQ] = useState('');
    const data = rows.data?.filter(r => {
        const s = q.toLowerCase();
        return (
            String(r.product ?? '').toLowerCase().includes(s) ||
            String(r.shop ?? '').toLowerCase().includes(s) ||
            String(r.sku ?? '').toLowerCase().includes(s)
        );
    });

    return (
        <AdminLayout title="Inventory Products">
            <PageHeader title="Inventory Products" />
            <div className="mb-4">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search product/shop/sku..."
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>
                            {['Product', 'Shop', 'SKU', 'Active', 'Stock', 'Sold', 'Price', 'Offer'].map(h => (
                                <th key={h} className="px-4 py-3 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data?.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{r.product ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{r.shop ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-700">{r.sku ?? '—'}</td>
                                <td className="px-4 py-3"><StatusBadge active={r.active} /></td>
                                <td className="px-4 py-3 text-gray-700">{r.stock}</td>
                                <td className="px-4 py-3 text-gray-700">{r.sold}</td>
                                <td className="px-4 py-3 text-gray-800 font-semibold">${Number(r.price ?? 0).toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-800">${Number(r.offer_price ?? 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {rows.links?.map((l, i) => (
                        <Link
                            key={i}
                            href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${
                                l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                            } ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

