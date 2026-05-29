import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminCredits({ stats, transactions }) {
    return (
        <AdminLayout title="Credit Rewards">
            <Head title="Credit Rewards — Admin" />
            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Credits Issued', value: stats.total_credits_issued, color: 'bg-blue-50 text-blue-700', icon: 'fa-star' },
                    { label: 'Active Users',   value: stats.active_users,         color: 'bg-green-50 text-green-700', icon: 'fa-users' },
                    { label: 'Redeemed',       value: stats.total_redeemed,       color: 'bg-orange-50 text-orange-700', icon: 'fa-gift' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>
            <div className="rounded-xl bg-white shadow-sm p-8 text-center text-zinc-400">
                <i className="fa-solid fa-star text-4xl mb-3 block text-zinc-200" />
                <p className="font-semibold">Credit Rewards System</p>
                <p className="text-sm mt-1">Install the Wallet & Credits addon to enable this feature.</p>
                <button className="mt-4 rounded-lg border-2 border-dashed border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition">
                    Install Addon
                </button>
            </div>
        </AdminLayout>
    );
}
