import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const navLinks = [
    { href: '/shop', label: 'Categories', icon: 'fa-bars' },
    { href: '/shop', label: 'Brands', icon: 'fa-tag' },
    { href: '/shop', label: 'Vendors', icon: 'fa-store' },
    { href: '/shop', label: 'Auctions', icon: 'fa-gavel' },
    { href: '/shop?category=sports', label: 'Sports', icon: 'fa-bullhorn' },
    { href: '/shop', label: 'Events', icon: 'fa-calendar' },
    { href: '/seller/setup', label: 'Sell on zCart', icon: 'fa-cart-plus' },
];

export default function Navbar() {
    const { auth, cartCount, wishlistCount, flash } = usePage().props;
    const [searchQ, setSearchQ] = useState('');
    const [searchCat, setSearchCat] = useState('All Categories');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const search = (event) => {
        event.preventDefault();
        router.get('/shop', {
            search: searchQ,
            category: searchCat !== 'All Categories' ? searchCat : '',
        });
    };

    const handleLogout = (event) => {
        event.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="relative z-40">
            {flash?.success && (
                <div className="bg-emerald-500 px-4 py-2 text-center text-xs font-semibold text-white">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-rose-500 px-4 py-2 text-center text-xs font-semibold text-white">
                    {flash.error}
                </div>
            )}

            <div className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-3 px-3 py-2 text-[10px] text-zinc-500 sm:px-4">
                    <p className="hidden sm:block">Welcome To zCart Marketplace</p>
                    <div className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                        <Link href={auth.user ? '/profile' : '/login'} className="flex items-center gap-1 hover:text-brand-orange">
                            <i className="fa-regular fa-user" /> {auth.user ? `Hello, ${auth.user.name.split(' ')[0]}` : 'Hello, Sign in'}
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-1 hover:text-brand-orange">
                            <i className="fa-regular fa-heart" /> Wishlist
                        </Link>
                        <Link href="/orders" className="flex items-center gap-1 hover:text-brand-orange">
                            <i className="fa-solid fa-truck" /> Track your Order
                        </Link>
                        <a href="#" className="flex items-center gap-1 hover:text-brand-orange">
                            <i className="fa-regular fa-building" /> Suppliers
                        </a>
                        <a href="#" className="flex items-center gap-1 hover:text-brand-orange">
                            <i className="fa-solid fa-phone" /> +91 (0)123-456-7
                        </a>
                        <span className="flex items-center gap-1">
                            <img src="https://flagcdn.com/w20/us.png" alt="EN" className="h-3.5 w-5" />
                            English
                        </span>
                    </div>
                </div>
            </div>

            <div className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-[1040px] flex-col gap-3 px-3 py-3 lg:flex-row lg:items-center lg:px-4">
                    <Link href="/" className="flex items-end gap-1 self-start">
                        <span className="font-display text-[38px] leading-none text-brand-orange">z</span>
                        <span className="font-display text-[38px] leading-none text-zinc-900">Cart</span>
                    </Link>

                    <form onSubmit={search} className="flex w-full flex-1 overflow-hidden rounded-[2px] border border-brand-orange bg-white shadow-sm">
                        <select
                            value={searchCat}
                            onChange={(event) => setSearchCat(event.target.value)}
                            className="min-w-[120px] border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600 outline-none sm:min-w-[140px]"
                        >
                            <option>All Categories</option>
                            <option>Furniture</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Beauty</option>
                            <option>Sports</option>
                        </select>
                        <input
                            type="text"
                            placeholder="I'm shopping for..."
                            value={searchQ}
                            onChange={(event) => setSearchQ(event.target.value)}
                            className="min-w-0 flex-1 px-3 py-2 text-[11px] outline-none sm:px-4"
                        />
                        <button type="submit" className="bg-brand-orange px-4 text-white transition hover:bg-orange-600 sm:px-5">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                    </form>

                    <div className="flex items-center gap-3 self-end lg:self-auto">
                        <div className="relative" ref={userRef}>
                            <button
                                type="button"
                                onClick={() => setShowUserMenu((value) => !value)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-[14px] text-zinc-700 transition hover:border-brand-orange hover:text-brand-orange"
                            >
                                <i className="fa-regular fa-user" />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 top-12 w-72 rounded-[3px] border border-zinc-200 bg-white p-2 shadow-2xl">
                                    {auth.user ? (
                                        <>
                                            <div className="rounded-xl bg-zinc-50 px-4 py-3">
                                                <p className="text-sm font-semibold text-zinc-900">{auth.user.name}</p>
                                                <p className="text-xs text-zinc-500">{auth.user.email}</p>
                                            </div>
                                            <Link href="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                <i className="fa-regular fa-user text-brand-orange" /> My Profile
                                            </Link>
                                            <Link href="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                <i className="fa-solid fa-box text-brand-orange" /> My Orders
                                            </Link>
                                            <Link href="/wishlist" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                <i className="fa-regular fa-heart text-brand-orange" /> Wishlist
                                            </Link>
                                            {auth.user.role === 'seller' && (
                                                <Link href="/seller/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                    <i className="fa-solid fa-store text-brand-orange" /> Seller Dashboard
                                                </Link>
                                            )}
                                            {auth.user.role === 'admin' && (
                                                <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                    <i className="fa-solid fa-gear text-brand-orange" /> Admin Panel
                                                </Link>
                                            )}
                                            <div className="my-2 border-t border-zinc-200" />
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50"
                                            >
                                                <i className="fa-solid fa-right-from-bracket" /> Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                <i className="fa-solid fa-right-to-bracket text-brand-orange" /> Sign In
                                            </Link>
                                            <Link href="/register" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50">
                                                <i className="fa-solid fa-user-plus text-brand-orange" /> Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-[14px] text-zinc-700 transition hover:border-brand-orange hover:text-brand-orange">
                            <i className="fa-regular fa-heart" />
                            {wishlistCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-zinc-700 transition hover:border-brand-orange hover:text-brand-orange">
                            <span className="relative flex items-center justify-center text-[14px]">
                                <i className="fa-solid fa-cart-shopping" />
                                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-orange px-1 text-[9px] font-bold text-white">
                                    {cartCount || 0}
                                </span>
                            </span>
                            <span className="hidden text-[11px] font-medium sm:inline">Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            <nav className="border-b border-zinc-900 bg-brand-orange text-white">
                <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-3 overflow-x-auto px-3 sm:px-4">
                    <div className="flex min-w-max items-center">
                        {navLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black/15"
                            >
                                <i className={`fa-solid ${item.icon}`} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <Link href="/shop" className="inline-flex min-w-max items-center gap-2 bg-zinc-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-black">
                        <i className="fa-solid fa-bolt text-yellow-400" />
                        Flash Sale 40% Discount
                        <i className="fa-solid fa-chevron-right text-[10px]" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}
