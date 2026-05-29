import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const LINKS = [
    { href: '/seller/dashboard', icon: '📊', label: 'Dashboard', single: true },
    {
        label: 'Catalog', icon: '🏷️',
        children: [
            { href: '/seller/products', icon: '👗', label: 'Products' },
        ],
    },
    {
        label: 'Orders', icon: '📦',
        children: [
            { href: '/seller/orders', icon: '📦', label: 'Orders' },
        ],
    },
    {
        label: 'Promotions', icon: '🎟️',
        children: [
            { href: '/seller/coupons', icon: '🎟️', label: 'Coupons' },
        ],
    },
    {
        label: 'Support', icon: '🛟',
        children: [
            { href: '/chat', icon: '💬', label: 'Messages' },
            { href: '/seller/support/disputes', icon: '⚠️', label: 'Disputes' },
        ],
    },
    {
        label: 'Reports', icon: '📈',
        children: [
            { href: '/seller/reports/performance', icon: '📈', label: 'Performance' },
        ],
    },
    {
        label: 'Settings', icon: '⚙️',
        children: [
            { href: '/seller/store/edit', icon: '🏪', label: 'Store Settings' },
        ],
    },
];

function NavItem({ item, current, onClose }) {
    const isActive = item.single
        ? current === item.href
        : item.children?.some(c => current === c.href || current.startsWith(c.href + '/'));
    const [open, setOpen] = useState(isActive);

    if (item.single) {
        return (
            <Link href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}>
                <span>{item.icon}</span>{item.label}
            </Link>
        );
    }

    return (
        <div>
            <button onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'text-orange-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}>
                <span>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                <span className="text-xs">{open ? '▾' : '▸'}</span>
            </button>
            {open && (
                <div className="ml-4 mt-0.5 border-l border-zinc-700 pl-3 space-y-0.5">
                    {item.children.map(child => {
                        const childActive = current === child.href || current.startsWith(child.href + '/');
                        return (
                            <Link key={child.href} href={child.href} onClick={onClose}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                    childActive ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                                }`}>
                                <span>{child.icon}</span>{child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Sidebar({ onClose }) {
    const { auth } = usePage().props;
    const current = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="w-64 bg-zinc-900 text-white flex flex-col h-full">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-xl">Z</span>
                    </div>
                    <div>
                        <p className="text-xl font-black">zCart</p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Seller Panel</p>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white ml-2">✕</button>
                )}
            </div>
            <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-black text-white shrink-0">
                        {auth.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{auth.user?.name}</p>
                        <p className="text-xs text-zinc-400">Seller Account</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {LINKS.map((l, i) => (
                    <NavItem key={i} item={l} current={current} onClose={onClose} />
                ))}
            </nav>
            <div className="p-3 border-t border-zinc-800">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                    <span>←</span> Back to Shop
                </Link>
            </div>
        </div>
    );
}

function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [flash?.success]);

    if (!visible || !flash?.success) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            <span className="text-green-400">✓</span>
            {flash.success}
        </div>
    );
}

export default function SellerLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden border border-gray-200 rounded-xl p-2 text-gray-600"
                        >
                            ☰
                        </button>
                        <h1 className="text-xl lg:text-2xl font-black text-zinc-900">{title}</h1>
                    </div>
                    <Link
                        href="/seller/products/create"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
                    >
                        + Add Product
                    </Link>
                </header>
                <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
            </div>
            <Toast />
        </div>
    );
}
