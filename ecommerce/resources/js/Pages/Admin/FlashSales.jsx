import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminFlashSales({ flashSales, products }) {
    const { data, setData, post, processing, reset } = useForm({
        product_id: '', sale_price: '', quantity: '', starts_at: '', ends_at: '', is_active: true,
    });

    const submit = (e) => { e.preventDefault(); post('/admin/flash-sales', { onSuccess: () => reset() }); };

    return (
        <AdminLayout title="Flash Sales">
            <Head title="Flash Sales — Admin" />
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Create Flash Sale</h3>
                    <form onSubmit={submit} className="space-y-3">
                        <select value={data.product_id} onChange={e => setData('product_id', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400">
                            <option value="">Select product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Sale Price</label>
                                <input type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Quantity</label>
                                <input type="number" value={data.quantity} onChange={e => setData('quantity', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Starts At</label>
                                <input type="datetime-local" value={data.starts_at} onChange={e => setData('starts_at', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Ends At</label>
                                <input type="datetime-local" value={data.ends_at} onChange={e => setData('ends_at', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" />
                            </div>
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50">⚡ Create Flash Sale</button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b"><h3 className="font-bold text-gray-700">Active Flash Sales</h3></div>
                    <div className="divide-y">
                        {flashSales.data.length === 0 ? (
                            <p className="text-center py-10 text-gray-400 text-sm">No flash sales</p>
                        ) : flashSales.data.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{s.product?.name}</p>
                                    <p className="text-xs text-gray-500">${s.sale_price} · {s.sold}/{s.quantity} sold</p>
                                    <p className="text-xs text-gray-400">Ends: {new Date(s.ends_at).toLocaleString()}</p>
                                </div>
                                <button onClick={() => router.delete(`/admin/flash-sales/${s.id}`, { preserveScroll: true })} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
