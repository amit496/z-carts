import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminCustomCss() {
    const { data, setData, post, processing } = useForm({ css: '' });

    return (
        <PanelLayout title="Custom CSS" subtitle="Inject custom styles into the storefront.">
            <Head title="Custom CSS — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Custom CSS Editor" subtitle="Changes apply to the public storefront immediately." />
                <textarea
                    value={data.css}
                    onChange={e => setData('css', e.target.value)}
                    rows={20}
                    placeholder="/* Add your custom CSS here */&#10;.hero { background: #ff6b35; }"
                    className="w-full rounded-[3px] border border-zinc-200 bg-zinc-950 px-4 py-3 font-mono text-sm text-emerald-400 outline-none focus:border-brand-orange resize-none"
                />
                <div className="mt-3 flex gap-3">
                    <button disabled={processing} className="rounded-[3px] bg-brand-orange px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        Save CSS
                    </button>
                    <button onClick={() => setData('css', '')} className="rounded-[3px] border border-zinc-200 px-6 py-2 text-sm font-semibold text-zinc-600">
                        Clear
                    </button>
                </div>
            </section>
        </PanelLayout>
    );
}
