import { Head, Link } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';

export default function ManufacturerShow({ manufacturer }) {
    const m = manufacturer || {};

    return (
        <PanelLayout title={m.name || 'Manufacturer'} subtitle="Catalog manufacturer profile">
            <Head title={`${m.name || 'Manufacturer'} — Admin`} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/admin/catalog/manufacturers"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-brand-orange"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back to manufacturers
                </Link>
                <Link
                    href={`/admin/catalog/manufacturers/${m.id}/edit`}
                    className="rounded-[3px] bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800"
                >
                    Edit
                </Link>
            </div>

            <section className="rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex shrink-0 flex-col gap-3">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[3px] border border-zinc-200 bg-zinc-50">
                            {m.logo_url ? (
                                <img src={m.logo_url} alt="" className="h-full w-full object-contain object-center p-1" />
                            ) : (
                                <i className="fa-regular fa-image text-3xl text-zinc-300" />
                            )}
                        </div>
                        <p className="max-w-[8rem] text-center text-[10px] uppercase tracking-wide text-zinc-400">Logo</p>
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-xl font-bold text-zinc-900">{m.name}</h1>
                            <span
                                className={`rounded-[3px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                    m.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                                }`}
                            >
                                {m.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        {m.slug && (
                            <p className="text-sm text-zinc-500">
                                Slug: <span className="font-mono text-zinc-700">{m.slug}</span>
                            </p>
                        )}
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Email</dt>
                                <dd className="text-zinc-800">{m.email || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Phone</dt>
                                <dd className="text-zinc-800">{m.phone || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Country</dt>
                                <dd className="text-zinc-800">{m.country || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Website</dt>
                                <dd className="text-zinc-800">
                                    {m.url ? (
                                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                                            {m.url}
                                        </a>
                                    ) : (
                                        '—'
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Linked products</dt>
                                <dd className="font-semibold text-zinc-800">
                                    {(m.products_count ?? 0) > 0 ? (
                                        <Link
                                            href={`/admin/products?manufacturer=${m.id}`}
                                            className="text-brand-orange hover:underline"
                                        >
                                            {m.products_count}
                                        </Link>
                                    ) : (
                                        0
                                    )}
                                </dd>
                            </div>
                            {m.created_at_fmt && (
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Created</dt>
                                    <dd className="text-zinc-800">{m.created_at_fmt}</dd>
                                </div>
                            )}
                        </dl>
                        {m.description ? (
                            <div className="rounded-[3px] border border-zinc-100 bg-zinc-50/80 p-4 text-sm text-zinc-700">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">Description</p>
                                <p className="whitespace-pre-wrap">{m.description}</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </PanelLayout>
    );
}
