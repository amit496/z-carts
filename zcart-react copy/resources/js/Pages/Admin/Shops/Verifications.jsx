import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function Verifications({ shops }) {
    const [search, setSearch] = useState('');
    const filtered = shops.data?.filter(s => {
        const q = search.toLowerCase();
        return (
            String(s.name ?? '').toLowerCase().includes(q) ||
            String(s.owner ?? '').toLowerCase().includes(q)
        );
    });

    function update(shopId, payload) {
        router.patch(`/admin/verification/${shopId}`, payload, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Verifications">
            <PageHeader title="Verifications" />
            <div className="mb-4">
                <input type="text" placeholder="Search shop/owner..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Shop', 'Owner', 'Active', 'ID', 'Phone', 'Address'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                                <td className="px-4 py-3 text-gray-500">{s.owner ?? '—'}</td>
                                <td className="px-4 py-3"><StatusBadge active={s.active} /></td>
                                {['id_verified', 'phone_verified', 'address_verified'].map(k => (
                                    <td key={k} className="px-4 py-3">
                                        <button
                                            onClick={() => update(s.id, { [k]: !s[k] })}
                                            className={`px-2 py-1 rounded text-xs border ${s[k] ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                        >
                                            {s[k] ? 'Verified' : 'Not verified'}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {shops.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

