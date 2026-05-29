import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.email')); };

    return (
        <div className="min-h-screen flex">
            <Head title="Forgot Password — zCart" />
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-zinc-900/90" />
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center"><span className="text-orange-600 font-black text-2xl">Z</span></div>
                        <div><p className="text-2xl font-black">zCart</p><p className="text-xs text-orange-200 uppercase tracking-widest">Marketplace</p></div>
                    </Link>
                    <h1 className="text-5xl font-black leading-tight mb-4">Forgot your<br /><span className="text-orange-300">Password?</span></h1>
                    <p className="text-white/80 text-lg max-w-md">No worries! Enter your email and we'll send you a reset link to get back into your account.</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </div>
                        <h2 className="text-3xl font-black text-zinc-900 mb-2">Reset Password</h2>
                        <p className="text-gray-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
                        {status && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{status}</div>}
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="you@example.com" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" autoFocus />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-60">
                                {processing ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Remember your password? <Link href={route('login')} className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
