import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Inspector({ info }) {
    return (
        <AdminLayout title="Inspector settings">
            <Head title="Inspector — Settings" />
            <div className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-bold text-zinc-800">Inspector</h3>
                    <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600">Addon</span>
                </div>
                <p className="text-sm text-zinc-600">{info}</p>
                <p className="mt-4 text-xs text-zinc-400">
                    Manage inspectable listings from <span className="font-semibold text-zinc-600">Admin → Inspectables</span> when moderation is enabled.
                </p>
            </div>
        </AdminLayout>
    );
}
