import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

const SAMPLE_PAGES = [
    { id: 1, title: 'About Us', slug: 'about', status: 'Published' },
    { id: 2, title: 'Privacy Policy', slug: 'privacy-policy', status: 'Published' },
    { id: 3, title: 'Terms of Service', slug: 'terms', status: 'Published' },
    { id: 4, title: 'Contact Us', slug: 'contact', status: 'Published' },
    { id: 5, title: 'Return Policy', slug: 'return-policy', status: 'Draft' },
];

export default function AdminPages() {
    const [pages] = useState(SAMPLE_PAGES);

    return (
        <PanelLayout title="Pages" subtitle="Manage static content pages.">
            <Head title="Pages — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Static Pages" subtitle="Manage About, Privacy, Terms and other static pages."
                    actions={<button className="rounded-[3px] bg-brand-orange px-4 py-2 text-xs font-semibold text-white">+ New Page</button>}
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-4">Title</th>
                                <th className="py-2 pr-4">Slug</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(p => (
                                <tr key={p.id} className="border-t border-zinc-100">
                                    <td className="py-3 pr-4 font-semibold text-zinc-900">{p.title}</td>
                                    <td className="py-3 pr-4 font-mono text-xs text-zinc-500">/{p.slug}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${p.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>{p.status}</span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <div className="flex gap-2">
                                            <button className="rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">Edit</button>
                                            <button className="rounded-[3px] border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                                        </div>
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
