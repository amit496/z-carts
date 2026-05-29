import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen flex bg-zinc-950">
            <Head title="Admin Login — zCart" />

            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/90 to-orange-950/80" />
                <Link href="/" className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-2xl">Z</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">zCart</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest">Admin Panel</p>
                    </div>
                </Link>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 px-4 py-2 rounded-full text-sm font-medium text-brand-orange mb-6">
                        <i className="fa-solid fa-shield-halved" />
                        Secure Admin Access
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-4 text-white">
                        Manage Your<br />
                        <span className="text-brand-orange">Marketplace</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                        Access the admin panel to manage users, products, orders, stores, and platform settings.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ['fa-users', 'Users', 'Manage all accounts'],
                            ['fa-store', 'Stores', 'Approve merchants'],
                            ['fa-boxes-stacked', 'Products', 'Catalog control'],
                            ['fa-receipt', 'Orders', 'Track & manage'],
                        ].map(([icon, title, desc]) => (
                            <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <i className={`fa-solid ${icon} text-brand-orange mb-2 text-lg`} />
                                <p className="text-sm font-bold text-white">{title}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-zinc-500 text-sm relative z-10">© {new Date().getFullYear()} zCart Marketplace. All rights reserved.</p>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
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
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/20">
                                    <i className="fa-solid fa-lock text-brand-orange text-sm" />
                                </div>
                                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Admin & Merchant Access</span>
                            </div>
                            <h2 className="text-3xl font-black text-white">Sign In</h2>
                            <p className="text-zinc-400 mt-1 text-sm">Enter your credentials to access the panel</p>
                        </div>

                        {status && <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">{status}</div>}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@zcart.com"
                                    className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition"
                                    autoFocus
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-zinc-300">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-xs text-brand-orange hover:text-orange-400 font-medium">
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition"
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                                <label htmlFor="remember" className="text-sm text-zinc-400">Keep me signed in</label>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-900/30 disabled:opacity-60">
                                {processing ? 'Signing in...' : 'Sign In to Panel'}
                            </button>
                        </form>

                        {/* Quick fill */}
                        <div className="mt-5 pt-5 border-t border-white/10">
                            <p className="text-center text-xs text-zinc-500 mb-3">Quick access for demo:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[['Admin', 'admin@zcart.com'], ['Merchant', 'sarah@zcart.com']].map(([role, email]) => (
                                    <button key={role} onClick={() => setData(d => ({ ...d, email, password: 'password' }))}
                                        className="text-xs bg-zinc-800 hover:bg-zinc-700 hover:text-brand-orange text-zinc-400 py-2 rounded-lg transition font-medium border border-zinc-700">
                                        <i className={`fa-solid ${role === 'Admin' ? 'fa-user-shield' : 'fa-store'} mr-1.5`} />
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 text-center">
                            <p className="text-sm text-zinc-500">
                                New merchant?{' '}
                                <Link href={route('merchant.register')} className="text-brand-orange font-semibold hover:text-orange-400">
                                    Register your store
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
