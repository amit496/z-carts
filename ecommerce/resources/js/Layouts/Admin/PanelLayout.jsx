import { Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Toast from '@/Components/Admin/Toast';

function useDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return { open, setOpen, ref };
}

function MessagesDropdown() {
    const { open, setOpen, ref } = useDropdown();
    const msgs = [
        { id: 1, name: 'Customer Support', text: 'I need help with my order', time: '5m ago' },
        { id: 2, name: 'New Seller', text: 'When will my store be approved?', time: '20m ago' },
    ];
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="relative flex h-9 w-9 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100">
                <i className="fa-regular fa-envelope text-base" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">{msgs.length}</span>
            </button>
            {open && (
                <div className="absolute right-0 top-11 z-50 w-72 rounded border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-600">You have {msgs.length} messages</div>
                    <div className="max-h-60 divide-y divide-zinc-100 overflow-y-auto">
                        {msgs.map(m => (
                            <Link key={m.id} href="/chat" onClick={() => setOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">{m.name[0]}</div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-zinc-800">{m.name}</p>
                                    <p className="truncate text-[11px] text-zinc-500">{m.text}</p>
                                    <p className="text-[10px] text-zinc-400">{m.time}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-zinc-100 px-4 py-2 text-center">
                        <Link href="/chat" onClick={() => setOpen(false)} className="text-xs font-semibold text-brand-orange hover:underline">See All Messages</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function NotificationsDropdown() {
    const { open, setOpen, ref } = useDropdown();
    const { notifCount } = usePage().props;
    const notifs = [
        { icon: 'fa-store', color: 'text-blue-500', text: 'New store pending approval' },
        { icon: 'fa-receipt', color: 'text-emerald-500', text: 'New order placed' },
        { icon: 'fa-triangle-exclamation', color: 'text-amber-500', text: 'Low stock alert' },
        { icon: 'fa-ticket', color: 'text-violet-500', text: 'New support ticket' },
        { icon: 'fa-rotate-left', color: 'text-rose-500', text: 'Refund request received' },
    ];
    const count = notifCount || notifs.length;
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="relative flex h-9 w-9 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100">
                <i className="fa-regular fa-bell text-base" />
                {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">{count > 99 ? '99+' : count}</span>}
            </button>
            {open && (
                <div className="absolute right-0 top-11 z-50 w-80 rounded border border-zinc-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
                        <p className="text-xs font-semibold text-zinc-600">You have {count} unread notifications</p>
                        <button onClick={() => { router.post('/notifications/read-all', {}, { preserveScroll: true }); setOpen(false); }} className="text-[10px] font-semibold text-brand-orange hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-64 divide-y divide-zinc-100 overflow-y-auto">
                        {notifs.map((n, i) => (
                            <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50">
                                <i className={`fa-solid ${n.icon} ${n.color} mt-0.5 w-4 shrink-0 text-sm`} />
                                <p className="text-xs text-zinc-700">{n.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-zinc-100 px-4 py-2 text-center">
                        <Link href="/notifications" onClick={() => setOpen(false)} className="text-xs font-semibold text-brand-orange hover:underline">View all notifications</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

// zCart demo URLs ↔ real routes (aliases in routes/backend/admin/zcart_menu_aliases.php)
const ADMIN_NAV_CANONICAL = /** @type {Record<string, string>} */ ({
    '/admin/catalog/product': '/admin/products',
    '/admin/catalog/manufacturer': '/admin/catalog/manufacturers',
    '/admin/catalog/attribute': '/admin/catalog/attributes',
    '/admin/order/order': '/admin/orders',
    '/admin/order/cart': '/admin/carts',
    '/admin/order/cancellation': '/admin/orders/cancellations',
    '/admin/admin/user': '/admin/users',
    '/admin/admin/customer': '/admin/users/customers',
    '/admin/affiliate': '/admin/users/affiliates',
    '/admin/inspector/inspectables': '/admin/users/sellers',
    '/admin/seller/merchant': '/admin/stores',
    '/admin/seller/shop': '/admin/stores/approved',
    '/admin/rewards': '/admin/wallet/credits',
    '/admin/affiliate/commissions': '/admin/wallet/commission',
    '/admin/payouts': '/admin/wallet',
    '/admin/payout/requests': '/admin/wallet/payout-requests',
    '/admin/wallet/bulkupload/index': '/admin/wallet/deposits',
    '/admin/support/message/labelOf/1': '/admin/support/messages',
    '/admin/appearance/theme': '/admin/appearance/themes',
    '/admin/appearance/popup': '/admin/appearance/popups',
    '/admin/appearance/slider': '/admin/appearance/sliders',
    '/admin/appearance/custom_css': '/admin/appearance/custom-css',
    '/admin/flashdeal': '/admin/flash-sales',
    '/admin/promotions/trendingKeywords': '/admin/promotions/trending',
    '/admin/packages': '/admin/plugins',
    '/admin/setting/subscriptionPlan': '/admin/settings/plans',
    '/admin/setting/role': '/admin/settings/roles',
    '/admin/setting/system/general': '/admin/settings/system',
    '/admin/setting/system/config': '/admin/settings/system/config',
    '/admin/setting/country': '/admin/settings/business',
    '/admin/setting/currency': '/admin/settings/currencies',
    '/admin/setting/language': '/admin/settings/languages',
    '/admin/setting/wallet': '/admin/settings/wallet-settings',
    '/admin/setting/inspector': '/admin/settings/inspector',
    '/admin/setting/dynamicCommission': '/admin/settings/commissions',
    '/admin/setting/autocomplete': '/admin/settings/search',
    '/admin/utility/emailTemplate': '/admin/utilities/email-templates',
    '/admin/utility/pdfTemplate': '/admin/utilities/pdf-templates',
    '/admin/utility/smartForm': '/admin/utilities/smart-forms',
    '/admin/utility/page': '/admin/utilities/pages',
    '/admin/utility/blog': '/admin/utilities/blogs',
    '/admin/utility/event': '/admin/utilities/events',
    '/admin/utility/faq': '/admin/utilities/faqs',
    '/admin/report/payout': '/admin/reports/payouts',
    '/admin/report/kpi': '/admin/reports/performance',
    '/admin/report/googleAnalytics': '/admin/reports/analytics',
    '/admin/support/ticket': '/admin/support/tickets',
});

/** Same destination after redirects / legacy paths — highlights correct sidebar item */
function canonicalAdminPath(pathname) {
    let p = (pathname || '').split('?')[0].replace(/\/$/, '');
    if (p.startsWith('/admin/support/message/labelOf')) return '/admin/support/messages';
    return ADMIN_NAV_CANONICAL[p] || p;
}

/** Walk NAV tree — every menu link that has href (handles nested megamenus). */
function collectLeafCanonicalHrefs(nav) {
    /** @type {string[]} */
    const out = [];
    for (const item of nav) {
        if (item.href) out.push(canonicalAdminPath(item.href));
        if (item.children?.length) out.push(...collectLeafCanonicalHrefs(item.children));
    }
    return out;
}

/** Longest-prefix wins so `/admin/products/…` highlights Products but Settings vs Config stays distinct */
function sidebarActiveLeaf(navHref, currentPathname) {
    const leaf = canonicalAdminPath(navHref);
    const cur = canonicalAdminPath(currentPathname);
    const candidates = [...new Set(collectLeafCanonicalHrefs(NAV))].filter(Boolean);
    candidates.sort((a, b) => b.length - a.length);

    const match = candidates.find((base) => cur === base || (base !== '/' && cur.startsWith(`${base}/`)));

    return match !== undefined && leaf === match;
}

function sidebarPathsMatch(navHref, currentPathname) {
    return sidebarActiveLeaf(navHref, currentPathname);
}

// ── NAV — labels & URLs aligned with demo.zcart.net sidebar ──────────────────
const NAV = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-gauge' },
    {
        label: 'Catalog', icon: 'fa-tags',
        children: [
            {
                label: 'Categories', icon: 'fa-angle-double-right',
                children: [
                    { href: '/admin/catalog/categoryGroup', label: 'Groups', icon: 'fa-angle-right' },
                    { href: '/admin/catalog/categorySubGroup', label: 'Sub-groups', icon: 'fa-angle-right' },
                    { href: '/admin/catalog/category', label: 'Categories', icon: 'fa-angle-right' },
                ],
            },
            { href: '/admin/catalog/attribute', label: 'Attributes', icon: 'fa-angle-double-right' },
            { href: '/admin/catalog/product', label: 'Products', icon: 'fa-angle-double-right' },
            { href: '/admin/catalog/manufacturer', label: 'Manufacturers', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Orders', icon: 'fa-cart-plus',
        children: [
            { href: '/admin/order/order', label: 'Orders', icon: 'fa-angle-double-right' },
            { href: '/admin/order/cart', label: 'Carts', icon: 'fa-angle-double-right' },
            { href: '/admin/order/cancellation', label: 'Cancellations', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Admin', icon: 'fa-user-secret',
        children: [
            { href: '/admin/admin/user', label: 'Users', icon: 'fa-angle-double-right' },
            { href: '/admin/admin/customer', label: 'Customers', icon: 'fa-angle-double-right' },
            { href: '/admin/affiliate', label: 'Affiliates', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/inspector/inspectables', label: 'Inspectables', icon: 'fa-angle-double-right', badge: 'Addon' },
        ],
    },
    {
        label: 'Vendors', icon: 'fa-chart-bar',
        children: [
            { href: '/admin/seller/merchant', label: 'Merchants', icon: 'fa-angle-double-right' },
            { href: '/admin/seller/shop', label: 'Shops', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Wallet', icon: 'fa-money-bill', badge: 'Addon',
        children: [
            { href: '/admin/rewards', label: 'Credit rewards', icon: 'fa-angle-double-right' },
            { href: '/admin/affiliate/commissions', label: 'Affiliate Commission', icon: 'fa-angle-double-right' },
            { href: '/admin/payouts', label: 'Payouts', icon: 'fa-angle-double-right' },
            { href: '/admin/payout/requests', label: 'Payout requests', icon: 'fa-angle-double-right' },
            { href: '/admin/wallet/bulkupload/index', label: 'Bulk Deposits', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Support desk', icon: 'fa-headset',
        children: [
            { href: '/admin/support/message/labelOf/1', label: 'Messages', icon: 'fa-angle-double-right' },
            { href: '/admin/support/ticket', label: 'Tickets', icon: 'fa-angle-double-right' },
            { href: '/admin/support/disputes', label: 'Disputes', icon: 'fa-angle-double-right' },
            { href: '/admin/support/refunds', label: 'Refunds', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Appearance', icon: 'fa-paint-brush',
        children: [
            { href: '/admin/appearance/theme', label: 'Themes', icon: 'fa-angle-double-right' },
            { href: '/admin/appearance/popup', label: 'Dynamic Popups', icon: 'fa-angle-double-right' },
            { href: '/admin/appearance/banners', label: 'Banners', icon: 'fa-angle-double-right' },
            { href: '/admin/appearance/slider', label: 'Sliders', icon: 'fa-angle-double-right' },
            { href: '/admin/appearance/custom_css', label: 'Custom CSS', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Promotions', icon: 'fa-bullhorn',
        children: [
            { href: '/admin/promotions', label: 'Promotions', icon: 'fa-angle-double-right' },
            { href: '/admin/promotions/trendingKeywords', label: 'Trending keywords', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/flashdeal', label: 'Flash Deal', icon: 'fa-angle-double-right' },
        ],
    },
    { href: '/admin/packages', label: 'Plugins', icon: 'fa-plug' },
    {
        label: 'Settings', icon: 'fa-gears',
        children: [
            { href: '/admin/setting/subscriptionPlan', label: 'Plans', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/role', label: 'User roles', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/system/general', label: 'System settings', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/system/config', label: 'Configurations', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/country', label: 'Business Area', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/currency', label: 'Currencies', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/language', label: 'Languages', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/wallet', label: 'Wallet settings', icon: 'fa-angle-double-right' },
            { href: '/admin/setting/inspector', label: 'Inspector settings', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/setting/dynamicCommission', label: 'Commissions', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/setting/autocomplete', label: 'Search settings', icon: 'fa-angle-double-right', badge: 'Addon' },
        ],
    },
    {
        label: 'Utilities', icon: 'fa-asterisk',
        children: [
            { href: '/admin/utility/emailTemplate', label: 'Email templates', icon: 'fa-angle-double-right' },
            { href: '/admin/utility/pdfTemplate', label: 'PDF templates', icon: 'fa-angle-double-right' },
            { href: '/admin/utility/smartForm', label: 'Smart Forms', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/utility/page', label: 'Pages', icon: 'fa-angle-double-right' },
            { href: '/admin/utility/blog', label: 'Blogs', icon: 'fa-angle-double-right' },
            { href: '/admin/utility/event', label: 'Events', icon: 'fa-angle-double-right', badge: 'Addon' },
            { href: '/admin/utility/faq', label: 'Faqs', icon: 'fa-angle-double-right' },
        ],
    },
    {
        label: 'Reports', icon: 'fa-chart-simple',
        children: [
            { href: '/admin/report/payout', label: 'Payouts', icon: 'fa-angle-double-right' },
            { href: '/admin/report/kpi', label: 'Performance', icon: 'fa-angle-double-right' },
            {
                label: 'Sales', icon: 'fa-angle-double-right',
                children: [
                    { href: '/admin/reports/sales/orders', label: 'Orders', icon: 'fa-angle-right' },
                    { href: '/admin/reports/sales/products', label: 'Products', icon: 'fa-angle-right' },
                    { href: '/admin/reports/sales/payments', label: 'Payments', icon: 'fa-angle-right' },
                ],
            },
            { href: '/admin/report/googleAnalytics', label: 'Analytics', icon: 'fa-angle-double-right', badge: 'Addon' },
        ],
    },
];

function treeHasActive(item, currentPathname) {
    if (!item.children) return sidebarPathsMatch(item.href, currentPathname);
    return item.children.some(c => treeHasActive(c, currentPathname));
}

function NavItem({ item, currentPathname, depth = 0 }) {
    const hasChildren = !!item.children?.length;
    const isActive = treeHasActive(item, currentPathname);
    const [open, setOpen] = useState(isActive);

    if (!hasChildren) {
        const active = sidebarPathsMatch(item.href, currentPathname);
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-all
                    ${depth === 0 ? 'px-3 py-2.5 text-[13px]' : 'py-1.5'}
                    ${active
                        ? 'bg-brand-orange text-white shadow-sm'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                {item.icon && <i className={`fa-solid ${item.icon} w-3.5 shrink-0 text-[11px]`} />}
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">{item.badge}</span>}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-all
                    ${depth === 0 ? 'py-2.5' : 'py-1.5 text-[12.5px]'}
                    ${isActive ? 'text-brand-orange' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
            >
                {item.icon && <i className={`fa-solid ${item.icon} w-3.5 shrink-0 text-[11px]`} />}
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300">{item.badge}</span>}
                <i className={`fa-solid fa-angle-${open ? 'down' : 'right'} text-[9px] shrink-0`} />
            </button>
            {open && (
                <div className={`mt-0.5 space-y-0.5 border-l border-white/10 ${depth === 0 ? 'ml-5 pl-2' : 'ml-3 pl-2'}`}>
                    {item.children.map((child, i) => (
                        <NavItem key={i} item={child} currentPathname={currentPathname} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

function Sidebar({ onClose }) {
    const { url: inertiaUrl = '' } = usePage();
    const fromInertia = String(inertiaUrl).split('?')[0];
    const currentPathname =
        fromInertia ||
        (typeof window !== 'undefined' ? window.location.pathname : '') ||
        '';

    return (
        <aside className="flex h-full w-60 shrink-0 flex-col bg-zinc-950 text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Link href="/" className="inline-flex items-end gap-0.5">
                    <span className="font-display text-3xl leading-none text-brand-orange">z</span>
                    <span className="font-display text-3xl leading-none text-white">Cart</span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white">
                        <i className="fa-solid fa-xmark" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                {NAV.map((item, i) => (
                    <NavItem key={i} item={item} currentPathname={currentPathname} />
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                <Link href="/" className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition">
                    <i className="fa-solid fa-arrow-left text-xs" />
                    Back to Shop
                </Link>
            </div>
        </aside>
    );
}

export default function PanelLayout({ children, title, subtitle, actions }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-800">
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex min-h-screen">
                <div className="hidden lg:flex lg:shrink-0">
                    <Sidebar />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* HEADER */}
                    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2 sm:px-5">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-50">
                                    <i className="fa-solid fa-bars text-sm" />
                                </button>
                                <Link href="/profile" className="hidden sm:flex items-center gap-2 text-sm text-zinc-600 hover:text-brand-orange transition">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                                        {auth.user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="font-medium">Welcome, {auth.user?.name}</span>
                                </Link>
                                <Link href="/" target="_blank" className="hidden md:flex items-center gap-1.5 rounded border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-brand-orange hover:text-brand-orange transition">
                                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                                    Storefront
                                </Link>
                            </div>

                            <div className="hidden lg:block text-center">
                                <h1 className="text-base font-bold text-zinc-900">{title}</h1>
                                {subtitle && <p className="text-[11px] text-zinc-500">{subtitle}</p>}
                            </div>

                            <div className="flex items-center gap-1">
                                <MessagesDropdown />
                                <NotificationsDropdown />
                                <div className="mx-1 h-5 w-px bg-zinc-200" />
                                <Link href="/profile" className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition">
                                    <i className="fa-solid fa-user text-[11px]" />
                                    <span className="hidden sm:block">Account</span>
                                </Link>
                                <Link href="/logout" method="post" as="button" className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition">
                                    <i className="fa-solid fa-right-from-bracket text-[11px]" />
                                    <span className="hidden sm:block">Logout</span>
                                </Link>
                                {actions && <div className="ml-2 flex gap-2">{actions}</div>}
                            </div>
                        </div>
                        <div className="border-t border-zinc-100 px-4 py-2 lg:hidden">
                            <h1 className="text-sm font-bold text-zinc-900">{title}</h1>
                        </div>
                    </header>

                    {/* MAIN — full width, no max-w cap */}
                    <main className="flex-1 overflow-auto p-4 sm:p-5">
                        {children}
                    </main>
                </div>
            </div>

            <Toast />
        </div>
    );
}
