import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function DataTable({ columns, rows, onDelete, createHref, createLabel = 'Add New' }) {
    const [search, setSearch] = useState('');

    const filtered = rows?.data?.filter(row =>
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
    ) ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {createHref && (
                    <Link href={createHref} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                        + {createLabel}
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                            ))}
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered.length > 0 ? filtered.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-3 text-gray-700">
                                        {col.render ? col.render(row) : (row[col.key] ?? '—')}
                                    </td>
                                ))}
                                <td className="px-4 py-3 flex gap-3">
                                    {row.editHref && (
                                        <Link href={row.editHref} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => { if (confirm('Delete this record?')) onDelete(row.id); }}
                                            className="text-red-500 hover:underline text-xs">Delete</button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>
                        )}
                    </tbody>
                </table>

                {rows?.links && (
                    <div className="flex justify-center gap-2 p-4 border-t">
                        {rows.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-3 py-1 rounded text-xs border ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
