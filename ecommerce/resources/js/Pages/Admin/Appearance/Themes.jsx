import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminThemes() {
    const themes = [
        { name: 'Default', desc: 'Clean minimal storefront theme', active: true, preview: 'bg-zinc-100' },
        { name: 'Dark Mode', desc: 'Dark themed storefront', active: false, preview: 'bg-zinc-800' },
        { name: 'Fashion', desc: 'Bold fashion-forward layout', active: false, preview: 'bg-pink-100' },
        { name: 'Minimal', desc: 'Ultra-minimal product focus', active: false, preview: 'bg-white border' },
    ];
    return (
        <AdminLayout title="Themes">
            <Head title="Themes — Admin" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {themes.map(t => (
                    <div key={t.name} className="rounded-xl bg-white shadow-sm overflow-hidden">
                        <div className={`h-32 ${t.preview} flex items-center justify-center`}>
                            <i className="fa-solid fa-desktop text-3xl text-zinc-400" />
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-zinc-800">{t.name}</p>
                                {t.active && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Active</span>}
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">{t.desc}</p>
                            <button className={`w-full rounded-lg py-2 text-xs font-semibold transition ${t.active ? 'bg-zinc-100 text-zinc-500 cursor-default' : 'bg-brand-orange text-white hover:bg-orange-600'}`}>
                                {t.active ? 'Current Theme' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
