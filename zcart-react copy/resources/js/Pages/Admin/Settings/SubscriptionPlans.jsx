import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function SubscriptionPlansIndex({ subscriptionPlans }) {
    const [search, setSearch] = useState('');
    const filtered = subscriptionPlans.data?.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    return (
        <AdminLayout title="Subscription Plans">
            <PageHeader title="Subscription Plans" action={
                <Link href="/admin/subscription-plans/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Plan</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name', 'Plan ID', 'Price', 'Interval', 'Inventory Limit', 'Team Size', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.plan_id}</td>
                                <td className="px-4 py-3 text-green-600 font-semibold">${p.price}</td>
                                <td className="px-4 py-3 text-gray-500 capitalize">{p.interval}</td>
                                <td className="px-4 py-3 text-gray-500">{p.inventory_limit ?? '∞'}</td>
                                <td className="px-4 py-3 text-gray-500">{p.team_size ?? '∞'}</td>
                                <td className="px-4 py-3"><StatusBadge active={p.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/subscription-plans/${p.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/subscription-plans/${p.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {subscriptionPlans.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
