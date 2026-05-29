import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';

function Pagination({ meta, search }) {
    if (!meta || meta.last_page <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-4 pb-4">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => router.get('/seller/products', { search, page: p }, { preserveScroll: true })}
                        className={`rounded-lg px-2.5 py-1 font-semibold text-xs ${p === meta.current_page ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-400'}`}
                    >{p}</button>
                ))}
            </div>
        </div>
    );
}

export default function SellerProducts({ products, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const applySearch = (val) => {
        router.get('/seller/products', { search: val }, { preserveScroll: true });
    };

    return (
        <SellerLayout title="My Products">
            <Head title="Products — Seller" />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex gap-2">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applySearch(e.target.value)}
                        placeholder="Search products..."
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 w-48"
                    />
                    <button onClick={() => applySearch(search)} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">Search</button>
                    {search && (
                        <button onClick={() => { setSearch(''); router.get('/seller/products'); }} className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600">Clear</button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-gray-500 text-sm">{products.total} products</p>
                    <Link href="/seller/products/create" className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-orange-600">+ Add Product</Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.data.map(p => {
                                const img = p.images?.[0]?.image
                                    ? `/storage/${p.images[0].image}`
                                    : `https://placehold.co/50x60/e2e8f0/64748b?text=${encodeURIComponent(p.name[0])}`;
                                return (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={img} alt={p.name} className="w-10 h-12 object-cover rounded-lg shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate max-w-[160px]">{p.name}</p>
                                                    {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">${p.price}</p>
                                            {p.compare_price > p.price && (
                                                <p className="text-xs text-gray-400 line-through">${p.compare_price}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-semibold ${p.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span>
                                            {p.stock < 5 && <p className="text-[10px] text-red-400">Low stock</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold w-fit ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                {p.is_featured && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 w-fit">Featured</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <Link href={`/seller/products/${p.id}/edit`} className="text-orange-500 hover:underline text-xs font-semibold">Edit</Link>
                                                <button
                                                    onClick={() => { if (confirm('Delete this product?')) router.delete(`/seller/products/${p.id}`, { preserveScroll: true }); }}
                                                    className="text-red-400 hover:text-red-600 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {products.data.length === 0 && (
                        <p className="text-center py-10 text-gray-400">
                            No products yet.{' '}
                            <Link href="/seller/products/create" className="text-orange-500 hover:underline font-semibold">Add your first product</Link>
                        </p>
                    )}
                </div>
                <Pagination meta={products.meta} search={search} />
            </div>
        </SellerLayout>
    );
}
