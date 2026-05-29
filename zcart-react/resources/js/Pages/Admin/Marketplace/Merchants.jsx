import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function Merchants({ shops }) {
    const [q, setQ] = useState('');
    const filtered = shops.data?.filter(s => {
        const t = q.toLowerCase();
        return (
            String(s.shop_name ?? '').toLowerCase().includes(t) ||
            String(s.owner ?? '').toLowerCase().includes(t)
        );
    });

    return (
        <AdminLayout title="Merchants">
            <PageHeader title="Merchants" />
            <div className="mb-4">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search shop/owner..."
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>
                            {['Shop', 'Owner', 'Active', 'Orders', 'Revenue'].map(h => (
                                <th key={h} className="px-4 py-3 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{s.shop_name}</td>
                                <td className="px-4 py-3 text-gray-500">{s.owner ?? '—'}</td>
                                <td className="px-4 py-3"><StatusBadge active={s.active} /></td>
                                <td className="px-4 py-3 text-gray-700">{s.orders_count}</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">${Number(s.revenue ?? 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {shops.links?.map((l, i) => (
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

