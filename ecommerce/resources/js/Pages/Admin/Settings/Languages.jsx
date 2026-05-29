import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminLanguages({ languages }) {
    return (
        <AdminLayout title="Languages">
            <Head title="Languages — Admin" />
            <div className="rounded-xl bg-white shadow-sm overflow-hidden max-w-2xl">
                <div className="border-b px-5 py-4"><h3 className="font-bold text-zinc-800">Supported Languages</h3></div>
                <div className="divide-y divide-zinc-100">
                    {languages.map(l => (
                        <div key={l.code} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-bold text-zinc-400 w-8">{l.code.toUpperCase()}</span>
                                <span className="font-medium text-zinc-800">{l.name}</span>
                                {l.default && <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">Default</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${l.active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{l.active ? 'Active' : 'Inactive'}</span>
                                {!l.default && <button className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">{l.active ? 'Disable' : 'Enable'}</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
