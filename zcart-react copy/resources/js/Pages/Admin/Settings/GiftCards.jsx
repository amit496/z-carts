import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function GiftCardsIndex({ giftCards, shops = [] }) {
    const [search, setSearch] = useState('');
    const shopMap = useMemo(() => new Map(shops.map(s => [s.id, s.name])), [shops]);

    const filtered = giftCards.data?.filter(g => {
        const q = search.toLowerCase();
        return (
            String(g.code ?? '').toLowerCase().includes(q) ||
            String(shopMap.get(g.shop_id) ?? g.shop_name ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Gift Cards">
            <PageHeader title="Gift Cards" action={
                <Link href="/admin/gift-cards/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Gift Card</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search code / shop..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Code', 'Shop', 'Amount', 'Balance', 'Expires', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(g => (
                            <tr key={g.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">{g.code}</td>
                                <td className="px-4 py-3 text-gray-500">{shopMap.get(g.shop_id) ?? g.shop_name ?? '—'}</td>
                                <td className="px-4 py-3 text-gray-700">${g.amount}</td>
                                <td className="px-4 py-3 text-gray-700">${g.balance}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{g.expires_at ?? '—'}</td>
                                <td className="px-4 py-3"><StatusBadge active={g.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/gift-cards/${g.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/gift-cards/${g.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {giftCards.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

