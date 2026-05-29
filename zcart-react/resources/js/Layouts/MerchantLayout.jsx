import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navGroups = [
    {
        label: 'Overview',
        items: [
            { href: '/merchant', label: '📊 Dashboard' },
            { href: '/merchant/orders', label: '🛒 Orders' },
            { href: '/merchant/reports', label: '📈 Reports' },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { href: '/merchant/products', label: '📦 Products' },
            { href: '/merchant/inventory', label: '📋 Inventory' },
        ],
    },
    {
        label: 'Shop',
        items: [
            { href: '/merchant/shop', label: '🏪 My Shop' },
            { href: '/merchant/settings', label: '⚙️ Settings' },
            { href: '/merchant/shipping', label: '🚚 Shipping' },
        ],
    },
    {
        label: 'Support',
        items: [
            { href: '/merchant/disputes', label: '⚖️ Disputes' },
            { href: '/merchant/refunds', label: '↩️ Refunds' },
            { href: '/merchant/tickets', label: '🎫 Tickets' },
        ],
    },
];

export default function MerchantLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url, props } = usePage();
    const shop = props.auth?.user?.shop;

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-slate-900 text-white flex flex-col transition-all duration-200 shrink-0`}>
                <div className="h-16 flex items-center px-4 border-b border-slate-800 gap-3">
                    {sidebarOpen && (
                        <div>
                            <p className="font-bold text-sm text-emerald-400">🏪 {shop?.name ?? 'ShopNest Merchant'}</p>
                            <p className="text-xs text-slate-400">Vendor Dashboard</p>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-slate-400 hover:text-white text-xl">
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            {sidebarOpen && (
                                <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-1">{group.label}</p>
                            )}
                            {group.items.map(item => {
                                const active = url === item.href || url.startsWith(item.href + '/');
                                return (
                                    <Link key={item.href} href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                                        <span>{item.label.split(' ')[0]}</span>
                                        {sidebarOpen && <span>{item.label.split(' ').slice(1).join(' ')}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between sticky top-0 z-10">
                    <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="text-sm text-emerald-600 hover:underline">View Store ↗</Link>
                        <Link href="/logout" method="post" as="button" className="text-sm text-red-500 hover:text-red-700">Logout</Link>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
