import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function FaqsIndex({ faqs }) {
    const [search, setSearch] = useState('');
    const filtered = faqs.data?.filter(f => f.question?.toLowerCase().includes(search.toLowerCase()));
    return (
        <AdminLayout title="FAQs">
            <PageHeader title="FAQs" action={
                <Link href="/admin/faqs/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add FAQ</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Question', 'Answer', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(f => (
                            <tr key={f.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{f.question}</td>
                                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{f.answer}</td>
                                <td className="px-4 py-3"><StatusBadge active={f.active} /></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/faqs/${f.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/faqs/${f.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {faqs.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
