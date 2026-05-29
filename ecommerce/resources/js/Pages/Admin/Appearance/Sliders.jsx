import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminSliders() {
    return (
        <PanelLayout title="Sliders" subtitle="Manage homepage carousel slides.">
            <Head title="Sliders — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Carousel Slides" subtitle="Add, edit and reorder homepage slider images." />
                <div className="mt-4 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 rounded-[3px] border border-zinc-100 p-4">
                            <div className="h-16 w-28 rounded-[3px] bg-zinc-100 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-image text-zinc-300 text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-700">Slide {i}</p>
                                <p className="text-[11px] text-zinc-400">No image uploaded</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <label className="cursor-pointer rounded-[3px] border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:border-brand-orange hover:text-brand-orange">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" />
                                </label>
                                <button className="rounded-[3px] border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">Remove</button>
                            </div>
                        </div>
                    ))}
                    <button className="mt-2 rounded-[3px] border border-dashed border-zinc-300 w-full py-3 text-sm text-zinc-500 hover:border-brand-orange hover:text-brand-orange transition">
                        + Add New Slide
                    </button>
                </div>
            </section>
        </PanelLayout>
    );
}
