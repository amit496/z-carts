import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPdfTemplates() {
    const templates = [
        { name: 'Invoice Template',       desc: 'PDF invoice sent to customers after order', icon: 'fa-file-invoice' },
        { name: 'Order Receipt',          desc: 'Printable order receipt for customers',      icon: 'fa-receipt' },
        { name: 'Packing Slip',           desc: 'Packing slip for warehouse/shipping',        icon: 'fa-box' },
        { name: 'Seller Payout Report',   desc: 'Monthly payout summary for sellers',         icon: 'fa-file-invoice-dollar' },
    ];
    return (
        <AdminLayout title="PDF Templates">
            <Head title="PDF Templates — Admin" />
            <div className="grid sm:grid-cols-2 gap-4">
                {templates.map(t => (
                    <div key={t.name} className="rounded-xl bg-white shadow-sm p-5 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                            <i className={`fa-solid ${t.icon} text-red-500`} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-zinc-800">{t.name}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                        </div>
                        <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-brand-orange hover:text-brand-orange transition">Edit</button>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
