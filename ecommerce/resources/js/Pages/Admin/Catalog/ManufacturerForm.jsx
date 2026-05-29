import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';

const COUNTRIES = [
    { value: '', label: 'Country…' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Cook Islands', label: 'Cook Islands' },
    { value: 'France', label: 'France' },
    { value: 'Germany', label: 'Germany' },
    { value: 'India', label: 'India' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
];

function fieldClass(err) {
    return `w-full rounded-[3px] border px-3 py-2 text-sm outline-none transition focus:border-brand-orange ${
        err ? 'border-red-300' : 'border-zinc-200'
    }`;
}

function useBlobPreview(file) {
    const [url, setUrl] = useState('');
    useEffect(() => {
        if (!file) {
            setUrl('');
            return undefined;
        }
        const u = URL.createObjectURL(file);
        setUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [file]);
    return url;
}

function PreviewThumb({ label, remoteUrl, file }) {
    const blob = useBlobPreview(file || null);
    const src = blob || remoteUrl || null;
    return (
        <div className="flex flex-wrap items-start gap-3">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-zinc-200 bg-zinc-50">
                {src ? (
                    <img src={src} alt="" className="h-full w-full object-contain object-center p-1" />
                ) : (
                    <i className="fa-regular fa-image text-2xl text-zinc-300" />
                )}
            </div>
            <p className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</p>
        </div>
    );
}

export default function ManufacturerForm({ mode = 'create', manufacturer = null }) {
    const isEdit = mode === 'edit';
    const { errors: pageErrorsRaw } = usePage().props;
    const pageErrors =
        pageErrorsRaw && typeof pageErrorsRaw === 'object'
            ? /** @type {Record<string, string | string[]>} */ (pageErrorsRaw)
            : {};

    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState(() => ({
        name: manufacturer?.name || '',
        slug: manufacturer?.slug || '',
        is_active: manufacturer?.is_active ?? true,
        url: manufacturer?.url || '',
        country: manufacturer?.country || '',
        email: manufacturer?.email || '',
        phone: manufacturer?.phone || '',
        description: manufacturer?.description || '',
        logo_url: manufacturer?.logo_url || '',
        logo_file: /** @type {File | null} */ (null),
    }));

    const fv = (patch) => setForm((f) => ({ ...f, ...patch }));

    const err = useMemo(() => pageErrors || {}, [pageErrors]);

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;
        setProcessing(true);
        const fd = new FormData();
        fd.append('name', form.name);
        if (form.slug.trim()) fd.append('slug', form.slug.trim());
        fd.append('is_active', form.is_active ? '1' : '0');
        if (form.url.trim()) fd.append('url', form.url.trim());
        if (form.country) fd.append('country', form.country);
        if (form.email.trim()) fd.append('email', form.email.trim());
        if (form.phone.trim()) fd.append('phone', form.phone.trim());
        if (form.description) fd.append('description', form.description);
        if (form.logo_file) fd.append('logo', form.logo_file);

        const url = isEdit ? `/admin/catalog/manufacturers/${manufacturer.id}` : '/admin/catalog/manufacturers';
        const opts = {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setProcessing(false),
        };
        if (isEdit) {
            router.patch(url, fd, opts);
        } else {
            router.post(url, fd, opts);
        }
    };

    return (
        <PanelLayout
            title={isEdit ? `Edit manufacturer` : 'Add manufacturer'}
            subtitle="Logo, website, contact details."
        >
            <Head title={isEdit ? 'Edit manufacturer — Admin' : 'Add manufacturer — Admin'} />

            {Object.keys(err).length > 0 && (
                <div className="mb-4 rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-900">
                    <p className="mb-2 font-semibold uppercase tracking-wide text-red-800">Please fix validation errors</p>
                    <ul className="list-disc space-y-1 pl-4">
                        {Object.entries(err).map(([k, v]) => (
                            <li key={k}>
                                <span className="font-medium">{k}: </span>
                                {Array.isArray(v) ? v.join(', ') : String(v)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/admin/catalog/manufacturers"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-brand-orange"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back to manufacturers
                </Link>
                <button
                    type="submit"
                    form="manufacturer-form"
                    disabled={processing}
                    className="rounded-[3px] bg-zinc-900 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </div>

            <form id="manufacturer-form" onSubmit={submit} className="space-y-6">
                <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Name *</label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => fv({ name: e.target.value })}
                                placeholder="Manufacturer name"
                                className={fieldClass(!!err.name)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Slug</label>
                            <input
                                value={form.slug}
                                onChange={(e) => fv({ slug: e.target.value })}
                                placeholder="SEO friendly URL segment"
                                className={fieldClass(!!err.slug)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Status</label>
                            <select
                                value={form.is_active ? '1' : '0'}
                                onChange={(e) => fv({ is_active: e.target.value === '1' })}
                                className={fieldClass(!!err.is_active)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Website URL</label>
                            <input
                                value={form.url}
                                onChange={(e) => fv({ url: e.target.value })}
                                placeholder="https://…"
                                className={fieldClass(!!err.url)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Country</label>
                            <select
                                value={form.country}
                                onChange={(e) => fv({ country: e.target.value })}
                                className={fieldClass(!!err.country)}
                            >
                                {COUNTRIES.map((c) => (
                                    <option key={c.value || '__'} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => fv({ email: e.target.value })}
                                placeholder="contact@brand.com"
                                className={fieldClass(!!err.email)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Phone</label>
                            <input
                                value={form.phone}
                                onChange={(e) => fv({ phone: e.target.value })}
                                placeholder="Phone number"
                                className={fieldClass(!!err.phone)}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                            <textarea
                                rows={6}
                                value={form.description}
                                onChange={(e) => fv({ description: e.target.value })}
                                placeholder="Short brand story…"
                                className={fieldClass(!!err.description)}
                            />
                        </div>
                        <div className="lg:col-span-2 border-t border-zinc-100 pt-6">
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Logo</label>
                            <PreviewThumb label={form.logo_file ? 'Pending upload' : 'Current'} remoteUrl={form.logo_url} file={form.logo_file} />
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-xs text-zinc-600 file:mr-2 file:rounded-[3px] file:border file:border-zinc-200 file:bg-white file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase"
                                onChange={(e) => fv({ logo_file: e.target.files?.[0] ?? null })}
                            />
                            <p className="mt-1 text-[10px] text-zinc-400">Square logo recommended (about 300×300px).</p>
                            {!!err.logo && <p className="mt-1 text-xs text-red-600">{String(err.logo)}</p>}
                        </div>
                    </div>
                </section>
            </form>
        </PanelLayout>
    );
}
