import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPlans({ plans }) {
    return (
        <AdminLayout title="Subscription Plans">
            <Head title="Plans — Admin" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map(p => (
                    <div key={p.name} className={`rounded-xl p-5 shadow-sm ${p.name === 'Pro' ? 'bg-brand-orange text-white' : 'bg-white'}`}>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.name === 'Pro' ? 'text-orange-100' : 'text-zinc-400'}`}>{p.name}</p>
                        <p className={`text-3xl font-black mb-1 ${p.name === 'Pro' ? 'text-white' : 'text-zinc-900'}`}>${p.price}<span className="text-sm font-normal">/mo</span></p>
                        <div className={`mt-4 space-y-2 text-sm ${p.name === 'Pro' ? 'text-orange-100' : 'text-zinc-600'}`}>
                            <p><i className="fa-solid fa-check mr-2" />{p.products === -1 ? 'Unlimited' : p.products} Products</p>
                            <p><i className="fa-solid fa-check mr-2" />{p.commission}% Commission</p>
                            <p><i className="fa-solid fa-check mr-2" />Analytics Dashboard</p>
                        </div>
                        <button className={`mt-4 w-full rounded-lg py-2 text-xs font-bold transition ${p.name === 'Pro' ? 'bg-white text-brand-orange hover:bg-orange-50' : 'border-2 border-zinc-200 text-zinc-700 hover:border-brand-orange hover:text-brand-orange'}`}>
                            {p.active ? 'Edit Plan' : 'Activate'}
                        </button>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
