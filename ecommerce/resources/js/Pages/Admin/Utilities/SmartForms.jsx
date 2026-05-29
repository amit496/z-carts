import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminSmartForms() {
    return (
        <AdminLayout title="Smart Forms">
            <Head title="Smart Forms — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-8 text-center text-zinc-400">
                <i className="fa-solid fa-wpforms text-4xl mb-3 block text-zinc-200" />
                <p className="font-semibold">Smart Forms Builder</p>
                <p className="text-sm mt-1">Install the Smart Forms addon to create custom lead generation and contact forms.</p>
                <button className="mt-4 rounded-lg border-2 border-dashed border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition">
                    Install Addon
                </button>
            </div>
        </AdminLayout>
    );
}
