import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminAffiliates() {
    return (
        <AdminLayout title="Affiliates">
            <Head title="Affiliates — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-10 text-center text-zinc-400">
                <i className="fa-solid fa-handshake text-5xl mb-4 block text-zinc-200" />
                <p className="text-lg font-bold text-zinc-700">Affiliate System</p>
                <p className="text-sm mt-2 max-w-md mx-auto">Manage referral links, affiliate commissions, and partner tracking. Install the Affiliate addon to enable this feature.</p>
                <Link href="/admin/plugins" className="mt-5 inline-block rounded-lg border-2 border-dashed border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition">
                    Go to Plugins
                </Link>
            </div>
        </AdminLayout>
    );
}
