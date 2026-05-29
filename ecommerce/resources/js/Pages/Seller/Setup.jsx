import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function SellerSetup() {
    const { data, setData, post, processing, errors } = useForm({ name: '', description: '' });
    const submit = (e) => { e.preventDefault(); post('/seller/setup'); };

    return (
        <MainLayout>
            <Head title="Open Your Store — ZMarket" />
            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <p className="text-5xl mb-3">🏪</p>
                    <h1 className="text-3xl font-black text-gray-900">Open Your Store</h1>
                    <p className="text-gray-500 mt-2">Start selling fashion on ZMarket today</p>
                </div>
                <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Store Name</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Sarah's Boutique" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-400" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Tell buyers about your store..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-400 resize-none" />
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                        Create Store
                    </button>
                    <p className="text-xs text-center text-gray-400">Your store will be reviewed and approved within 24 hours.</p>
                </form>
            </div>
        </MainLayout>
    );
}
