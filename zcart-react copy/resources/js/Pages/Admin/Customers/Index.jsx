import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function CustomersIndex({ customers, stats }) {
    const [search, setSearch] = useState('');
    const filtered = customers.data?.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Customers">
            <PageHeader title="Customers"/>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[['Total',stats.total,'bg-indigo-500'],['Active',stats.active,'bg-green-500'],['Inactive',stats.inactive,'bg-red-500']].map(([l,v,c]) => (
                    <div key={l} className={`${c} text-white rounded-xl p-4 shadow`}>
                        <p className="text-xs opacity-80">{l}</p>
                        <p className="text-2xl font-bold">{v}</p>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name','Email','Phone','Status','Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                                <td className="px-4 py-3 text-gray-500">{c.phone ?? '—'}</td>
                                <td className="px-4 py-3"><StatusBadge active={c.active}/></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/customers/${c.id}`} className="text-indigo-600 hover:underline text-xs">View</Link>
                                    <button onClick={() => router.patch(`/admin/customers/${c.id}/toggle`)} className="text-yellow-600 hover:underline text-xs">Toggle</button>
                                    <button onClick={() => { if(confirm('Delete?')) router.delete(`/admin/customers/${c.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {customers.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}/>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
