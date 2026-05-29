import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';
import { useState } from 'react';

export default function UsersIndex({ users, roles = [] }) {
    const [search, setSearch] = useState('');
    const filtered = users.data?.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Users">
            <PageHeader title="All Users" action={
                <Link href="/admin/users/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add User</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search by name or email..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                <td className="px-4 py-3 text-gray-500">{u.phone ?? '—'}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{u.role ?? '—'}</span>
                                </td>
                                <td className="px-4 py-3"><StatusBadge active={u.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/users/${u.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete this user?')) router.delete(`/admin/users/${u.id}`); }}
                                        className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {users.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
