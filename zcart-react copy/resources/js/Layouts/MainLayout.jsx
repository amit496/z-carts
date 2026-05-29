import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function MainLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-md shadow-violet-200">
                            🏪
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            ShopNest
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
                        <Link href="/products" className="hover:text-violet-600 transition">Products</Link>
                        <Link href="/shops" className="hover:text-violet-600 transition">Shops</Link>
                        <Link href="/blog" className="hover:text-violet-600 transition">Blog</Link>
                        {auth?.user ? (
                            <>
                                <Link href="/account" className="hover:text-violet-600 transition">My Account</Link>
                                <Link href="/cart" className="hover:text-violet-600 transition">🛒 Cart</Link>
                                <Link href="/logout" method="post" as="button"
                                    className="text-red-500 hover:text-red-700 transition">Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hover:text-violet-600 transition">Login</Link>
                                <Link href="/register"
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition shadow-md shadow-violet-200">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
                        <div className="space-y-1.5">
                            <span className="block w-5 h-0.5 bg-gray-600"></span>
                            <span className="block w-5 h-0.5 bg-gray-600"></span>
                            <span className="block w-5 h-0.5 bg-gray-600"></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-gray-600 border-t bg-white">
                        {[
                            { href: '/', label: 'Home' },
                            { href: '/products', label: 'Products' },
                            { href: '/shops', label: 'Shops' },
                            { href: '/blog', label: 'Blog' },
                            { href: '/cart', label: '🛒 Cart' },
                        ].map(l => (
                            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                                className="py-1 hover:text-violet-600">{l.label}</Link>
                        ))}
                        {auth?.user ? (
                            <Link href="/logout" method="post" as="button" className="text-red-500 text-left">Logout</Link>
                        ) : (
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="hover:text-violet-600">Login</Link>
                        )}
                    </div>
                )}
            </nav>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-50 border-b border-green-200 text-green-800 text-sm px-4 py-2.5 text-center">
                    ✅ {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border-b border-red-200 text-red-800 text-sm px-4 py-2.5 text-center">
                    ❌ {flash.error}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-sm">🏪</div>
                                <span className="font-bold text-gray-800">ShopNest</span>
                            </div>
                            <p className="text-gray-400 text-sm">Your complete marketplace platform for buying and selling.</p>
                        </div>
                        {[
                            { title: 'Shop', links: [{ href: '/products', label: 'All Products' }, { href: '/shops', label: 'All Shops' }, { href: '/blog', label: 'Blog' }] },
                            { title: 'Account', links: [{ href: '/login', label: 'Login' }, { href: '/register', label: 'Register' }, { href: '/account', label: 'My Account' }] },
                            { title: 'Info', links: [{ href: '/page/about', label: 'About Us' }, { href: '/page/privacy', label: 'Privacy Policy' }, { href: '/page/terms', label: 'Terms of Use' }] },
                        ].map(col => (
                            <div key={col.title}>
                                <h3 className="font-semibold text-gray-700 mb-3">{col.title}</h3>
                                <ul className="space-y-2">
                                    {col.links.map(l => (
                                        <li key={l.href}>
                                            <Link href={l.href} className="text-gray-400 text-sm hover:text-violet-600 transition">{l.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-6 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} ShopNest Marketplace. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
