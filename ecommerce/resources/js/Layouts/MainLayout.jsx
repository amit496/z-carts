import Navbar from '@/Components/Navbar';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function MainLayout({ children }) {
    const [showCookie, setShowCookie] = useState(true);

    useEffect(() => {
        try {
            const accepted = window.localStorage.getItem('zcart-cookie-accepted') === '1';
            setShowCookie(!accepted);
        } catch {
            setShowCookie(true);
        }
    }, []);

    const acceptCookies = () => {
        try {
            window.localStorage.setItem('zcart-cookie-accepted', '1');
        } catch {
            // Ignore storage issues in private mode.
        }
        setShowCookie(false);
    };

    return (
        <div className="min-h-screen bg-brand-cream text-zinc-800">
            <Navbar />
            <main>{children}</main>
            <section className="mt-10 bg-zinc-900 text-white">
                <div className="mx-auto max-w-[1040px] px-4 py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-orange">
                                <i className="fa-regular fa-envelope text-lg" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Subscribe To Our Newsletter</h3>
                                <p className="max-w-lg text-[10px] text-zinc-400">
                                    Signup for our newsletter to get the latest news, updates and amazing offers delivered directly to your inbox.
                                </p>
                            </div>
                        </div>

                        <form className="flex flex-1 overflow-hidden rounded-[2px] bg-white">
                            <input
                                type="email"
                                placeholder="Please enter your email"
                                className="min-w-0 flex-1 px-4 py-3 text-[11px] text-zinc-700 outline-none"
                            />
                            <button className="bg-brand-orange px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="bg-zinc-950 text-zinc-400">
                <div className="mx-auto max-w-[1040px] px-4 py-10">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Link href="/" className="mb-4 inline-flex items-end gap-1">
                                <span className="font-display text-[42px] leading-none text-brand-orange">z</span>
                                <span className="font-display text-[42px] leading-none text-white">Cart</span>
                            </Link>
                            <p className="text-[11px] leading-6 text-zinc-400">
                                Your premium marketplace for curated products, reliable sellers, and fast shipping.
                            </p>
                            <div className="mt-4 space-y-2 text-[11px]">
                                <p><i className="fa-solid fa-location-dot mr-2 text-brand-orange" /> 24 Street, London, United Kingdom</p>
                                <p><i className="fa-solid fa-phone mr-2 text-brand-orange" /> +91 (0) 123-456-7</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">Let us help you</h4>
                            <ul className="space-y-2 text-[11px]">
                                <li><a href="#" className="hover:text-brand-orange">Your Orders</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Your Account</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Shipping & policies</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Help Center</a></li>
                                <li><a href="#" className="hover:text-brand-orange">How to return</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">Useful Links</h4>
                            <ul className="space-y-2 text-[11px]">
                                <li><a href="#" className="hover:text-brand-orange">Sell on zCart</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Become Affiliate</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Community</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Why choose us</a></li>
                                <li><a href="#" className="hover:text-brand-orange">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">Follow Us</h4>
                            <p className="text-[11px] leading-6">
                                Stay connected for new arrivals, flash sales and seller stories.
                            </p>
                            <div className="mt-4 flex gap-2">
                                {['f', 't', 'i', 'y'].map((icon) => (
                                    <a key={icon} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[10px] text-white hover:bg-brand-orange">
                                        {icon.toUpperCase()}
                                    </a>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2 text-[10px]">
                                {['VISA', 'MC', 'PAYPAL', 'AMEX'].map((payment) => (
                                    <span key={payment} className="rounded-[2px] bg-white px-2 py-1 font-semibold text-zinc-700">
                                        {payment}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {showCookie && (
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
                    <div className="mx-auto flex max-w-[1040px] flex-col gap-3 sm:flex-row sm:items-center">
                        <p className="text-[10px] leading-5 text-zinc-600">
                            We use cookies to improve your experience, personalize content and analyze traffic. By continuing to browse you agree to our cookie policy.
                        </p>
                        <div className="flex gap-2 sm:ml-auto">
                            <button onClick={acceptCookies} className="rounded-[2px] bg-brand-orange px-4 py-2 text-[10px] font-semibold text-white">
                                Allow Cookies
                            </button>
                            <button onClick={() => setShowCookie(false)} className="rounded-[2px] border border-zinc-200 bg-white px-4 py-2 text-[10px] font-semibold text-zinc-700">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
