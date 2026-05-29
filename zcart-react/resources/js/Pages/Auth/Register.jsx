import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    const fields = [
        { label: 'Full Name',        key: 'name',                  type: 'text',     placeholder: 'John Doe' },
        { label: 'Email Address',    key: 'email',                 type: 'email',    placeholder: 'john@example.com' },
        { label: 'Password',         key: 'password',              type: 'password', placeholder: '••••••••' },
        { label: 'Confirm Password', key: 'password_confirmation', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
                    alt="ShopNest"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/80 to-indigo-900/90" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                            🏪
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">ShopNest</h1>
                            <p className="text-purple-200 text-xs">Marketplace Platform</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            Start Selling<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300">
                                Today
                            </span>
                        </h2>
                        <p className="text-purple-200 text-lg leading-relaxed">
                            Join thousands of vendors already growing their business on ShopNest marketplace.
                        </p>
                        <div className="flex gap-8 mt-8">
                            {[{ value: 'Free', label: 'To Join' }, { value: '24/7', label: 'Support' }, { value: '100%', label: 'Secure' }].map(s => (
                                <div key={s.label}>
                                    <p className="text-2xl font-bold text-white">{s.value}</p>
                                    <p className="text-purple-300 text-sm">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                        <p className="text-white/90 text-sm italic">
                            "Setting up my store on ShopNest took less than 5 minutes. The dashboard is incredibly intuitive."
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">S</div>
                            <div>
                                <p className="text-white text-sm font-medium">Sara Ali</p>
                                <p className="text-purple-300 text-xs">Fashion Vendor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow">🏪</div>
                        <h1 className="text-xl font-bold text-gray-800">ShopNest</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
                        <p className="text-gray-500 mt-2">Join ShopNest marketplace today</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {fields.map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    value={data[key]}
                                    onChange={e => setData(key, e.target.value)}
                                    placeholder={placeholder}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition bg-white ${errors[key] ? 'border-red-400' : 'border-gray-300'}`}
                                />
                                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 transition shadow-lg shadow-violet-200 flex items-center justify-center gap-2 mt-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : <>Create Account <span>→</span></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-violet-600 font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
