import MerchantLayout from '@/Layouts/MerchantLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge, PageHeader } from '@/Components/FormComponents';

export default function MerchantProductsIndex({ products }) {
    const [search, setSearch] = useState('');
    const filtered = products.data?.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <MerchantLayout title="My Products">
            <PageHeader title="My Products" action={
                <Link href="/merchant/products/create" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700">+ Add Product</Link>
            }/>
            <div className="mb-4">
                <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Name','Categories','Manufacturer','Price','Sales','Status','Actions'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{p.categories || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{p.manufacturer ?? '—'}</td>
                                <td className="px-4 py-3 text-emerald-600 font-semibold">${p.min_price}</td>
                                <td className="px-4 py-3">{p.sale_count}</td>
                                <td className="px-4 py-3"><StatusBadge active={p.active}/></td>
                                <td className="px-4 py-3 flex gap-3">
                                    <Link href={`/merchant/products/${p.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</Link>
                                    <button onClick={() => { if(confirm('Delete?')) router.delete(`/merchant/products/${p.id}`); }} className="text-red-500 hover:underline text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {products.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}/>
                    ))}
                </div>
            </div>
        </MerchantLayout>
    );
}
