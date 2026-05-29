import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminCommissions({ settings }) {
    return (
        <AdminLayout title="Commission Settings">
            <Head title="Commissions — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-6 max-w-2xl">
                <h3 className="font-bold text-zinc-800 mb-4">Platform Commission</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 block mb-1">Commission Type</label>
                        <select defaultValue={settings.commission_type} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                        </select>
                    </div>
                    {[
                        { key: 'default_commission', label: 'Default Commission (%)' },
                        { key: 'min_commission', label: 'Minimum Commission (%)' },
                        { key: 'max_commission', label: 'Maximum Commission (%)' },
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
