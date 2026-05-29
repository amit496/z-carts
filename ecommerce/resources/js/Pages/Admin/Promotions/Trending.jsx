import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminTrending({ keywords }) {
    const max = Math.max(...keywords.map(k => k.count), 1);
    return (
        <AdminLayout title="Trending Keywords">
            <Head title="Trending Keywords — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-5">
                <p className="text-sm text-zinc-500 mb-4">Keywords extracted from active product catalog — brands, genders, materials.</p>
                <div className="space-y-2">
                    {keywords.map(k => (
                        <div key={k.word} className="flex items-center gap-3">
                            <span className="w-28 text-sm font-semibold text-zinc-700 capitalize">{k.word}</span>
                            <div className="flex-1 h-6 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-orange rounded-full transition-all" style={{ width: `${(k.count / max) * 100}%` }} />
                            </div>
                            <span className="w-8 text-right text-xs font-bold text-zinc-500">{k.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
