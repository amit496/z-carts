import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

const TEMPLATES = [
    { name: 'Welcome Email', trigger: 'User Registration', status: 'Active' },
    { name: 'Order Confirmation', trigger: 'Order Placed', status: 'Active' },
    { name: 'Order Shipped', trigger: 'Order Shipped', status: 'Active' },
    { name: 'Order Delivered', trigger: 'Order Delivered', status: 'Active' },
    { name: 'Password Reset', trigger: 'Password Reset Request', status: 'Active' },
    { name: 'Store Approved', trigger: 'Store Status Change', status: 'Active' },
    { name: 'Refund Processed', trigger: 'Refund Issued', status: 'Active' },
];

export default function AdminEmailTemplates() {
    return (
        <PanelLayout title="Email Templates" subtitle="Manage transactional email templates.">
            <Head title="Email Templates — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="System Email Templates" subtitle="These templates are sent automatically on platform events." />
                <div className="space-y-2 mt-2">
                    {TEMPLATES.map(t => (
                        <div key={t.name} className="flex items-center justify-between gap-3 rounded-[3px] border border-zinc-100 p-3">
                            <div>
                                <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                                <p className="text-[11px] text-zinc-500">Trigger: {t.trigger}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{t.status}</span>
                                <button className="rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PanelLayout>
    );
}
