import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';

const TABS = [
    { key: 'basic', label: 'Basic info' },
    { key: 'images', label: 'Images' },
    { key: 'variants', label: 'Variants' },
    { key: 'description', label: 'Description' },
    { key: 'listings', label: 'Pricing & stock' },
    { key: 'seo', label: 'SEO' },
];

function useBlobUrl(file) {
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

function HeroCover({ blobFile, remoteUrl }) {
    const blobPreview = useBlobUrl(blobFile || null);
    const src = blobPreview || remoteUrl || null;
    return (
        <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[3px] border border-zinc-200 bg-zinc-50">
            {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <i className="fa-regular fa-image text-3xl text-zinc-300" />}
        </div>
    );
}

function PendingThumb({ file }) {
    const url = useBlobUrl(file);
    return url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full animate-pulse bg-zinc-200" />;
}

const COUNTRIES = [
    { value: '', label: 'Select country…' },
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

function emptyVariantRow() {
    return { id: undefined, size: '', color: '', color_hex: '#cccccc', stock: 0, price_adjustment: '0', sku: '' };
}

function CategoryTagPicker({ categoryOptions, selectedIds, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    const sid = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);
    const selectedOpts = categoryOptions.filter((c) => sid.has(String(c.id)));
    const term = search.trim().toLowerCase();
    const filtered = categoryOptions.filter(
        (c) => !sid.has(String(c.id)) && (!term || c.label.toLowerCase().includes(term)),
    );

    const add = (id) => {
        onChange([...selectedIds.map(String), String(id)]);
        setSearch('');
    };
    const remove = (id) => onChange(selectedIds.filter((x) => String(x) !== String(id)));

    return (
        <div className="relative" ref={wrapRef}>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Categories *</label>
            <div
                className={`flex min-h-[44px] flex-wrap gap-1.5 rounded-[3px] border p-2 ${
                    error ? 'border-red-300 bg-red-50/30' : 'border-zinc-200 bg-white'
                }`}
            >
                {selectedOpts.map((c) => (
                    <span
                        key={c.id}
                        className="inline-flex max-w-full items-center gap-1 rounded border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-800 shadow-sm"
                    >
                        <span className="truncate">{c.label}</span>
                        <button type="button" onClick={() => remove(c.id)} className="shrink-0 text-zinc-500 hover:text-rose-600">
                            <i className="fa-solid fa-xmark text-[10px]" />
                        </button>
                    </span>
                ))}
                <button
                    type="button"
                    onClick={() =>
                        setOpen((o) => {
                            if (!o) setSearch('');
                            return !o;
                        })
                    }
                    className="rounded-[3px] border border-dashed border-zinc-300 px-2 py-1 text-[11px] font-semibold text-zinc-600 hover:border-brand-orange hover:text-brand-orange"
                >
                    <i className="fa-solid fa-plus mr-1" />
                    Add category
                </button>
            </div>
            {open && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 p-2">
                        <input
                            type="search"
                            placeholder="Search…"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-[3px] border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <ul className="max-h-52 overflow-y-auto py-1">
                        {!filtered.length && <li className="px-3 py-2 text-xs text-zinc-400">No categories match</li>}
                        {filtered.map((c) => (
                            <li key={c.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        add(c.id);
                                        setOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                                >
                                    {c.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <p className="mt-1 text-[10px] text-zinc-400">Assign all catalog categories — first one is used as legacy primary shelf.</p>
        </div>
    );
}

function TabButton({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`border-b-2 px-1 pb-3 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
                active ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
        >
            {children}
        </button>
    );
}

function fieldClass(err) {
    return `w-full rounded-[3px] border px-3 py-2 text-sm outline-none transition focus:border-brand-orange ${
        err ? 'border-red-300' : 'border-zinc-200'
    }`;
}

export default function ProductForm({ mode = 'create', product = null, stores = [], categoryOptions = [], manufacturerOptions = [] }) {
    const isEdit = mode === 'edit';
    const { errors: pageErrorsRaw } = usePage().props;
    const pageErrors =
        pageErrorsRaw && typeof pageErrorsRaw === 'object' ? /** @type {Record<string, string | string[]>} */ (pageErrorsRaw) : {};
    const firstStoreId = stores[0]?.id != null ? String(stores[0].id) : '';

    const [tab, setTab] = useState('basic');

    const [form, setForm] = useState(() => ({
        store_id: product?.store_id != null ? String(product.store_id) : firstStoreId,
        slug: product?.slug || '',
        name: product?.name || '',
        product_type: product?.product_type || 'physical',
        requires_shipping: product?.requires_shipping ?? true,
        manufacturer_id: product?.manufacturer_id != null ? String(product.manufacturer_id) : '',
        brand: product?.brand || '',
        manufacturer: product?.manufacturer || '',
        model_number: product?.model_number || '',
        gtin: product?.gtin || '',
        mpn: product?.mpn || '',
        origin_country: product?.origin_country || '',
        price: product?.price ?? '',
        compare_price: product?.compare_price ?? '',
        stock: product?.stock ?? 0,
        material: product?.material || '',
        gender: product?.gender || '',
        description: product?.description || '',
        meta_title: product?.meta_title || '',
        meta_description: product?.meta_description || '',
        available_from: product?.available_from || '',
        category_ids: (product?.category_ids || []).map(String),
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
    }));

    const [variants, setVariants] = useState(() =>
        isEdit && product?.variants?.length
            ? product.variants.map((v) => ({
                  id: v.id,
                  size: v.size || '',
                  color: v.color || '',
                  color_hex: v.color_hex || '#cccccc',
                  stock: v.stock ?? 0,
                  price_adjustment: v.price_adjustment ?? '0',
                  sku: v.sku || '',
              }))
            : [emptyVariantRow()],
    );

    /** New uploads queued for Laravel `primary_image` + `gallery[]` (stored on `product_images`). */
    const [pendingImages, setPendingImages] = useState(() => []);
    /** Which pending blob is the cover (`primary_image`); others go to gallery. */
    const [primaryPendingKey, setPrimaryPendingKey] = useState(null);
    /** `append` = send all new files as gallery[] only (keep current cover). `replace_cover` = one file becomes primary_image. */
    const [newImagesMode, setNewImagesMode] = useState(() =>
        mode === 'edit' && Array.isArray(product?.images) && product.images.length > 0 ? 'append' : 'replace_cover',
    );
    const [removeImageIds, setRemoveImageIds] = useState([]);
    const [processing, setProcessing] = useState(false);
    const addImagesInputRef = useRef(null);

    const removeIdSet = useMemo(() => new Set(removeImageIds.map(Number)), [removeImageIds]);

    const visibleGallery = useMemo(
        () => (product?.images || []).filter((im) => !removeIdSet.has(Number(im.id))),
        [product?.images, removeIdSet],
    );

    /** After save or refresh, strip delete-queue IDs that no longer exist on the server payload. */
    const savedImageIdsKey = useMemo(
        () => JSON.stringify([...(product?.images ?? []).map((im) => Number(im.id))].sort((a, b) => a - b)),
        [product?.images],
    );

    useEffect(() => {
        const validIds = new Set(JSON.parse(savedImageIdsKey));
        setRemoveImageIds((prev) => prev.filter((raw) => validIds.has(Number(raw))));
    }, [savedImageIdsKey]);

    const heroPendingBlob = useMemo(() => {
        if (!pendingImages.length || newImagesMode !== 'replace_cover') return null;
        const k = primaryPendingKey || pendingImages[0]?.key;
        return pendingImages.find((p) => p.key === k)?.file ?? pendingImages[0]?.file ?? null;
    }, [pendingImages, primaryPendingKey, newImagesMode]);

    const heroRemoteUrl =
        visibleGallery.find((i) => i.is_primary)?.url || visibleGallery[0]?.url || null;


    const fv = (patch) => setForm((f) => ({ ...f, ...patch }));

    const pushVariantRow = () => setVariants((v) => [...v, emptyVariantRow()]);
    const updateVariantRow = (idx, patch) =>
        setVariants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    const removeVariantRow = (idx) => setVariants((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== idx)));

    const toggleRemoveImage = (rawId) => {
        const id = Number(rawId);
        if (!Number.isFinite(id) || id <= 0) return;
        setRemoveImageIds((s) => {
            const normalized = [...new Set(s.map(Number).filter((x) => Number.isFinite(x) && x > 0))];
            return normalized.includes(id) ? normalized.filter((x) => x !== id) : [...normalized, id];
        });
    };

    const appendPendingImages = (fileList) => {
        const files = Array.from(fileList || []).filter(Boolean);
        if (!files.length) return;
        setPendingImages((prev) => {
            const additions = files.map((file) => ({ key: `p-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`, file }));
            return [...prev, ...additions];
        });
        requestAnimationFrame(() => {
            if (addImagesInputRef.current) addImagesInputRef.current.value = '';
        });
    };

    useEffect(() => {
        setPrimaryPendingKey((pk) => {
            if (!pendingImages.length) return null;
            if (pk && pendingImages.some((p) => p.key === pk)) return pk;
            return pendingImages[0]?.key ?? null;
        });
    }, [pendingImages]);

    const removePendingImage = (key) => {
        setPendingImages((prev) => prev.filter((p) => p.key !== key));
    };

    useEffect(() => {
        setForm((f) => {
            if (f.product_type === 'digital' && f.requires_shipping) {
                return { ...f, requires_shipping: false };
            }
            return f;
        });
    }, [form.product_type]);

    const buildPayload = () => {
        const fd = new FormData();
        fd.append('store_id', form.store_id);
        form.category_ids.forEach((id) => fd.append('category_ids[]', id));
        fd.append('name', form.name);
        if (form.slug) fd.append('slug', form.slug);
        fd.append('description', form.description || '');
        fd.append('price', String(form.price));
        if (form.compare_price !== '' && form.compare_price != null) fd.append('compare_price', String(form.compare_price));
        fd.append('manufacturer_id', form.manufacturer_id ? String(form.manufacturer_id) : '');
        fd.append('brand', form.brand || '');
        fd.append('manufacturer', form.manufacturer || '');
        fd.append('material', form.material || '');
        if (form.gender) fd.append('gender', form.gender);
        fd.append('stock', String(form.stock));
        fd.append('product_type', form.product_type);
        fd.append('requires_shipping', form.requires_shipping ? '1' : '0');
        fd.append('model_number', form.model_number || '');
        fd.append('gtin', form.gtin || '');
        fd.append('mpn', form.mpn || '');
        fd.append('origin_country', form.origin_country || '');
        fd.append('meta_title', form.meta_title || '');
        fd.append('meta_description', form.meta_description || '');
        if (form.available_from) fd.append('available_from', form.available_from);
        fd.append('is_active', form.is_active ? '1' : '0');
        fd.append('is_featured', form.is_featured ? '1' : '0');

        const vPayload = variants.map((r) => ({
            id: r.id,
            size: r.size || null,
            color: r.color || null,
            color_hex: r.color_hex || null,
            stock: Number(r.stock) || 0,
            price_adjustment: Number(r.price_adjustment) || 0,
            sku: r.sku || null,
        }));
        fd.append('variants_json', JSON.stringify(vPayload));

        if (pendingImages.length) {
            if (newImagesMode === 'append') {
                pendingImages.forEach((p) => fd.append('gallery[]', p.file));
            } else {
                const primaryKey = primaryPendingKey || pendingImages[0]?.key;
                const primaryEntry = pendingImages.find((p) => p.key === primaryKey) || pendingImages[0];
                if (primaryEntry?.file) fd.append('primary_image', primaryEntry.file);
                pendingImages.forEach((p) => {
                    if (p.key !== primaryEntry?.key) fd.append('gallery[]', p.file);
                });
            }
        }
        [...new Set(removeImageIds.map((x) => Number(x)).filter((id) => Number.isFinite(id) && id > 0))].forEach((id) =>
            fd.append('remove_image_ids[]', String(id)),
        );

        return fd;
    };

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;
        if (!form.category_ids.length) {
            alert('Pick at least one category.');
            setTab('basic');
            return;
        }
        setProcessing(true);
        const fd = buildPayload();
        const url = isEdit ? `/admin/products/${product.id}` : '/admin/products';
        const opts = {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setPendingImages([]);
                setPrimaryPendingKey(null);
                setRemoveImageIds([]);
                if (addImagesInputRef.current) addImagesInputRef.current.value = '';
            },
        };
        if (isEdit) {
            router.patch(url, fd, opts);
        } else {
            router.post(url, fd, opts);
        }
    };

    return (
        <PanelLayout
            title={isEdit ? 'Edit product' : 'Add product'}
            subtitle="Full-page advanced catalog form — same screen for create & update."
        >
            <Head title={isEdit ? 'Edit product — Admin' : 'Add product — Admin'} />

            {Object.keys(pageErrors).length > 0 && (
                <div className="mb-4 rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-900">
                    <p className="mb-2 font-semibold uppercase tracking-wide text-red-800">Please fix validation errors</p>
                    <ul className="list-disc space-y-1 pl-4">
                        {Object.entries(pageErrors).map(([k, v]) => (
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
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-brand-orange"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Back to products
                </Link>
                <button
                    type="submit"
                    form="product-advanced-form"
                    disabled={processing}
                    className="rounded-[3px] bg-zinc-900 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                    {processing ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
                </button>
            </div>

            <form id="product-advanced-form" onSubmit={submit} className="space-y-6">
                {/* Hero summary (zCart-style) */}
                <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start">
                        <div className="shrink-0">
                            <HeroCover blobFile={pendingImages.length ? heroPendingBlob : null} remoteUrl={pendingImages.length ? null : heroRemoteUrl} />
                            <button
                                type="button"
                                onClick={() => setTab('images')}
                                className="mt-2 w-36 rounded-[3px] border border-dashed border-zinc-300 px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-zinc-600 hover:border-brand-orange hover:text-brand-orange"
                            >
                                <i className="fa-solid fa-images mr-1" />
                                Manage images
                            </button>
                        </div>
                        <div className="min-w-0 flex-1 space-y-3">
                            <div>
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Name *</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => fv({ name: e.target.value })}
                                    placeholder="Product title"
                                    className={fieldClass()}
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="text-[10px] font-semibold uppercase text-zinc-500">Slug (optional)</label>
                                    <input
                                        value={form.slug}
                                        onChange={(e) => fv({ slug: e.target.value })}
                                        placeholder="auto from name if empty"
                                        className={fieldClass()}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold uppercase text-zinc-500">Store / vendor *</label>
                                    <select
                                        required
                                        value={form.store_id}
                                        onChange={(e) => fv({ store_id: e.target.value })}
                                        className={fieldClass()}
                                    >
                                        <option value="">Select store</option>
                                        {stores.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs">
                                <div>
                                    <span className="text-zinc-400">Status: </span>
                                    <span className={form.is_active ? 'font-bold text-emerald-600' : 'font-bold text-zinc-500'}>
                                        {form.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                {isEdit && product?.created_at_formatted && (
                                    <div>
                                        <span className="text-zinc-400">Available from: </span>
                                        <span className="font-semibold text-zinc-700">{form.available_from || product.created_at_formatted}</span>
                                    </div>
                                )}
                                {isEdit && product?.updated_at_formatted && (
                                    <div>
                                        <span className="text-zinc-400">Last update: </span>
                                        <span className="font-semibold text-zinc-700">{product.updated_at_formatted}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-700">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => fv({ is_active: e.target.checked })}
                                        className="rounded border-zinc-300 text-brand-orange focus:ring-brand-orange"
                                    />
                                    Active (live)
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-700">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(e) => fv({ is_featured: e.target.checked })}
                                        className="rounded border-zinc-300 text-brand-orange focus:ring-brand-orange"
                                    />
                                    Featured
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="flex flex-wrap gap-6 border-b border-zinc-200">
                    {TABS.map((t) => (
                        <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
                            {t.label}
                        </TabButton>
                    ))}
                </div>

                {tab === 'basic' && (
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Product type *</label>
                                <select
                                    value={form.product_type}
                                    onChange={(e) => fv({ product_type: e.target.value })}
                                    className={fieldClass()}
                                >
                                    <option value="physical">Physical</option>
                                    <option value="digital">Digital</option>
                                    <option value="service">Service</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm font-medium text-zinc-700">
                                    <input
                                        type="checkbox"
                                        disabled={form.product_type === 'digital'}
                                        checked={form.requires_shipping && form.product_type !== 'digital'}
                                        onChange={(e) => fv({ requires_shipping: e.target.checked })}
                                        className="rounded border-zinc-300 text-brand-orange focus:ring-brand-orange"
                                    />
                                    Requires shipping
                                </label>
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">
                                    Catalog manufacturer
                                </label>
                                <select
                                    value={form.manufacturer_id}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        const found = manufacturerOptions.find((x) => String(x.id) === v);
                                        fv({
                                            manufacturer_id: v,
                                            brand: found ? found.name : form.brand,
                                        });
                                    }}
                                    className={fieldClass()}
                                >
                                    <option value="">None — free-text brand</option>
                                    {manufacturerOptions.map((m) => (
                                        <option key={m.id} value={String(m.id)}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-[10px] text-zinc-400">
                                    Picking one syncs the storefront brand with that catalog profile on save.
                                </p>
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Brand</label>
                                <input
                                    value={form.brand}
                                    disabled={Boolean(form.manufacturer_id)}
                                    onChange={(e) => fv({ brand: e.target.value })}
                                    className={fieldClass()}
                                />
                                {form.manufacturer_id ? (
                                    <p className="mt-1 text-[10px] text-zinc-400">Clear the catalog manufacturer to edit this manually.</p>
                                ) : null}
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Manufacturer (text)</label>
                                <input
                                    value={form.manufacturer}
                                    onChange={(e) => fv({ manufacturer: e.target.value })}
                                    className={fieldClass()}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Model number</label>
                                <input
                                    value={form.model_number}
                                    onChange={(e) => fv({ model_number: e.target.value })}
                                    className={fieldClass()}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Origin country</label>
                                <select
                                    value={form.origin_country}
                                    onChange={(e) => fv({ origin_country: e.target.value })}
                                    className={fieldClass()}
                                >
                                    {COUNTRIES.map((c) => (
                                        <option key={c.value || 'x'} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">GTIN / barcode</label>
                                <input value={form.gtin} onChange={(e) => fv({ gtin: e.target.value })} className={fieldClass()} />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">MPN</label>
                                <input value={form.mpn} onChange={(e) => fv({ mpn: e.target.value })} className={fieldClass()} />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Sell from (date)</label>
                                <input
                                    type="date"
                                    value={form.available_from}
                                    onChange={(e) => fv({ available_from: e.target.value })}
                                    className={fieldClass()}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Gender niche</label>
                                <select value={form.gender} onChange={(e) => fv({ gender: e.target.value })} className={fieldClass()}>
                                    <option value="">—</option>
                                    <option value="women">Women</option>
                                    <option value="men">Men</option>
                                    <option value="unisex">Unisex</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6">
                            <CategoryTagPicker
                                categoryOptions={categoryOptions}
                                selectedIds={form.category_ids}
                                onChange={(ids) => setForm((f) => ({ ...f, category_ids: ids }))}
                            />
                        </div>
                    </section>
                )}

                {tab === 'images' && (
                    <section className="space-y-5">
                        <div className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Product images</h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                                Upload multiple files (Laravel saves rows in <code className="rounded bg-zinc-100 px-1 text-xs">product_images</code>).
                                Removing a thumbnail queues it for delete on Save. New uploads can either extend the gallery or replace the storefront cover photo.
                            </p>
                            {isEdit && (product?.images?.length ?? 0) > 0 && (
                                <div className="mt-4 flex flex-wrap gap-4 rounded-[3px] border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            name="admin_new_images_mode"
                                            checked={newImagesMode === 'append'}
                                            onChange={() => setNewImagesMode('append')}
                                            className="text-brand-orange focus:ring-brand-orange"
                                        />
                                        Add photos to gallery only (keep current cover)
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            name="admin_new_images_mode"
                                            checked={newImagesMode === 'replace_cover'}
                                            onChange={() => setNewImagesMode('replace_cover')}
                                            className="text-brand-orange focus:ring-brand-orange"
                                        />
                                        New photo becomes main cover (others go to gallery)
                                    </label>
                                </div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => addImagesInputRef.current?.click()}
                                    className="rounded-[3px] bg-brand-orange px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white hover:opacity-95"
                                >
                                    <i className="fa-solid fa-plus mr-2" /> Add photos
                                </button>
                                <input
                                    ref={addImagesInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => appendPendingImages(e.target.files)}
                                />
                                <span className="text-[11px] text-zinc-500 self-center">
                                    JPG, PNG, WebP, GIF — you can pick many at once or add batches; each thumbnail has delete.
                                </span>
                            </div>
                            {(isEdit && product?.images?.length > 0) || pendingImages.length > 0 ? (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {isEdit &&
                                        (product?.images || []).map((im) => {
                                            const marked = removeIdSet.has(Number(im.id));
                                            return (
                                                <div
                                                    key={im.id}
                                                    className={`relative overflow-hidden rounded-[3px] border bg-zinc-50 ${
                                                        marked ? 'border-rose-400 opacity-55' : 'border-zinc-200'
                                                    }`}
                                                >
                                                    <div className="aspect-square w-full">
                                                        <img
                                                            src={im.url || (im.image?.startsWith('http') ? im.image : `/storage/${im.image}`)}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-1 bg-gradient-to-t from-black/65 to-transparent p-2 pt-8">
                                                        {im.is_primary && (
                                                            <span className="rounded-[3px] bg-white/95 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-800">
                                                                Current cover
                                                            </span>
                                                        )}
                                                        <span className="flex-1" />
                                                        <button
                                                            type="button"
                                                            title={marked ? 'Undo remove' : 'Remove from gallery'}
                                                            onClick={() => toggleRemoveImage(im.id)}
                                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] border text-xs shadow-md ${
                                                                marked
                                                                    ? 'border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-50'
                                                                    : 'border-white/80 bg-black/55 text-white hover:bg-rose-600'
                                                            }`}
                                                        >
                                                            <i className={`fa-solid ${marked ? 'fa-rotate-left' : 'fa-trash'}`} />
                                                        </button>
                                                    </div>
                                                    {marked && (
                                                        <p className="border-t border-rose-100 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-800">
                                                            Will delete on save — tap trash to undo.
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    {pendingImages.map((p) => {
                                        const computedPrimaryKey = primaryPendingKey ?? pendingImages[0]?.key ?? null;
                                        const radioPrimary = newImagesMode === 'replace_cover' && computedPrimaryKey === p.key;
                                        return (
                                            <div key={p.key} className="relative overflow-hidden rounded-[3px] border-2 border-dashed border-zinc-200 bg-white">
                                                <div className="aspect-square w-full">
                                                    <PendingThumb file={p.file} />
                                                </div>
                                                <div className="absolute left-2 top-2 rounded-[3px] bg-brand-orange px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                                                    New
                                                </div>
                                                <button
                                                    type="button"
                                                    title="Remove"
                                                    onClick={() => removePendingImage(p.key)}
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-[3px] border border-white/90 bg-black/55 text-xs text-white shadow hover:bg-rose-600"
                                                >
                                                    <i className="fa-solid fa-trash" />
                                                </button>
                                                {newImagesMode === 'replace_cover' && (
                                                    <label className="flex cursor-pointer items-center gap-2 border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-[11px] font-semibold text-zinc-800">
                                                        <input
                                                            type="radio"
                                                            name="pending_primary_image"
                                                            checked={radioPrimary}
                                                            onChange={() => setPrimaryPendingKey(p.key)}
                                                            className="text-brand-orange focus:ring-brand-orange"
                                                        />
                                                        Main cover on save
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="mt-6 rounded-[3px] border border-dashed border-zinc-200 bg-zinc-50/80 py-12 text-center text-sm text-zinc-500">
                                    No images yet. Use “Add photos” above.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {tab === 'variants' && (
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-4">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Variants / SKUs</h3>
                                <p className="mt-1 text-xs text-zinc-600">
                                    Size, colour, SKU, stock, and price adjustments per row. Rows left empty are ignored on save.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={pushVariantRow}
                                className="rounded-[3px] bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800"
                            >
                                <i className="fa-solid fa-plus mr-2" /> Add variant row
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-xs">
                                <thead className="text-[10px] uppercase text-zinc-400">
                                    <tr>
                                        <th className="py-2 pr-2 font-semibold">Size</th>
                                        <th className="py-2 pr-2 font-semibold">Colour</th>
                                        <th className="py-2 pr-2 font-semibold">Swatch</th>
                                        <th className="py-2 pr-2 font-semibold text-right">Stock</th>
                                        <th className="py-2 pr-2 font-semibold text-right">± Price</th>
                                        <th className="py-2 pr-2 font-semibold">SKU</th>
                                        <th className="py-2 pr-2 font-semibold w-10" aria-label="Remove row" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((row, idx) => (
                                        <tr key={row.id ?? `n-${idx}`} className="border-t border-zinc-100">
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    value={row.size}
                                                    onChange={(e) => updateVariantRow(idx, { size: e.target.value })}
                                                    className={fieldClass()}
                                                    placeholder="e.g. M"
                                                />
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    value={row.color}
                                                    onChange={(e) => updateVariantRow(idx, { color: e.target.value })}
                                                    className={fieldClass()}
                                                    placeholder="Black"
                                                />
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    type="color"
                                                    value={row.color_hex || '#cccccc'}
                                                    onChange={(e) => updateVariantRow(idx, { color_hex: e.target.value })}
                                                    className="h-9 w-14 cursor-pointer rounded border border-zinc-200"
                                                />
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={row.stock}
                                                    onChange={(e) => updateVariantRow(idx, { stock: e.target.value })}
                                                    className={fieldClass()}
                                                />
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.price_adjustment}
                                                    onChange={(e) => updateVariantRow(idx, { price_adjustment: e.target.value })}
                                                    className={fieldClass()}
                                                />
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                <input
                                                    value={row.sku}
                                                    onChange={(e) => updateVariantRow(idx, { sku: e.target.value })}
                                                    className={fieldClass()}
                                                    placeholder="SKU-..."
                                                />
                                            </td>
                                            <td className="py-2 pr-2 text-right align-middle">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariantRow(idx)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-[3px] border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                    title="Remove row"
                                                >
                                                    <i className="fa-solid fa-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-[11px] text-zinc-500">
                            Base catalogue price stays on the <span className="font-semibold">Pricing &amp; stock</span> tab; variant “± Price” adds on top per SKU.
                        </p>
                    </section>
                )}

                {tab === 'description' && (
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                        <label className="mb-2 block text-[10px] font-semibold uppercase text-zinc-500">Full description</label>
                        <textarea
                            rows={14}
                            value={form.description}
                            onChange={(e) => fv({ description: e.target.value })}
                            className={`${fieldClass()} font-mono text-sm leading-relaxed`}
                            placeholder="Rich text HTML is supported on storefront when rendered with {!! !!} …"
                        />
                        <label className="mt-6 mb-2 block text-[10px] font-semibold uppercase text-zinc-500">Material</label>
                        <input value={form.material} onChange={(e) => fv({ material: e.target.value })} className={fieldClass()} />
                    </section>
                )}

                {tab === 'listings' && (
                    <section className="space-y-5">
                        <div className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Base offer</h3>
                            <div className="mt-3 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-zinc-500">Price *</label>
                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => fv({ price: e.target.value })}
                                        className={fieldClass()}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-zinc-500">Compare-at</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={form.compare_price}
                                        onChange={(e) => fv({ compare_price: e.target.value })}
                                        className={fieldClass()}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-semibold text-zinc-500">Base stock *</label>
                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        value={form.stock}
                                        onChange={(e) => fv({ stock: e.target.value })}
                                        className={fieldClass()}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-[3px] border border-dashed border-zinc-200 bg-zinc-50/90 px-4 py-4 text-sm text-zinc-600">
                            <span className="font-semibold text-zinc-800">More listing setup</span> — use{' '}
                            <button type="button" className="text-brand-orange underline" onClick={() => setTab('images')}>
                                Images
                            </button>{' '}
                            for photo gallery (each with delete) and{' '}
                            <button type="button" className="text-brand-orange underline" onClick={() => setTab('variants')}>
                                Variants
                            </button>{' '}
                            for SKU rows.
                        </div>
                    </section>
                )}

                {tab === 'seo' && (
                    <section className="rounded-[3px] border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Meta title</label>
                            <input value={form.meta_title} onChange={(e) => fv({ meta_title: e.target.value })} className={fieldClass()} />
                        </div>
                        <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase text-zinc-500">Meta description</label>
                            <textarea
                                rows={5}
                                value={form.meta_description}
                                onChange={(e) => fv({ meta_description: e.target.value })}
                                className={fieldClass()}
                            />
                        </div>
                    </section>
                )}
            </form>
        </PanelLayout>
    );
}
