import { useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side — Background Image + Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"
                    alt="ShopNest"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/80 to-indigo-900/90" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                            🏪
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">ShopNest</h1>
                            <p className="text-purple-200 text-xs">Marketplace Platform</p>
                        </div>
                    </div>

                    {/* Middle Text */}
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            Your Complete<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300">
                                Marketplace
                            </span><br />
                            Solution
                        </h2>
                        <p className="text-purple-200 text-lg leading-relaxed">
                            Manage your entire marketplace — vendors, products, orders and customers from one powerful dashboard.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-8 mt-8">
                            {[
                                { value: '10K+', label: 'Products' },
                                { value: '500+', label: 'Vendors' },
                                { value: '50K+', label: 'Customers' },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-2xl font-bold text-white">{s.value}</p>
                                    <p className="text-purple-300 text-sm">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Quote */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <p className="text-white/90 text-sm italic leading-relaxed">
                            "ShopNest has transformed how we manage our marketplace. Everything is in one place and incredibly easy to use."
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">Ahmed Khan</p>
                                <p className="text-purple-300 text-xs">Top Vendor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow">
                            🏪
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">ShopNest</h1>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                        <p className="text-gray-500 mt-2">Sign in to your admin account</p>
                    </div>

                    {/* Error Banner */}
                    {errors.email && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                            <span className="text-red-500">⚠️</span>
                            <span>{errors.email}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="admin@shopnest.com"
                                autoComplete="email"
                                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition bg-white ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="/forgot-password" className="text-xs text-violet-600 hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition bg-white ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">Keep me signed in</label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 transition shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>Sign In <span>→</span></>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                        <p className="text-xs text-violet-700 font-medium mb-1">🔑 Demo Credentials</p>
                        <p className="text-xs text-violet-600">Email: <span className="font-mono font-semibold">admin@zcart.com</span></p>
                        <p className="text-xs text-violet-600">Password: <span className="font-mono font-semibold">admin123</span></p>
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-violet-600 font-medium hover:underline">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
