import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

function ProductModal({ product, onClose }) {
    if (!product) return null;
    const img = product.images?.[0]?.image;
    const imgSrc = img ? (img.startsWith('http') ? img : `/storage/${img}`) : `https://picsum.photos/seed/${product.id}/400/400`;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="font-bold text-zinc-800">Product Details</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><i className="fa-solid fa-xmark" /></button>
                </div>
                <div className="p-5 flex gap-4">
                    <img src={imgSrc} alt={product.name} className="h-32 w-32 rounded-lg object-cover shrink-0 border" />
                    <div className="flex-1 space-y-2">
                        <p className="font-bold text-zinc-800 text-base">{product.name}</p>
                        <p className="text-xs text-zinc-500 line-clamp-3">{product.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Price: </span><span className="font-bold text-zinc-700">${product.price}</span></div>
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Stock: </span><span className="font-bold text-zinc-700">{product.stock}</span></div>
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Brand: </span><span className="font-bold text-zinc-700">{product.brand || '—'}</span></div>
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Gender: </span><span className="font-bold text-zinc-700 capitalize">{product.gender || '—'}</span></div>
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Rating: </span><span className="font-bold text-zinc-700">⭐ {product.rating}</span></div>
                            <div className="rounded bg-zinc-50 p-2"><span className="text-zinc-400">Reviews: </span><span className="font-bold text-zinc-700">{product.reviews_count}</span></div>
                            <div className="rounded bg-zinc-50 p-2 col-span-2"><span className="text-zinc-400">Store: </span><span className="font-bold text-zinc-700">{product.store?.name || '—'}</span></div>
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

export default function AdminProducts({ products }) {
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('all');

    const action = (url) => router.patch(url, {}, { preserveScroll: true });
    const del = (id) => { if (confirm('Delete this product?')) router.delete(`/admin/products/${id}`, { preserveScroll: true }); };

    const filtered = products.data.filter(p => {
        if (tab === 'active') return p.is_active;
        if (tab === 'inactive') return !p.is_active;
        if (tab === 'featured') return p.is_featured;
        return true;
    });

    const tabs = [
        { key: 'all', label: 'All', count: products.data.length },
        { key: 'active', label: 'Active', count: products.data.filter(p => p.is_active).length },
        { key: 'inactive', label: 'Inactive', count: products.data.filter(p => !p.is_active).length },
        { key: 'featured', label: 'Featured', count: products.data.filter(p => p.is_featured).length },
    ];

    return (
        <AdminLayout title="Products Management">
            <Head title="Products — Admin" />
            <ProductModal product={selected} onClose={() => setSelected(null)} />

            {/* Tabs */}
            <div className="mb-4 flex gap-1 border-b border-zinc-200">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
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
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Stock</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map(p => {
                            const img = p.images?.[0]?.image;
                            const imgSrc = img ? (img.startsWith('http') ? img : `/storage/${img}`) : `https://picsum.photos/seed/${p.id}/80/80`;
                            return (
                                <tr key={p.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={imgSrc} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-zinc-100 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-zinc-800 max-w-[160px] truncate">{p.name}</p>
                                                <p className="text-xs text-zinc-400">{p.brand || '—'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs">{p.store?.name}</td>
                                    <td className="px-4 py-3 text-zinc-500 text-xs">{p.category?.name || '—'}</td>
                                    <td className="px-4 py-3 font-bold text-zinc-800">${p.price}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-zinc-600'}`}>{p.stock}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`w-fit px-2 py-0.5 rounded-full text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {p.is_featured && <span className="w-fit px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">Featured</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <button onClick={() => setSelected(p)} className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                                                <i className="fa-solid fa-eye mr-1" />View
                                            </button>
                                            <button onClick={() => action(`/admin/products/${p.id}/active`)}
                                                className={`rounded px-2 py-1 text-xs font-medium ${p.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                                {p.is_active ? <><i className="fa-solid fa-eye-slash mr-1" />Inactive</> : <><i className="fa-solid fa-eye mr-1" />Active</>}
                                            </button>
                                            <button onClick={() => action(`/admin/products/${p.id}/featured`)}
                                                className={`rounded px-2 py-1 text-xs font-medium ${p.is_featured ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                                                {p.is_featured ? <><i className="fa-solid fa-star-half mr-1" />Unfeature</> : <><i className="fa-solid fa-star mr-1" />Feature</>}
                                            </button>
                                            <button onClick={() => del(p.id)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100">
                                                <i className="fa-solid fa-trash mr-1" />Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-zinc-400">
                        <i className="fa-solid fa-boxes-stacked text-3xl mb-2 block" />No products found
                    </div>
                )}
            </div>

            {products.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {products.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 hover:border-brand-orange bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
