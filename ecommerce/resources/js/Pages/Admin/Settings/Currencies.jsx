import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminCurrencies({ currencies }) {
    return (
        <PanelLayout title="Currencies" subtitle="Manage supported currencies on the platform.">
            <Head title="Currencies — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Currency List" subtitle="Set the active currency for the platform." />
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Code</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Symbol</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currencies.map(c => (
                                <tr key={c.code} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4 font-mono font-bold text-zinc-900">{c.code}</td>
                                    <td className="py-3 pr-4 text-zinc-700">{c.name}</td>
                                    <td className="py-3 pr-4 font-bold text-zinc-900">{c.symbol}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {c.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        {!c.active && (
                                            <button className="rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">
                                                Set Active
                                            </button>
                                        )}
                                        {c.active && <span className="text-[11px] text-emerald-600 font-semibold">✓ Default</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </PanelLayout>
    );
}
