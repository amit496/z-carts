import { Head, Link } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

const SETTING_GROUPS = [
    {
        title: 'Platform Overview',
        items: [
            { label: 'Total Users', key: 'users', icon: '👥' },
            { label: 'Total Stores', key: 'stores', icon: '🏪' },
            { label: 'Total Products', key: 'products', icon: '📦' },
            { label: 'Total Orders', key: 'orders', icon: '🧾' },
        ],
    },
];

export default function AdminSettings({ stats }) {
    return (
        <PanelLayout title="Settings" subtitle="Platform configuration and system info.">
            <Head title="Settings — Admin" />

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                {/* Platform Stats */}
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Platform Overview" subtitle="Current platform statistics." />
                    <div className="grid grid-cols-2 gap-3">
                        {SETTING_GROUPS[0].items.map(item => (
                            <div key={item.key} className="rounded-[3px] border border-zinc-100 p-3">
                                <p className="text-xl mb-1">{item.icon}</p>
                                <p className="text-2xl font-bold text-zinc-900">{stats[item.key]}</p>
                                <p className="text-[11px] text-zinc-500">{item.label}</p>
                            </div>
                        ))}
                        <div className="col-span-2 rounded-[3px] border border-zinc-100 p-3">
                            <p className="text-xl mb-1">💰</p>
                            <p className="text-2xl font-bold text-zinc-900">{fmt(stats.revenue)}</p>
                            <p className="text-[11px] text-zinc-500">Total Revenue</p>
                        </div>
                    </div>
                </section>

                {/* Quick Links */}
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Quick Navigation" subtitle="Jump to key admin sections." />
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { href: '/admin/users', label: 'Manage Users', icon: 'fa-users' },
                            { href: '/admin/stores', label: 'Manage Stores', icon: 'fa-store' },
                            { href: '/admin/products', label: 'Manage Products', icon: 'fa-boxes-stacked' },
                            { href: '/admin/orders', label: 'Manage Orders', icon: 'fa-receipt' },
                            { href: '/admin/categories', label: 'Categories', icon: 'fa-layer-group' },
                            { href: '/admin/flash-sales', label: 'Flash Sales', icon: 'fa-bolt' },
                            { href: '/admin/reports/sales', label: 'Sales Reports', icon: 'fa-chart-bar' },
                            { href: '/admin/reports/performance', label: 'Performance', icon: 'fa-chart-line' },
                        ].map(link => (
                            <Link key={link.href} href={link.href}
                                className="flex items-center gap-2 rounded-[3px] border border-zinc-100 p-3 text-sm font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange transition">
                                <i className={`fa-solid ${link.icon} text-xs text-brand-orange`} />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Support Links */}
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm xl:col-span-2">
                    <SectionHeader title="Support & Moderation" subtitle="Handle disputes, refunds and tickets." />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { href: '/admin/support/tickets', label: 'Support Tickets', desc: 'Cancelled orders', icon: 'fa-ticket' },
                            { href: '/admin/support/disputes', label: 'Disputes', desc: 'Payment issues', icon: 'fa-triangle-exclamation' },
                            { href: '/admin/support/refunds', label: 'Refunds', desc: 'Processed refunds', icon: 'fa-rotate-left' },
                            { href: '/admin/catalog/manufacturers', label: 'Manufacturers', desc: 'Product brands', icon: 'fa-industry' },
                        ].map(link => (
                            <Link key={link.href} href={link.href}
                                className="rounded-[3px] border border-zinc-100 p-4 hover:border-brand-orange transition">
                                <i className={`fa-solid ${link.icon} text-brand-orange mb-2`} />
                                <p className="text-sm font-semibold text-zinc-900">{link.label}</p>
                                <p className="text-[11px] text-zinc-500">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </PanelLayout>
    );
}
