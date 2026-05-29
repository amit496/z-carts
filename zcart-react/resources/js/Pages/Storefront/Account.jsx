import MainLayout from '@/Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
export default function Account({ user }) {
    const { data, setData, put, processing, errors } = useForm({ name: user.name, email: user.email, phone: user.phone ?? '' });
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Account</h1>
                <div className="grid md:grid-cols-3 gap-6">
                    <aside className="space-y-2 text-sm">
                        {[{href:'/account',label:'Profile'},{href:'/account/orders',label:'Orders'},{href:'/wishlist',label:'Wishlist'}].map(l => (
                            <Link key={l.href} href={l.href} className="block px-4 py-2 rounded-lg hover:bg-indigo-50 text-gray-700">{l.label}</Link>
                        ))}
                    </aside>
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Edit Profile</h2>
                        <form onSubmit={e=>{e.preventDefault();put('/account');}} className="space-y-4">
                            {[{label:'Name',key:'name',type:'text'},{label:'Email',key:'email',type:'email'},{label:'Phone',key:'phone',type:'tel'}].map(f => (
                                <div key={f.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                    <input type={f.type} value={data[f.key]} onChange={e=>setData(f.key,e.target.value)}
                                        className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
                                    {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                                </div>
                            ))}
                            <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-60">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
