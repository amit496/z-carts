import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminWalletSettings({ settings }) {
    return (
        <AdminLayout title="Wallet Settings">
            <Head title="Wallet Settings — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-6 max-w-2xl">
                <h3 className="font-bold text-zinc-800 mb-4">Wallet Configuration</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
                        <div><p className="font-medium text-zinc-800">Enable Wallet System</p><p className="text-xs text-zinc-400">Allow customers to use wallet credits</p></div>
                        <div className={`h-6 w-11 rounded-full transition ${settings.wallet_enabled ? 'bg-brand-orange' : 'bg-zinc-200'}`} />
                    </div>
                    {[
                        { key: 'min_withdrawal', label: 'Min Withdrawal ($)' },
                        { key: 'max_withdrawal', label: 'Max Withdrawal ($)' },
                        { key: 'credit_per_dollar', label: 'Credits per $1 spent' },
                        { key: 'referral_bonus', label: 'Referral Bonus ($)' },
                        { key: 'signup_bonus', label: 'Signup Bonus ($)' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-xs font-semibold text-zinc-500 block mb-1">{f.label}</label>
                            <input type="number" defaultValue={settings[f.key]} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
                        </div>
                    ))}
                    <button className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Save Settings</button>
                </div>
            </div>
        </AdminLayout>
    );
}
