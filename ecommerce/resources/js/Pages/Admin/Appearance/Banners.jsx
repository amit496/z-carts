import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminBanners() {
    return (
        <PanelLayout title="Banners" subtitle="Manage homepage and promotional banners.">
            <Head title="Banners — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Homepage Banners" subtitle="Upload and manage banner images shown on the storefront." />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {[
                        { label: 'Hero Banner', size: '1920×600px', slot: 'hero' },
                        { label: 'Promo Banner 1', size: '600×400px', slot: 'promo1' },
                        { label: 'Promo Banner 2', size: '600×400px', slot: 'promo2' },
                    ].map(b => (
                        <div key={b.slot} className="rounded-[3px] border-2 border-dashed border-zinc-200 p-6 text-center hover:border-brand-orange transition">
                            <i className="fa-solid fa-image text-3xl text-zinc-300 mb-3" />
                            <p className="text-sm font-semibold text-zinc-700">{b.label}</p>
                            <p className="text-[11px] text-zinc-400 mt-1">Recommended: {b.size}</p>
                            <label className="mt-3 inline-block cursor-pointer rounded-[3px] bg-brand-orange px-4 py-2 text-xs font-semibold text-white">
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" />
                            </label>
                        </div>
                    ))}
                </div>
            </section>
        </PanelLayout>
    );
}
