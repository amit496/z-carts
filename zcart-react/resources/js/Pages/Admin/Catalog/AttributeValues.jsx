import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/Components/FormComponents';

export default function AttributeValuesIndex({ values, attributes = [] }) {
    const [search, setSearch] = useState('');
    const attrMap = useMemo(() => new Map(attributes.map(a => [a.id, a.name])), [attributes]);

    const filtered = values.data?.filter(v => {
        const q = search.toLowerCase();
        return (
            String(v.value ?? '').toLowerCase().includes(q) ||
            String(attrMap.get(v.attribute_id) ?? v.attribute_name ?? '').toLowerCase().includes(q)
        );
    });

    return (
        <AdminLayout title="Attribute Values">
            <PageHeader title="Attribute Values" action={
                <Link href="/admin/attribute-values/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Add Value</Link>
            } />
            <div className="mb-4">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Attribute', 'Value', 'Color', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(v => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{attrMap.get(v.attribute_id) ?? v.attribute_name ?? '—'}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{v.value}</td>
                                <td className="px-4 py-3 text-gray-500">{v.color ?? '—'}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/admin/attribute-values/${v.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/attribute-values/${v.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {values.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

