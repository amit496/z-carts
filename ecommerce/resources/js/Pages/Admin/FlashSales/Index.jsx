import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useAlert } from '@/hooks/useAlert';

export default function AdminFlashSales({ flashSales, products }) {
    const { data, setData, post, processing, reset } = useForm({ product_id: '', sale_price: '', quantity: '', starts_at: '', ends_at: '', is_active: true });
    const { confirm, success } = useAlert();

    const submit = (e) => {
        e.preventDefault();
        post('/admin/flash-sales', { onSuccess: () => { reset(); success('Flash sale created!'); } });
    };

    const toggle = (s) => {
        const action = s.is_active ? 'deactivate' : 'activate';
        confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} flash sale for "${s.product?.name}"?`,
            () => router.patch(`/admin/flash-sales/${s.id}/toggle`, {}, {
                preserveScroll: true,
                onSuccess: () => success(`Flash sale ${action}d!`),
            }),
            { title: 'Update Flash Sale?', confirmText: 'Yes', icon: 'question' }
        );
    };

    const del = (s) => {
        confirm(`Delete flash sale for "${s.product?.name}"?`,
            () => router.delete(`/admin/flash-sales/${s.id}`, {
                preserveScroll: true,
                onSuccess: () => success('Flash sale deleted!'),
            }),
            { title: 'Delete Flash Sale?', confirmText: 'Yes, Delete', icon: 'error' }
        );
    };

    return (
        <AdminLayout title="Flash Sales & Promotions">
            <Head title="Flash Sales — Admin" />
            <div className="grid lg:grid-cols-[360px_1fr] gap-5">
                <div className="rounded-xl bg-white shadow-sm p-5 h-fit">
                    <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-bolt text-brand-orange" />Create Flash Sale</h3>
                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 block mb-1">Product</label>
                            <select value={data.product_id} onChange={e => setData('product_id', e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
                                <option value="">Select product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[['sale_price','Sale Price','number'],['quantity','Quantity','number'],['starts_at','Starts At','datetime-local'],['ends_at','Ends At','datetime-local']].map(([key, label, type]) => (
                                <div key={key}>
                                    <label className="text-xs font-semibold text-zinc-500 block mb-1">{label}</label>
                                    <input type={type} step={key === 'sale_price' ? '0.01' : undefined} value={data[key]} onChange={e => setData(key, e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={processing} className="w-full rounded-lg bg-brand-orange py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
                            {processing ? 'Creating...' : '⚡ Create Flash Sale'}
                        </button>
                    </form>
                </div>

                <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="border-b px-5 py-4"><h3 className="font-bold text-zinc-800">All Flash Sales ({flashSales.data.length})</h3></div>
                    <div className="divide-y divide-zinc-100">
                        {flashSales.data.length === 0 ? (
                            <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-bolt text-3xl mb-2 block" />No flash sales yet</div>
                        ) : flashSales.data.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-4 hover:bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.is_active ? 'bg-orange-100 text-brand-orange' : 'bg-zinc-100 text-zinc-400'}`}><i className="fa-solid fa-bolt" /></div>
                                    <div>
                                        <p className="font-semibold text-sm text-zinc-800">{s.product?.name}</p>
                                        <p className="text-xs text-zinc-500">${s.sale_price} · {s.sold}/{s.quantity} sold</p>
                                        <p className="text-xs text-zinc-400">Ends: {new Date(s.ends_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                                    <button onClick={() => toggle(s)} className={`rounded px-2 py-1 text-xs font-medium ${s.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                        {s.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => del(s)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100"><i className="fa-solid fa-trash" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
