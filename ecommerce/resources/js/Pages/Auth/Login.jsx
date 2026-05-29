import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Sign In — zCart" />

            {/* LEFT SIDE */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
                    alt="Fashion"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-700/80 to-zinc-900/90" />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-orange-600 font-black text-2xl">Z</span>
                            </div>
                            <div>
                                <p className="text-2xl font-black">zCart</p>
                                <p className="text-xs text-orange-200 uppercase tracking-widest">Marketplace</p>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            10,000+ Happy Customers
                        </div>
                        <h1 className="text-5xl font-black leading-tight mb-4">
                            Shop the Latest<br />
                            <span className="text-orange-300">Fashion Trends</span>
                        </h1>
                        <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                            Discover thousands of products from top brands and independent sellers. Your perfect style is just a click away.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {[['95+','Products'],['500+','Brands'],['10K+','Customers']].map(([num,label]) => (
                                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                                    <p className="text-2xl font-black text-orange-300">{num}</p>
                                    <p className="text-xs text-white/70 mt-1">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(n => (
                                <img key={n} src={`https://i.pravatar.cc/40?img=${n+10}`} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
                            ))}
                        </div>
                        <p className="text-sm text-white/80">Join thousands of fashion lovers today</p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">Z</span>
                            </div>
                            <span className="text-2xl font-black text-zinc-900">zCart</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-zinc-900">Welcome back!</h2>
                            <p className="text-gray-500 mt-1">Sign in to your account to continue</p>
                        </div>

                        {status && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{status}</div>}

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                            <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or sign in with email</span></div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
                                    autoFocus
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                                    {canResetPassword && <Link href={route('password.request')} className="text-xs text-orange-500 hover:text-orange-600 font-medium">Forgot password?</Link>}
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                                <label htmlFor="remember" className="text-sm text-gray-600">Keep me signed in</label>
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-60">
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-orange-500 font-semibold hover:text-orange-600">Create account</Link>
                        </p>

                        <div className="mt-3 text-center">
                            <Link href={route('admin.login')} className="text-xs text-gray-400 hover:text-gray-600">
                                <i className="fa-solid fa-shield-halved mr-1" />Admin / Merchant Login
                            </Link>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-center text-xs text-gray-400 mb-2">Quick access for demo:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[['Admin','admin@zcart.com'],['Seller','sarah@zcart.com'],['Buyer','alice.walker@example.com']].map(([role,email]) => (
                                    <button key={role} onClick={() => { setData(d => ({...d, email, password:'password'})); }} className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 py-1.5 rounded-lg transition font-medium">
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
