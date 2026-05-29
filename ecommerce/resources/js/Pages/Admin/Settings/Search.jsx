import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminSearch({ settings }) {
    return (
        <AdminLayout title="Search Settings">
            <Head title="Search Settings — Admin" />
            <div className="rounded-xl bg-white shadow-sm p-6 max-w-2xl">
                <h3 className="font-bold text-zinc-800 mb-4">Search Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 block mb-1">Search Engine</label>
                        <select defaultValue={settings.search_engine} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange">
                            <option value="default">Default (MySQL LIKE)</option>
                            <option value="fulltext">MySQL Full-Text</option>
                            <option value="algolia">Algolia (Addon)</option>
                            <option value="meilisearch">Meilisearch (Addon)</option>
                        </select>
                    </div>
                    {[
                        { key: 'min_search_length', label: 'Min Search Length (chars)' },
                        { key: 'max_results', label: 'Max Results per Page' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-xs font-semibold text-zinc-500 block mb-1">{f.label}</label>
                            <input type="number" defaultValue={settings[f.key]} className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-brand-orange" />
                        </div>
                    ))}
                    {[
                        { key: 'show_suggestions', label: 'Show Search Suggestions' },
                        { key: 'search_in_desc', label: 'Search in Product Descriptions' },
                    ].map(f => (
                        <div key={f.key} className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
                            <p className="font-medium text-zinc-800">{f.label}</p>
                            <div className={`h-6 w-11 rounded-full transition ${settings[f.key] ? 'bg-brand-orange' : 'bg-zinc-200'}`} />
                        </div>
                    ))}
                    <button className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Save Settings</button>
                </div>
            </div>
        </AdminLayout>
    );
}
