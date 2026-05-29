import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPlugins({ plugins }) {
    return (
        <AdminLayout title="Plugins & Addons">
            <Head title="Plugins — Admin" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plugins.map(p => (
                    <div key={p.name} className="rounded-xl bg-white shadow-sm p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                                    <i className={`fa-solid ${p.icon} text-zinc-500`} />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-800">{p.name}</p>
                                    <p className="text-xs text-zinc-400">v{p.version}</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500">Addon</span>
                        </div>
                        <p className="text-xs text-zinc-500">{p.desc}</p>
                        <button className="mt-auto w-full rounded-lg border-2 border-dashed border-zinc-200 py-2 text-xs font-semibold text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition">
                            Install Plugin
                        </button>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
