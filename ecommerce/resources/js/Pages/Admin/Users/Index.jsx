import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import Modal from '@/Components/Admin/Modal';

const ROLE_COLORS = { admin: 'bg-purple-100 text-purple-700', seller: 'bg-blue-100 text-blue-700', buyer: 'bg-gray-100 text-gray-600' };

function UserModal({ user, onClose }) {
    return (
        <Modal show={!!user} onClose={onClose} title="User Details" maxWidth="max-w-md">
            {user && (
                <>
                    <div className="p-5 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-xl font-bold text-white">{user.name[0]}</div>
                            <div><p className="font-bold text-zinc-800 text-lg">{user.name}</p><p className="text-sm text-zinc-500">{user.email}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Role</p><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${ROLE_COLORS[user.role]}`}>{user.role}</span></div>
                            <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Status</p><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.is_active ? 'Active' : 'Banned'}</span></div>
                            <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Phone</p><p className="font-medium text-zinc-700">{user.phone || '—'}</p></div>
                            <div className="rounded-lg bg-zinc-50 p-3"><p className="text-xs text-zinc-400 mb-1">Store</p><p className="font-medium text-zinc-700">{user.store?.name || '—'}</p></div>
                            <div className="rounded-lg bg-zinc-50 p-3 col-span-2"><p className="text-xs text-zinc-400 mb-1">Joined</p><p className="font-medium text-zinc-700">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                        </div>
                    </div>
                    <div className="border-t px-5 py-3 flex justify-end">
                        <button type="button" onClick={onClose} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">Close</button>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default function AdminUsers({ users, stats, filters = {} }) {
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('all');
    const { confirm, success } = useAlert();

    const tabs = [
        { key: 'all',     label: 'All',     count: stats.total },
        { key: 'active',  label: 'Active',  count: stats.active },
        { key: 'sellers', label: 'Sellers', count: stats.sellers },
        { key: 'buyers',  label: 'Buyers',  count: stats.buyers },
        { key: 'admins',  label: 'Admins',  count: stats.admins },
    ];

    const applyTab = (key) => {
        setTab(key);
        const params = {};
        if (key === 'active')  params.status = 'active';
        if (key === 'sellers') params.role = 'seller';
        if (key === 'buyers')  params.role = 'buyer';
        if (key === 'admins')  params.role = 'admin';
        router.get('/admin/users', params, { preserveScroll: true });
    };

    const toggleBan = (u) => {
        const action = u.is_active ? 'ban' : 'unban';
        confirm(
            `Are you sure you want to ${action} ${u.name}?`,
            () => router.patch(`/admin/users/${u.id}/toggle`, {}, {
                preserveScroll: true,
                onSuccess: () => success(`User ${action}ned successfully!`),
            }),
            { title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`, confirmText: `Yes, ${action}`, icon: u.is_active ? 'warning' : 'question' }
        );
    };

    const changeRole = (u) => {
        const newRole = u.role === 'seller' ? 'buyer' : 'seller';
        confirm(
            `Change ${u.name}'s role from ${u.role} to ${newRole}?`,
            () => router.patch(`/admin/users/${u.id}/role`, { role: newRole }, {
                preserveScroll: true,
                onSuccess: () => success('Role updated successfully!'),
            }),
            { title: 'Change Role?', confirmText: 'Yes, Change', icon: 'question' }
        );
    };

    return (
        <AdminLayout title="Users Management">
            <Head title="Users — Admin" />
            <UserModal user={selected} onClose={() => setSelected(null)} />

            <div className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: 'Total Users', value: stats.total,   color: 'bg-blue-50 text-blue-700',     icon: 'fa-users' },
                    { label: 'Active',      value: stats.active,  color: 'bg-green-50 text-green-700',   icon: 'fa-circle-check' },
                    { label: 'Admins',      value: stats.admins,  color: 'bg-purple-50 text-purple-700', icon: 'fa-user-shield' },
                    { label: 'Sellers',     value: stats.sellers, color: 'bg-indigo-50 text-indigo-700', icon: 'fa-store' },
                    { label: 'Buyers',      value: stats.buyers,  color: 'bg-zinc-50 text-zinc-700',     icon: 'fa-user' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="mb-4 flex gap-1 border-b border-zinc-200">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => applyTab(t.key)}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${tab === t.key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                        {t.label}
                        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-brand-orange text-white' : 'bg-zinc-100 text-zinc-500'}`}>{t.count}</span>
                    </button>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Joined</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {users.data.map(u => (
                            <tr key={u.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">{u.name[0]}</div>
                                        <div><p className="font-semibold text-zinc-800">{u.name}</p><p className="text-xs text-zinc-400">{u.email}</p></div>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{u.store?.name || '—'}</td>
                                <td className="px-4 py-3 text-zinc-500 text-xs">{u.phone || '—'}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Active' : 'Banned'}</span></td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <button onClick={() => setSelected(u)} className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200"><i className="fa-solid fa-eye mr-1" />View</button>
                                        <button onClick={() => toggleBan(u)} className={`rounded px-2 py-1 text-xs font-medium ${u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                            {u.is_active ? <><i className="fa-solid fa-ban mr-1" />Ban</> : <><i className="fa-solid fa-check mr-1" />Unban</>}
                                        </button>
                                        {u.role !== 'admin' && (
                                            <button onClick={() => changeRole(u)} className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                                <i className="fa-solid fa-user-gear mr-1" />{u.role === 'seller' ? 'Make Buyer' : 'Make Seller'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.data.length === 0 && <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-users text-3xl mb-2 block" />No users found</div>}
            </div>

            {users.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {users.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
