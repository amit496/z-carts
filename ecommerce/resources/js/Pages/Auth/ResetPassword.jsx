import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({ token, email: email || '', password: '', password_confirmation: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') }); };

    return (
        <div className="min-h-screen flex">
            <Head title="Reset Password — zCart" />
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-zinc-900/90" />
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center"><span className="text-orange-600 font-black text-2xl">Z</span></div>
                        <div><p className="text-2xl font-black">zCart</p><p className="text-xs text-orange-200 uppercase tracking-widest">Marketplace</p></div>
                    </Link>
                    <h1 className="text-5xl font-black leading-tight mb-4">Create a<br /><span className="text-orange-300">New Password</span></h1>
                    <p className="text-white/80 text-lg max-w-md">Choose a strong password to keep your account secure.</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h2 className="text-3xl font-black text-zinc-900 mb-2">New Password</h2>
                        <p className="text-gray-500 mb-6">Enter your new password below.</p>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 characters" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" autoFocus />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-60">
                                {processing ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
