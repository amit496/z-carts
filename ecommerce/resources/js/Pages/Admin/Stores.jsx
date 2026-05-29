import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const STATUS = {
    pending:   'bg-yellow-100 text-yellow-700',
    approved:  'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    hold:      'bg-orange-100 text-orange-700',
    rejected:  'bg-rose-100 text-rose-700',
};

function StoreModal({ store, onClose }) {
    if (!store) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="font-bold text-zinc-800">Store Details</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><i className="fa-solid fa-xmark" /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange text-xl font-bold text-white">
                            {store.name[0]}
                        </div>
                        <div>
                            <p className="font-bold text-zinc-800 text-lg">{store.name}</p>
                            <p className="text-sm text-zinc-500">{store.description}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Owner</p>
                            <p className="font-medium text-zinc-700">{store.user?.name}</p>
                            <p className="text-xs text-zinc-400">{store.user?.email}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Status</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS[store.status] || 'bg-gray-100 text-gray-600'}`}>{store.status}</span>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Rating</p>
                            <p className="font-medium text-zinc-700">⭐ {store.rating || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                            <p className="text-xs text-zinc-400 mb-1">Slug</p>
                            <p className="font-medium text-zinc-700 truncate">{store.slug}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3 col-span-2">
                            <p className="text-xs text-zinc-400 mb-1">Registered</p>
                            <p className="font-medium text-zinc-700">{new Date(store.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
                <div className="border-t px-5 py-3 flex justify-end">
                    <button onClick={onClose} className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">Close</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminStores({ stores }) {
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('all');

    const updateStatus = (id, status) => router.patch(`/admin/stores/${id}/status`, { status }, { preserveScroll: true });

    const counts = {
        all: stores.data.length,
        pending: stores.data.filter(s => s.status === 'pending').length,
        approved: stores.data.filter(s => s.status === 'approved').length,
        suspended: stores.data.filter(s => s.status === 'suspended').length,
    };

    const filtered = tab === 'all' ? stores.data : stores.data.filter(s => s.status === tab);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'approved', label: 'Approved' },
        { key: 'suspended', label: 'Suspended' },
    ];

    return (
        <AdminLayout title="Merchants & Shops">
            <Head title="Stores — Admin" />
            <StoreModal store={selected} onClose={() => setSelected(null)} />

            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Stores', value: counts.all, color: 'bg-blue-50 text-blue-700', icon: 'fa-store' },
                    { label: 'Pending', value: counts.pending, color: 'bg-yellow-50 text-yellow-700', icon: 'fa-clock' },
                    { label: 'Approved', value: counts.approved, color: 'bg-green-50 text-green-700', icon: 'fa-check-circle' },
                    { label: 'Suspended', value: counts.suspended, color: 'bg-red-50 text-red-700', icon: 'fa-ban' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-1 border-b border-zinc-200">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${tab === t.key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                        {t.label}
                        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-brand-orange text-white' : 'bg-zinc-100 text-zinc-500'}`}>{counts[t.key] ?? stores.data.filter(s => s.status === t.key).length}</span>
                    </button>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Owner</th>
                            <th className="px-4 py-3 text-left">Rating</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Registered</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map(s => (
                            <tr key={s.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-600">{s.name[0]}</div>
                                        <div>
                                            <p className="font-semibold text-zinc-800">{s.name}</p>
                                            <p className="text-xs text-zinc-400 max-w-[180px] truncate">{s.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-zinc-700 font-medium">{s.user?.name}</p>
                                    <p className="text-xs text-zinc-400">{s.user?.email}</p>
                                </td>
                                <td className="px-4 py-3 text-zinc-600">⭐ {s.rating || '—'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS[s.status] || 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <button onClick={() => setSelected(s)} className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                                            <i className="fa-solid fa-eye mr-1" />View
                                        </button>
                                        {s.status !== 'approved' && (
                                            <button onClick={() => updateStatus(s.id, 'approved')} className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-100">
                                                <i className="fa-solid fa-check mr-1" />Approve
                                            </button>
                                        )}
                                        {s.status !== 'suspended' && (
                                            <button onClick={() => updateStatus(s.id, 'suspended')} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100">
                                                <i className="fa-solid fa-ban mr-1" />Suspend
                                            </button>
                                        )}
                                        {s.status !== 'pending' && (
                                            <button onClick={() => updateStatus(s.id, 'pending')} className="rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600 hover:bg-yellow-100">
                                                <i className="fa-solid fa-clock mr-1" />Pending
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-zinc-400">
                        <i className="fa-solid fa-store text-3xl mb-2 block" />No stores found
                    </div>
                )}
            </div>

            {stores.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {stores.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 hover:border-brand-orange bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
