import { Head, Link, useForm } from '@inertiajs/react';

export default function MerchantRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '', store_name: '', phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('merchant.register.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div className="min-h-screen flex bg-zinc-950">
            <Head title="Merchant Register — zCart" />

            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-2xl">Z</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">zCart</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest">Merchant Portal</p>
                    </div>
                </Link>

                <div>
                    <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 px-4 py-2 rounded-full text-sm font-medium text-brand-orange mb-6">
                        <i className="fa-solid fa-store" />
                        Start Selling Today
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-4 text-white">
                        Open Your<br />
                        <span className="text-brand-orange">Online Store</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                        Join thousands of merchants on zCart. Set up your store, list products, and start earning.
                    </p>
                    <div className="space-y-4">
                        {[
                            ['fa-bolt', 'Quick Setup', 'Your store goes live in minutes'],
                            ['fa-chart-line', 'Sales Dashboard', 'Track orders and revenue in real-time'],
                            ['fa-headset', 'Seller Support', 'Dedicated support for merchants'],
                            ['fa-percent', 'Low Commission', 'Keep more of what you earn'],
                        ].map(([icon, title, desc]) => (
                            <div key={title} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/20">
                                    <i className={`fa-solid ${icon} text-brand-orange`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{title}</p>
                                    <p className="text-xs text-zinc-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} zCart Marketplace. All rights reserved.</p>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">Z</span>
                            </div>
                            <span className="text-2xl font-black text-white">zCart</span>
                        </Link>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/20">
                                    <i className="fa-solid fa-store text-brand-orange text-sm" />
                                </div>
                                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Merchant Registration</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">Create Store</h2>
                            <p className="text-zinc-400 mt-1 text-sm">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Full Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Phone</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                        placeholder="+1 555-0100"
                                        className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Store Name</label>
                                <input type="text" value={data.store_name} onChange={e => setData('store_name', e.target.value)}
                                    placeholder="My Fashion Store"
                                    className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                {errors.store_name && <p className="text-red-400 text-xs mt-1">{errors.store_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="Min. 8 chars"
                                        className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Confirm</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Repeat"
                                        className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition" />
                                </div>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-900/30 disabled:opacity-60">
                                {processing ? 'Creating Store...' : 'Create Merchant Account'}
                            </button>
                        </form>

                        <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-center">
                            <p className="text-sm text-zinc-500">
                                Already have an account?{' '}
                                <Link href={route('admin.login')} className="text-brand-orange font-semibold hover:text-orange-400">
                                    Sign in
                                </Link>
                            </p>
                            <p className="text-sm text-zinc-500">
                                Customer?{' '}
                                <Link href={route('register')} className="text-zinc-400 hover:text-white font-medium">
                                    Customer register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
