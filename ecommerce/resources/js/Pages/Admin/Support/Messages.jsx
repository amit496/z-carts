import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Messages({ chats, stats, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <AdminLayout title="Messages">
            <Head title="Messages — Support" />
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:max-w-lg">
                <div className="border border-zinc-100 bg-white p-3 shadow-sm">
                    <p className="text-lg font-black text-zinc-800">{stats.total}</p>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-400">Chats</p>
                </div>
                <div className="border border-zinc-100 bg-white p-3 shadow-sm">
                    <p className="text-lg font-black text-zinc-800">{stats.today}</p>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-400">Updated today</p>
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold text-zinc-800">Buyer ↔ store messages</h3>
                    <div className="flex gap-2">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && router.get('/admin/support/messages', { search: search || undefined })}
                            placeholder="Search buyer or shop…"
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange sm:w-52"
                        />
                        <button
                            type="button"
                            onClick={() => router.get('/admin/support/messages', { search: search || undefined })}
                            className="bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                            <tr>
                                <th className="px-4 py-2 text-left">Buyer</th>
                                <th className="px-4 py-2 text-left">Store</th>
                                <th className="px-4 py-2 text-left">Messages</th>
                                <th className="px-4 py-2 text-left">Last activity</th>
                                <th className="px-4 py-2 text-right" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {chats.data.map((row) => (
                                <tr key={row.id} className="hover:bg-zinc-50">
                                    <td className="px-4 py-2.5">{row.buyer?.name || '—'}</td>
                                    <td className="px-4 py-2.5">{row.store?.name || '—'}</td>
                                    <td className="px-4 py-2.5">{row.messages_count}</td>
                                    <td className="px-4 py-2.5 text-zinc-500">
                                        {row.last_message_at ? new Date(row.last_message_at).toLocaleString() : '—'}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <Link href="/chat" className="text-xs font-semibold text-brand-orange hover:underline">
                                            Open inbox
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {chats.data.length === 0 && (
                        <p className="py-12 text-center text-sm text-zinc-400">No conversations yet.</p>
                    )}
                </div>
                {chats.links?.length > 0 && chats.last_page > 1 && (
                    <div className="flex flex-wrap gap-1 border-t px-4 py-3">
                        {chats.links.map((link, i) => (
                            <button
                                key={i}
                                type="button"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                className={`border px-2.5 py-1 text-xs font-semibold ${link.active ? 'border-brand-orange bg-brand-orange text-white' : 'border-zinc-200 bg-white'} ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
