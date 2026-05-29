import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPopups() {
    return (
        <AdminLayout title="Dynamic Popups">
            <Head title="Dynamic Popups — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-8 text-center text-zinc-400">
                <i className="fa-solid fa-window-restore text-4xl mb-3 block text-zinc-200" />
                <p className="font-semibold text-zinc-700">Dynamic Popups</p>
                <p className="text-sm mt-1 max-w-md mx-auto">Create newsletter signups, promotional banners, and exit-intent popups for your storefront.</p>
                <button className="mt-4 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                    Create Popup
                </button>
            </div>
        </AdminLayout>
    );
}
