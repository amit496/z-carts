import { Head, Link, router } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import AdminTableIconAction from '@/Components/Admin/AdminTableIconAction';
import { useAlert } from '@/hooks/useAlert';
import { useEffect, useMemo, useState } from 'react';

const STATUS_TABS = ['all', 'active', 'inactive', 'featured', 'low_stock', 'trash'];

const SORT_OPTIONS = [
    { value: 'latest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'price_asc', label: 'Price: low → high' },
    { value: 'price_desc', label: 'Price: high → low' },
    { value: 'name_asc', label: 'Name: A → Z' },
    { value: 'name_desc', label: 'Name: Z → A' },
    { value: 'stock_low', label: 'Stock: lowest first' },
];

const SEARCH_IN_OPTIONS = [
    { value: 'all', label: 'All fields' },
    { value: 'name', label: 'Product name' },
    { value: 'brand', label: 'Brand' },
    { value: 'gtin', label: 'GTIN / MPN' },
];

const PRODUCT_TYPE_OPTIONS = [
    { value: '', label: 'All types' },
    { value: 'physical', label: 'Physical' },
    { value: 'digital', label: 'Digital' },
    { value: 'service', label: 'Service' },
];

function resolveTab(filters) {
    const raw = filters?.status;
    if (!raw || !STATUS_TABS.includes(raw)) {
        return 'all';
    }
    return raw;
}

function CategoryPills({ product }) {
    const list = product.categories?.length ? product.categories : product.category ? [product.category] : [];
    if (!list.length) {
        return <span className="text-xs text-zinc-400">—</span>;
    }
    const show = list.slice(0, 2);
    const more = Math.max(0, list.length - show.length);

    return (
        <div className="flex max-w-[200px] flex-wrap items-center gap-1">
            {show.map((c) => (
                <span
                    key={c.id}
                    className="truncate rounded-[3px] border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700"
                    title={c.name}
                >
                    {c.name}
                </span>
            ))}
            {more > 0 && (
                <span className="whitespace-nowrap text-[10px] font-semibold text-brand-orange" title={`${more} additional categories`}>
                    + {more} more
                </span>
            )}
        </div>
    );
}

export default function AdminProducts({
    products,
    stats,
    filters = {},
    filterCategories = [],
    filterStores = [],
    filterManufacturers = [],
}) {
    const activeTab = useMemo(() => resolveTab(filters), [filters.status]);
    const [search, setSearch] = useState(filters.search || '');
    const [searchIn, setSearchIn] = useState(filters.search_in || 'all');
    const [categoryId, setCategoryId] = useState(filters.category != null && filters.category !== '' ? String(filters.category) : '');
    const [storeId, setStoreId] = useState(filters.store != null && filters.store !== '' ? String(filters.store) : '');
    const [productType, setProductType] = useState(filters.product_type || '');
    const [manufacturerId, setManufacturerId] = useState(
        filters.manufacturer != null && filters.manufacturer !== '' ? String(filters.manufacturer) : '',
    );
    const [sort, setSort] = useState(filters.sort || 'latest');
    const { confirm, success } = useAlert();

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);
    useEffect(() => {
        setSearchIn(filters.search_in || 'all');
    }, [filters.search_in]);
    useEffect(() => {
        setCategoryId(filters.category != null && filters.category !== '' ? String(filters.category) : '');
    }, [filters.category]);
    useEffect(() => {
        setStoreId(filters.store != null && filters.store !== '' ? String(filters.store) : '');
    }, [filters.store]);
    useEffect(() => {
        setProductType(filters.product_type || '');
    }, [filters.product_type]);
    useEffect(() => {
        setManufacturerId(filters.manufacturer != null && filters.manufacturer !== '' ? String(filters.manufacturer) : '');
    }, [filters.manufacturer]);
    useEffect(() => {
        setSort(filters.sort || 'latest');
    }, [filters.sort]);

    const tabCounts = useMemo(
        () => ({
            all: stats.total,
            active: stats.active,
            inactive: stats.inactive ?? Math.max(0, stats.total - stats.active),
            featured: stats.featured,
            low_stock: stats.low_stock,
            trash: stats.trashed ?? 0,
        }),
        [stats],
    );

    const tabsConfig = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
        { key: 'featured', label: 'Featured' },
        { key: 'low_stock', label: 'Low stock' },
        { key: 'trash', label: 'Trash' },
    ];

    const tabLabel = (key) => {
        if (key === 'all') return 'All products';
        if (key === 'trash') return 'Trash';
        return String(key).replace('_', ' ');
    };

    const defaultPerPage = 20;

    const applyFilters = (next) => {
        const q = { ...next };
        Object.keys(q).forEach((k) => {
            if (q[k] === '' || q[k] === null || q[k] === undefined) delete q[k];
        });
        router.get('/admin/products', q, { preserveScroll: true, preserveState: true });
    };

    const getFilterSnapshot = () => ({
        search: search.trim(),
        searchIn,
        categoryId,
        storeId,
        manufacturerId,
        productType,
        sort,
    });

    const snapToQuery = (snap, tabKey = activeTab, perPageOverride) => {
        const q = {};
        if (snap.search) q.search = snap.search;
        if (snap.searchIn && snap.searchIn !== 'all') q.search_in = snap.searchIn;
        if (snap.categoryId) q.category = snap.categoryId;
        if (snap.storeId) q.store = snap.storeId;
        if (snap.manufacturerId) q.manufacturer = snap.manufacturerId;
        if (snap.productType) q.product_type = snap.productType;
        if (snap.sort && snap.sort !== 'latest') q.sort = snap.sort;
        q.per_page =
            perPageOverride !== undefined ? perPageOverride : (Number(filters.per_page) || defaultPerPage);
        if (tabKey !== 'all') q.status = tabKey;
        return q;
    };

    const applyFromSnapshot = (snap, tabKey, perPageOverride) => {
        applyFilters(snapToQuery(snap, tabKey, perPageOverride));
    };

    const goTab = (key) => {
        applyFromSnapshot(getFilterSnapshot(), key);
    };

    const runSearch = () => {
        applyFromSnapshot(getFilterSnapshot());
    };

    const clearSearchKeyword = () => {
        setSearch('');
        applyFromSnapshot({ ...getFilterSnapshot(), search: '' });
    };

    const clearAllRefinements = () => {
        setSearch('');
        setSearchIn('all');
        setCategoryId('');
        setStoreId('');
        setManufacturerId('');
        setProductType('');
        setSort('latest');
        const q = { per_page: Number(filters.per_page) || defaultPerPage };
        if (activeTab !== 'all') q.status = activeTab;
        applyFilters(q);
    };

    const setPerPage = (value) => {
        applyFromSnapshot(getFilterSnapshot(), activeTab, value);
    };

    const hasActiveRefinements =
        Boolean(search.trim()) ||
        (searchIn && searchIn !== 'all') ||
        Boolean(categoryId) ||
        Boolean(storeId) ||
        Boolean(manufacturerId) ||
        Boolean(productType) ||
        (sort && sort !== 'latest');

    /** Laravel LengthAwarePaginator is flat (`from`, `to`, `total`, `links`); there is no `meta` wrapper. */
    const from = products.from;
    const to = products.to;
    const total = products.total ?? products.data?.length ?? 0;
    const currentPage = products.current_page ?? 1;
    const lastPage = products.last_page ?? 1;
    const perPage = products.per_page ?? defaultPerPage;

    const emptyHint = () => {
        if (activeTab === 'trash') return 'Trash is empty. Deleted products appear here.';
        if (activeTab === 'inactive') return 'No inactive products. All catalog items are currently active.';
        if (activeTab === 'featured') return 'No featured products yet.';
        if (activeTab === 'low_stock') return 'No low-stock alerts (threshold ≤ 5).';
        if (activeTab === 'active') return 'No active products in this filter.';
        if ((filters.search || '').trim()) return 'No products match your search.';
        if (filters.category || filters.store || filters.manufacturer || filters.product_type)
            return 'No products match these filters. Try clearing category, store, manufacturer, or type.';
        return 'No products in the catalog.';
    };

    const toggleActive = (p) => {
        const action = p.is_active ? 'deactivate' : 'activate';
        confirm(
            `${action.charAt(0).toUpperCase() + action.slice(1)} "${p.name}"?`,
            () =>
                router.patch(`/admin/products/${p.id}/active`, {}, {
                    preserveScroll: true,
                    only: ['products', 'stats', 'filters'],
                    onSuccess: () => success(`Product ${action}d!`),
                }),
            { title: `${action.charAt(0).toUpperCase() + action.slice(1)} Product?`, confirmText: 'Yes', icon: 'question' },
        );
    };

    const toggleFeatured = (p) => {
        const action = p.is_featured ? 'unfeature' : 'feature';
        confirm(
            `${action.charAt(0).toUpperCase() + action.slice(1)} "${p.name}"?`,
            () =>
                router.patch(`/admin/products/${p.id}/featured`, {}, {
                    preserveScroll: true,
                    only: ['products', 'stats', 'filters'],
                    onSuccess: () => success(`Product ${action}d!`),
                }),
            { title: 'Update Featured?', confirmText: 'Yes', icon: 'question' },
        );
    };

    const deleteProduct = (p) => {
        confirm(
            `Move "${p.name}" to trash? You can restore it from the Trash tab or erase it permanently later.`,
            () =>
                router.delete(`/admin/products/${p.id}`, {
                    preserveScroll: true,
                    only: ['products', 'stats', 'filters'],
                    onSuccess: () => success('Moved to trash.'),
                }),
            { title: 'Move to trash?', confirmText: 'Move to trash', icon: 'question' },
        );
    };

    const restoreProduct = (p) => {
        confirm(
            `Restore "${p.name}" back to the live catalog?`,
            () =>
                router.post(`/admin/products/${p.id}/restore`, {}, {
                    preserveScroll: true,
                    only: ['products', 'stats', 'filters'],
                    onSuccess: () => success('Product restored.'),
                }),
            { title: 'Restore product?', confirmText: 'Restore', icon: 'question' },
        );
    };

    const eraseProductPermanent = (p) => {
        confirm(
            `Erase "${p.name}" forever? Stored images will be deleted. This cannot be undone. (Blocked if product is referenced by orders.)`,
            () =>
                router.delete(`/admin/products/${p.id}/force`, {
                    preserveScroll: true,
                    only: ['products', 'stats', 'filters'],
                    onSuccess: () => success('Removed permanently.'),
                }),
            { title: 'Erase forever?', confirmText: 'Yes, erase', icon: 'error' },
        );
    };

    return (
        <PanelLayout title="Products" subtitle="Catalog listing — filters match the URL (?status=) so bookmarks and inactive views stay in sync.">
            <Head title="Products — Admin" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard label="Total" value={stats.total} icon="fa-boxes-stacked" accent="text-blue-500" tone="text-zinc-900" />
                <StatCard label="Active" value={stats.active} icon="fa-circle-check" accent="text-green-600" tone="text-zinc-900" />
                <StatCard label="Featured" value={stats.featured} icon="fa-star" accent="text-violet-500" tone="text-zinc-900" />
                <StatCard label="Low stock" value={stats.low_stock} icon="fa-triangle-exclamation" accent="text-amber-500" tone="text-zinc-900" />
                <StatCard label="Trash" value={tabCounts.trash} icon="fa-trash-can" accent="text-rose-500" tone="text-zinc-900" />
            </div>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader
                    title="Products"
                    subtitle={`Inactive: ${tabCounts.inactive} · In trash: ${tabCounts.trash}. Delete moves items to Trash; erase removes them for good.`}
                    actions={
                        <Link
                            href="/admin/products/create"
                            className="rounded-[3px] bg-brand-orange px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm hover:opacity-95"
                        >
                            <i className="fa-solid fa-plus mr-1.5" />
                            Add product
                        </Link>
                    }
                />

                {/* Status tabs — underline follows server `filters.status` */}
                <div className="-mx-px mb-4 flex flex-wrap gap-1 border-b border-zinc-200">
                    {tabsConfig.map((t) => {
                        const isOn = activeTab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => goTab(t.key)}
                                className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
                                    isOn
                                        ? 'border-brand-orange text-brand-orange'
                                        : 'border-transparent text-zinc-500 hover:text-zinc-800'
                                }`}
                            >
                                {t.label}
                                <span
                                    className={`rounded-[3px] px-2 py-0.5 text-[10px] font-black ${
                                        isOn ? 'bg-brand-orange text-white' : 'bg-zinc-100 text-zinc-500'
                                    }`}
                                >
                                    {tabCounts[t.key]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <form
                    className="mb-4 space-y-3 rounded-[3px] border border-zinc-100 bg-zinc-50/80 p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        runSearch();
                    }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Search &amp; refine</p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            Tab:{' '}
                            <span className="font-semibold text-zinc-600">
                                {tabLabel(activeTab)}
                            </span>
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                        <label className="flex flex-col gap-1 lg:col-span-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Keywords</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Name, brand, codes…"
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            />
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Search in</span>
                            <select
                                value={searchIn}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSearchIn(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), searchIn: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                {SEARCH_IN_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Category</span>
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCategoryId(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), categoryId: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                <option value="">All categories</option>
                                {filterCategories.map((c) => (
                                    <option key={c.id} value={String(c.id)}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Store</span>
                            <select
                                value={storeId}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setStoreId(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), storeId: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                <option value="">All stores</option>
                                {filterStores.map((s) => (
                                    <option key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Manufacturer</span>
                            <select
                                value={manufacturerId}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setManufacturerId(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), manufacturerId: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                <option value="">All manufacturers</option>
                                {filterManufacturers.map((m) => (
                                    <option key={m.id} value={String(m.id)}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Product type</span>
                            <select
                                value={productType}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setProductType(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), productType: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                {PRODUCT_TYPE_OPTIONS.map((o) => (
                                    <option key={o.value || 'all'} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 lg:col-span-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Sort by</span>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSort(v);
                                    applyFromSnapshot({ ...getFilterSnapshot(), sort: v });
                                }}
                                className="w-full rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <p className="text-[11px] text-zinc-500">
                        Category, store, manufacturer, type, sort, and &ldquo;search in&rdquo; update the list immediately. Enter keywords above,
                        then{' '}
                        <span className="font-semibold text-zinc-600">Apply filters</span> or press Enter.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                            type="submit"
                            className="rounded-[3px] bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                        >
                            <i className="fa-solid fa-filter mr-2 text-xs opacity-90" />
                            Apply filters
                        </button>
                        {search.trim() !== '' && (
                            <button
                                type="button"
                                onClick={clearSearchKeyword}
                                className="rounded-[3px] border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Clear keywords
                            </button>
                        )}
                        {hasActiveRefinements && (
                            <button
                                type="button"
                                onClick={clearAllRefinements}
                                className="rounded-[3px] border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                                Reset all filters
                            </button>
                        )}
                        <span className="ml-auto hidden max-w-md text-right text-[10px] text-zinc-500 sm:block">
                            {activeTab === 'trash' ? (
                                <span className="text-rose-600">Showing deleted products · restore or erase permanently</span>
                            ) : (
                                <>
                                    {filters.search ? (
                                        <>
                                            Matching “<span className="font-semibold text-brand-orange">{filters.search}</span>”
                                            {filters.search_in && filters.search_in !== 'all' && (
                                                <span className="text-zinc-400">
                                                    {' '}
                                                    in {SEARCH_IN_OPTIONS.find((o) => o.value === filters.search_in)?.label ?? filters.search_in}
                                                </span>
                                            )}
                                            <br />
                                        </>
                                    ) : null}
                                    {filters.category ? (
                                        <>
                                            {filterCategories.find((c) => String(c.id) === String(filters.category))?.label ??
                                                `Category #${filters.category}`}
                                            <br />
                                        </>
                                    ) : null}
                                    {filters.store ? (
                                        <>
                                            {filterStores.find((s) => String(s.id) === String(filters.store))?.name ??
                                                `Store #${filters.store}`}
                                            <br />
                                        </>
                                    ) : null}
                                    {filters.manufacturer ? (
                                        <>
                                            {filterManufacturers.find((x) => String(x.id) === String(filters.manufacturer))?.name ??
                                                `Manufacturer #${filters.manufacturer}`}
                                            <br />
                                        </>
                                    ) : null}
                                    {filters.product_type ? <>Type: {filters.product_type}</> : null}
                                </>
                            )}
                        </span>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-[3px] border border-zinc-100">
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="py-3 pl-4 pr-3 font-semibold">Product</th>
                                <th className="py-3 pr-3 font-semibold">Store</th>
                                <th className="py-3 pr-3 font-semibold">Categories</th>
                                <th className="py-3 pr-3 font-semibold">Variants</th>
                                <th className="py-3 pr-3 font-semibold">Price</th>
                                <th className="py-3 pr-3 font-semibold">Stock</th>
                                <th className="py-3 pr-3 font-semibold">Status</th>
                                <th className="py-3 pr-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {products.data.map((p) => {
                                const img = p.images?.[0]?.image;
                                const imgSrc = img
                                    ? img.startsWith('http')
                                        ? img
                                        : `/storage/${img}`
                                    : `https://picsum.photos/seed/${p.id}/80/80`;

                                const variantCount = p.variants_count ?? p.variants?.length ?? 0;
                                const gtinLine = [p.gtin, p.mpn].filter(Boolean);

                                return (
                                    <tr
                                        key={p.id}
                                        className={`transition hover:bg-orange-50/30 ${activeTab === 'trash' ? 'bg-zinc-50/30' : ''}`}
                                    >
                                        <td className="py-3 pl-4 pr-3 align-middle">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={imgSrc}
                                                    alt=""
                                                    className="h-11 w-11 shrink-0 rounded-[3px] border border-zinc-100 object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="max-w-[200px] truncate font-semibold text-zinc-900">{p.name}</p>
                                                    <p className="text-[11px] text-zinc-500">{p.product_type === 'digital' ? 'Digital' : p.product_type === 'service' ? 'Service' : 'Physical'}</p>
                                                    {gtinLine.length > 0 ? (
                                                        <p className="max-w-[200px] truncate font-mono text-[10px] text-zinc-400" title={gtinLine.join(' · ')}>
                                                            {gtinLine.join(' · ')}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-3 align-middle">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold uppercase text-zinc-600"
                                                    title={p.store?.user?.name || p.store?.name || ''}
                                                >
                                                    {(p.store?.user?.name || p.store?.name || '?')[0]}
                                                </span>
                                                <span className="max-w-[120px] truncate text-xs font-medium text-zinc-700">{p.store?.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-3 align-middle">
                                            <CategoryPills product={p} />
                                        </td>
                                        <td className="py-3 pr-3 align-middle">
                                            <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-700">{variantCount}</span>
                                        </td>
                                        <td className="py-3 pr-3 align-middle font-bold tabular-nums text-zinc-900">${Number(p.price).toFixed(2)}</td>
                                        <td className="py-3 pr-3 align-middle tabular-nums">
                                            <span className={`text-xs font-semibold ${p.stock <= 5 ? 'text-red-600' : 'text-zinc-600'}`}>{p.stock}</span>
                                        </td>
                                        <td className="py-3 pr-3 align-middle">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                                        p.is_active
                                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                                            : 'bg-red-50 text-red-700 ring-1 ring-red-300'
                                                    }`}
                                                >
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                {p.is_featured && (
                                                    <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 ring-1 ring-violet-100">
                                                        Featured
                                                    </span>
                                                )}
                                                {activeTab === 'trash' && (
                                                    <span className="inline-flex rounded-full bg-zinc-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-700 ring-1 ring-zinc-300">
                                                        In trash
                                                    </span>
                                                )}
                                            </div>
                                            {activeTab === 'trash' && p.deleted_at && (
                                                <p className="mt-1 text-[10px] font-medium normal-case tracking-normal text-zinc-500">
                                                    Deleted {new Date(p.deleted_at).toLocaleString()}
                                                </p>
                                            )}
                                        </td>
                                        <td className="relative py-3 pr-4 align-middle">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <AdminTableIconAction
                                                    as={Link}
                                                    href={`/admin/products/${p.id}`}
                                                    variant="view"
                                                    label="View product details"
                                                >
                                                    <i className="fa-regular fa-eye text-sm" />
                                                </AdminTableIconAction>
                                                {activeTab === 'trash' ? (
                                                    <>
                                                        <AdminTableIconAction
                                                            variant="restore"
                                                            label="Restore to catalog"
                                                            onClick={() => restoreProduct(p)}
                                                        >
                                                            <i className="fa-solid fa-rotate-left text-sm" />
                                                        </AdminTableIconAction>
                                                        <AdminTableIconAction
                                                            variant="danger"
                                                            label="Erase permanently"
                                                            onClick={() => eraseProductPermanent(p)}
                                                        >
                                                            <i className="fa-solid fa-eraser text-sm" />
                                                        </AdminTableIconAction>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AdminTableIconAction as={Link} href={`/admin/products/${p.id}/edit`} variant="edit" label="Edit product">
                                                            <i className="fa-solid fa-pen text-sm" />
                                                        </AdminTableIconAction>
                                                        <AdminTableIconAction
                                                            variant={p.is_active ? 'toggleOn' : 'toggleOff'}
                                                            label={p.is_active ? 'Deactivate listing' : 'Activate listing'}
                                                            onClick={() => toggleActive(p)}
                                                        >
                                                            <i className={`fa-solid text-sm ${p.is_active ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                                        </AdminTableIconAction>
                                                        <AdminTableIconAction
                                                            variant="featured"
                                                            label={p.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                                            onClick={() => toggleFeatured(p)}
                                                        >
                                                            <i className="fa-solid fa-star text-sm" />
                                                        </AdminTableIconAction>
                                                        <AdminTableIconAction variant="danger" label="Move to trash" onClick={() => deleteProduct(p)}>
                                                            <i className="fa-solid fa-trash text-sm" />
                                                        </AdminTableIconAction>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {products.data.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-14 text-center text-zinc-400">
                        <i className="fa-solid fa-box-open text-4xl opacity-40" />
                        <p className="max-w-sm text-sm text-zinc-500">{emptyHint()}</p>
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        {total > 0 ? (
                            <>
                                <span>
                                    Showing <span className="font-semibold text-zinc-800">{from ?? '–'}</span>–
                                    <span className="font-semibold text-zinc-800">{to ?? '–'}</span> of{' '}
                                    <span className="font-semibold text-zinc-800">{total}</span> products
                                    {activeTab !== 'all' && <span className="text-zinc-400"> ({activeTab})</span>}
                                </span>
                                <span className="hidden sm:inline rounded-[3px] border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                                    Page {currentPage} / {lastPage}
                                </span>
                                <label className="inline-flex items-center gap-1.5 rounded-[3px] border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                                    <span className="text-zinc-400">Rows</span>
                                    <select
                                        value={String(perPage)}
                                        onChange={(e) => setPerPage(Number(e.target.value))}
                                        className="max-w-[4.5rem] cursor-pointer border-0 bg-transparent py-0 pl-0 pr-6 text-[10px] font-bold text-zinc-800 outline-none focus:ring-0"
                                        aria-label="Products per page"
                                    >
                                        {[10, 15, 20, 50, 100].map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </>
                        ) : (
                            <span>0 products {activeTab !== 'all' && <span className="text-zinc-400">({activeTab})</span>}</span>
                        )}
                    </div>
                    {total > 0 && Array.isArray(products.links) && products.links.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1" role="navigation" aria-label="Product list pagination">
                            {products.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                            only: ['products', 'stats', 'filters'],
                                        })
                                    }
                                    className={`min-h-8 min-w-8 rounded-[3px] border px-2.5 py-1 text-xs font-semibold transition ${
                                        link.active ? 'border-brand-orange bg-brand-orange text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                                    } ${!link.url ? 'pointer-events-none cursor-not-allowed opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PanelLayout>
    );
}
