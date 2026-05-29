import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navGroups = [
    {
        label: 'Overview',
        items: [
            { href: '/admin',         label: '📊 Dashboard' },
            { href: '/admin/orders',  label: '🛒 Orders' },
            { href: '/admin/reports', label: '📈 Reports' },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { href: '/admin/products',      label: '📦 Products' },
            { href: '/admin/inventory',     label: '📋 Inventory' },
            { href: '/admin/inventory-products', label: '🧾 Inventory Products' },
            { href: '/admin/categories',    label: '🗂 Categories' },
            { href: '/admin/categoryGroup', label: '🧩 Category Groups' },
            { href: '/admin/categorySubGroup', label: '🧱 Category Sub Groups' },
            { href: '/admin/attributes',    label: '🏷 Attributes' },
            { href: '/admin/attribute-values', label: '🎨 Attribute Values' },
            { href: '/admin/manufacturers', label: '🏭 Manufacturers' },
        ],
    },
    {
        label: 'Marketplace',
        items: [
            { href: '/admin/shops',         label: '🏪 Shops' },
            { href: '/admin/merchants',     label: '🧑‍💼 Merchants' },
            { href: '/admin/verification',  label: '✅ Verifications' },
            { href: '/admin/customers',     label: '👥 Customers' },
            { href: '/admin/users',         label: '👤 Users' },
            { href: '/admin/roles',         label: '🔐 Roles' },
            { href: '/admin/delivery-boys', label: '🚴 Delivery Boys' },
        ],
    },
    {
        label: 'Commerce',
        items: [
            { href: '/admin/coupons',            label: '🎟 Coupons' },
            { href: '/admin/taxes',              label: '💰 Taxes' },
            { href: '/admin/shipping-zones',     label: '🌍 Shipping Zones' },
            { href: '/admin/shipping-rates',     label: '📦 Shipping Rates' },
            { href: '/admin/carriers',           label: '🚚 Carriers' },
            { href: '/admin/payment-methods',    label: '💳 Payment Methods' },
            { href: '/admin/subscription-plans', label: '📅 Subscription Plans' },
            { href: '/admin/gift-cards',         label: '🎁 Gift Cards' },
            { href: '/admin/carts',              label: '🛒 Carts' },
            { href: '/admin/flash-deals',        label: '⚡ Flash Deals' },
        ],
    },
    {
        label: 'Support',
        items: [
            { href: '/admin/disputes', label: '⚖️ Disputes' },
            { href: '/admin/refunds',  label: '↩️ Refunds' },
            { href: '/admin/tickets',  label: '🎫 Tickets' },
            { href: '/admin/messages', label: '💬 Messages' },
        ],
    },
    {
        label: 'Content',
        items: [
            { href: '/admin/banners',         label: '🖼 Banners' },
            { href: '/admin/sliders',         label: '🎠 Sliders' },
            { href: '/admin/blogs',           label: '📝 Blogs' },
            { href: '/admin/faqs',            label: '❓ FAQs' },
            { href: '/admin/pages',           label: '📄 Pages' },
            { href: '/admin/promos',          label: '🏷 Promos' },
            { href: '/admin/email-templates', label: '📧 Email Templates' },
            { href: '/admin/pdf-templates',   label: '🧾 PDF Templates' },
            { href: '/admin/customcss',       label: '🎨 Custom CSS' },
            { href: '/admin/theme',           label: '🧩 Theme' },
        ],
    },
    {
        label: 'Settings',
        items: [
            { href: '/admin/warehouses', label: '🏗 Warehouses' },
            { href: '/admin/suppliers',  label: '🏢 Suppliers' },
            { href: '/admin/currencies', label: '💱 Currencies' },
            { href: '/admin/countries',  label: '🌐 Countries' },
            { href: '/admin/states',     label: '🗺 States' },
            { href: '/admin/languages',  label: '🌍 Languages' },
            { href: '/admin/packages',   label: '📦 Packages' },
            { href: '/admin/packaging',  label: '📦 Packaging' },
            { href: '/admin/config',     label: '⚙️ Config' },
            { href: '/admin/system-config', label: '🛠 System Config' },
            { href: '/admin/shipping-config', label: '🚚 Shipping Config' },
            { href: '/admin/chat',       label: '💬 Chat' },
            { href: '/admin/installer',  label: '🧩 Installer' },
            { href: '/admin/system',     label: '🧰 System' },
            { href: '/admin/billing',    label: '💵 Billing' },
            { href: '/admin/notifications', label: '🔔 Notifications' },
            { href: '/admin/auth',       label: '🔑 Auth' },
            { href: '/admin/account',    label: '👤 Account' },
        ],
    },
    {
        label: 'Reports',
        items: [
            { href: '/admin/shop-reports', label: '🏪 Shop Report' },
        ],
    },
];

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url } = usePage();

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-200 shrink-0`}>
                <div className="h-16 flex items-center px-4 border-b border-gray-800 gap-3">
                    {sidebarOpen && <span className="font-bold text-lg text-violet-400">🏪 ShopNest Admin</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-400 hover:text-white text-xl">
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            {sidebarOpen && (
                                <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-1">{group.label}</p>
                            )}
                            {group.items.map(item => {
                                const active = url === item.href || url.startsWith(item.href + '/');
                                return (
                                    <Link key={item.href} href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
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
                        <Link href="/" target="_blank" className="text-sm text-indigo-600 hover:underline">View Store ↗</Link>
                        <Link href="/logout" method="post" as="button" className="text-sm text-red-500 hover:text-red-700">Logout</Link>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
