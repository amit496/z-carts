import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminBusiness({ settings }) {
    return (
        <AdminLayout title="Business Area">
            <Head title="Business Area — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-6 max-w-2xl">
                <h3 className="font-bold text-zinc-800 mb-4">Business Information</h3>
                <div className="space-y-4">
                    {Object.entries(settings).map(([key, val]) => (
                        <div key={key}>
                            <label className="text-xs font-semibold text-zinc-500 block mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                            <input defaultValue={val} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
                        </div>
                    ))}
                    <button className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Save Changes</button>
                </div>
            </div>
        </AdminLayout>
    );
}
