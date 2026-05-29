import { Head, router, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function SellerCoupons({ coupons }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '', type: 'percentage', value: '', min_order: '',
        max_discount: '', usage_limit: '', expires_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/seller/coupons', { onSuccess: () => reset() });
    };

    const active = coupons.filter(c => c.is_active).length;
    const expired = coupons.filter(c => c.expires_at && new Date(c.expires_at) < new Date()).length;

    return (
        <SellerLayout title="Coupons">
            <Head title="Coupons — Seller" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 text-green-700 rounded-2xl p-4">
                    <p className="text-2xl font-black">{active}</p>
                    <p className="text-sm font-medium opacity-80">Active</p>
                </div>
                <div className="bg-gray-50 text-gray-700 rounded-2xl p-4">
                    <p className="text-2xl font-black">{coupons.length}</p>
                    <p className="text-sm font-medium opacity-80">Total</p>
                </div>
                <div className="bg-red-50 text-red-700 rounded-2xl p-4">
                    <p className="text-2xl font-black">{expired}</p>
                    <p className="text-sm font-medium opacity-80">Expired</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Create */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Create Coupon</h3>
                    <form onSubmit={submit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Code *</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value.toUpperCase())}
                                    placeholder="SAVE20"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 font-mono"
                                />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Type *</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                                    <option value="percentage">Percentage %</option>
                                    <option value="fixed">Fixed $</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Value *</label>
                                <input type="number" value={data.value} onChange={e => setData('value', e.target.value)} placeholder={data.type === 'percentage' ? '20' : '10.00'} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Min Order $</label>
                                <input type="number" value={data.min_order} onChange={e => setData('min_order', e.target.value)} placeholder="50" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Max Discount $</label>
                                <input type="number" value={data.max_discount} onChange={e => setData('max_discount', e.target.value)} placeholder="100" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Usage Limit</label>
                                <input type="number" value={data.usage_limit} onChange={e => setData('usage_limit', e.target.value)} placeholder="100" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Expires At</label>
                            <input type="datetime-local" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 disabled:opacity-50">
                            Create Coupon
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-bold text-gray-700">Your Coupons</h3>
                    </div>
                    <div className="divide-y max-h-[520px] overflow-y-auto">
                        {coupons.length === 0 ? (
                            <p className="text-center py-10 text-gray-400 text-sm">No coupons yet</p>
                        ) : coupons.map(c => (
                            <div key={c.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-mono font-bold text-gray-800">{c.code}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`}
                                            {c.min_order > 0 && ` · Min $${c.min_order}`}
                                            {c.max_discount > 0 && ` · Max $${c.max_discount}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Used {c.used_count ?? 0}/{c.usage_limit || '∞'}
                                            {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.patch(`/seller/coupons/${c.id}/toggle`, {}, { preserveScroll: true })}
                                                className="text-xs font-semibold text-indigo-500 hover:underline"
                                            >
                                                {c.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => { if (confirm('Delete coupon?')) router.delete(`/seller/coupons/${c.id}`, { preserveScroll: true }); }}
                                                className="text-xs text-red-400 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
