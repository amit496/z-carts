import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', password: '', password_confirmation: '', role: 'buyer' });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Create Account — zCart" />

            {/* LEFT SIDE */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80" alt="Fashion" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-indigo-900/80 to-orange-600/70" />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-orange-600 font-black text-2xl">Z</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black">zCart</p>
                            <p className="text-xs text-orange-200 uppercase tracking-widest">Marketplace</p>
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-5xl font-black leading-tight mb-4">
                            Join the<br />
                            <span className="text-orange-300">Fashion Revolution</span>
                        </h1>
                        <p className="text-white/80 text-lg mb-8 max-w-md">Create your account and start shopping or selling. Join over 10,000 fashion enthusiasts on zCart.</p>
                        <div className="space-y-4">
                            {[
                                ['🛍️','Shop from 95+ premium products'],
                                ['🏪','Open your own store in minutes'],
                                ['🚚','Free shipping on orders over $100'],
                                ['↩️','Easy 30-day returns'],
                            ].map(([icon, text]) => (
                                <div key={text} className="flex items-center gap-3">
                                    <span className="text-2xl">{icon}</span>
                                    <span className="text-white/90">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-white/50 text-sm">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">Z</span>
                            </div>
                            <span className="text-2xl font-black text-zinc-900">zCart</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-zinc-900">Create Account</h2>
                            <p className="text-gray-500 mt-1">Start your fashion journey today</p>
                        </div>

                        {/* Account Type */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[['buyer','🛍️','I want to Shop'],['seller','🏪','I want to Sell']].map(([role,icon,label]) => (
                                <button key={role} type="button" onClick={() => setData('role', role)}
                                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition ${data.role === role ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                    <span className="text-xl">{icon}</span>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                            <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or register with email</span></div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="you@example.com" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 characters" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-60">
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
