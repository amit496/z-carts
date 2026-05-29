import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function StoreEdit({ store }) {
    const { data, setData, post, processing, errors } = useForm({
        name: store.name || '',
        description: store.description || '',
        logo: null,
        banner: null,
        _method: 'POST',
    });

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('_method', 'POST');
        if (data.logo) formData.append('logo', data.logo);
        if (data.banner) formData.append('banner', data.banner);
        post('/seller/store/update', { data: formData, forceFormData: true });
    };

    return (
        <SellerLayout title="Store Settings">
            <Head title="Store Settings — Seller" />
            <div className="max-w-2xl space-y-6">

                {/* Status Banner */}
                <div className={`rounded-2xl p-4 text-sm font-medium border ${
                    store.status === 'approved'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : store.status === 'suspended'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                    {store.status === 'approved' && '✅ Your store is approved and live.'}
                    {store.status === 'pending' && '⏳ Your store is pending admin approval.'}
                    {store.status === 'suspended' && '🚫 Your store has been suspended. Contact support.'}
                </div>

                {/* Current Images */}
                {(store.logo || store.banner) && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {store.banner && (
                            <img src={`/storage/${store.banner}`} alt="Banner" className="w-full h-32 object-cover" />
                        )}
                        <div className="p-4 flex items-center gap-4">
                            {store.logo && (
                                <img src={`/storage/${store.logo}`} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                            )}
                            <div>
                                <p className="font-bold text-gray-800">{store.name}</p>
                                <p className="text-xs text-gray-500">{store.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                    <h3 className="font-bold text-gray-800 text-lg">Edit Store Info</h3>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">Store Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Tell buyers about your store..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 resize-none"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Store Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('logo', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-50 file:text-orange-700 file:font-semibold hover:file:bg-orange-100"
                            />
                            <p className="text-xs text-gray-400 mt-1">Recommended: 200×200px</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Store Banner</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('banner', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-50 file:text-orange-700 file:font-semibold hover:file:bg-orange-100"
                            />
                            <p className="text-xs text-gray-400 mt-1">Recommended: 1200×300px</p>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                        <a href={`/store/${store.slug}`} target="_blank" className="text-sm text-indigo-600 hover:underline">
                            View Public Store →
                        </a>
                    </div>
                </form>

                {/* Store Info */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Store Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Store Slug</p>
                            <p className="font-mono font-semibold text-gray-700">{store.slug}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Status</p>
                            <p className={`font-bold capitalize ${store.status === 'approved' ? 'text-green-600' : store.status === 'suspended' ? 'text-red-600' : 'text-yellow-600'}`}>
                                {store.status}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Rating</p>
                            <p className="font-bold text-gray-700">⭐ {store.rating ? Number(store.rating).toFixed(1) : 'No ratings yet'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Member Since</p>
                            <p className="font-semibold text-gray-700">{new Date(store.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
