import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPromotions() {
    return (
        <AdminLayout title="Promotions">
            <Head title="Promotions — Admin" />
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                    { href: '/admin/flash-sales', label: 'Flash Deals', desc: 'Time-limited sale prices', icon: 'fa-bolt', color: 'bg-orange-50 text-orange-700' },
                    { href: '/admin/coupons',     label: 'Coupons',     desc: 'Discount codes for customers', icon: 'fa-ticket', color: 'bg-blue-50 text-blue-700' },
                    { href: '/admin/promotions/trending', label: 'Trending Keywords', desc: 'Boost search visibility', icon: 'fa-fire', color: 'bg-red-50 text-red-700' },
                ].map(p => (
                    <Link key={p.label} href={p.href} className={`rounded-xl p-5 ${p.color} hover:opacity-90 transition`}>
                        <i className={`fa-solid ${p.icon} text-2xl mb-3 block`} />
                        <p className="font-bold text-lg">{p.label}</p>
                        <p className="text-sm opacity-80 mt-1">{p.desc}</p>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
