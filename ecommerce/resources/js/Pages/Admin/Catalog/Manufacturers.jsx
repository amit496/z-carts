import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import StatCard from '@/Components/Admin/StatCard';
import SectionHeader from '@/Components/Admin/SectionHeader';
import AdminTableIconAction from '@/Components/Admin/AdminTableIconAction';
import { useAlert } from '@/hooks/useAlert';

const STATUS_TABS = ['all', 'active', 'inactive', 'trash'];
const SORT_OPTIONS = [
    { value: 'name', label: 'Name A–Z' },
    { value: 'recent', label: 'Recently added' },
];

function resolveTab(filters) {
    const raw = filters?.status;
    return STATUS_TABS.includes(raw) ? raw : 'all';
}

export default function AdminManufacturers({ manufacturers, stats, filters = {} }) {
    const activeTab = useMemo(() => resolveTab(filters), [filters.status]);
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || 'name');
    const { confirm, success } = useAlert();

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);
    useEffect(() => {
        setSort(filters.sort || 'name');
    }, [filters.sort]);

    const defaultPerPage = 15;

    const tabCounts = useMemo(
        () => ({
            all: stats.total,
            active: stats.active,
            inactive: stats.inactive,
            trash: stats.trashed ?? 0,
        }),
        [stats],
    );

    const tabsConfig = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
        { key: 'trash', label: 'Trash' },
    ];

    const applyFilters = (next) => {
        const q = { ...next };
        Object.keys(q).forEach((k) => {
            if (q[k] === '' || q[k] === null || q[k] === undefined) delete q[k];
        });
        router.get('/admin/catalog/manufacturers', q, {
            preserveScroll: true,
            preserveState: true,
            only: ['manufacturers', 'stats', 'filters'],
        });
    };

    const snapToQuery = (tabKey = activeTab, perPageOverride) => {
        const q = {};
        if (search.trim()) q.search = search.trim();
        if (sort && sort !== 'name') q.sort = sort;
        q.per_page = perPageOverride !== undefined ? perPageOverride : (Number(filters.per_page) || defaultPerPage);
        if (tabKey !== 'all') q.status = tabKey;
        return q;
    };

    const goTab = (key) => {
        applyFilters(snapToQuery(key));
    };

    const runSearch = () => applyFilters(snapToQuery());

    const setPerPage = (value) => {
        applyFilters(snapToQuery(activeTab, value));
    };

    /** Laravel LengthAwarePaginator: flat `from`, `to`, `total`, `links`. */
    const from = manufacturers.from;
    const to = manufacturers.to;
    const total = manufacturers.total ?? manufacturers.data?.length ?? 0;
    const currentPage = manufacturers.current_page ?? 1;
    const lastPage = manufacturers.last_page ?? 1;
    const perPage = manufacturers.per_page ?? defaultPerPage;

    const trashDelete = (m) =>
        router.delete(`/admin/catalog/manufacturers/${m.id}`, {
            preserveScroll: true,
            only: ['manufacturers', 'stats', 'filters'],
            onSuccess: () => success('Moved to trash.'),
        });

    const restoreManufacturer = (m) =>
        router.post(
            `/admin/catalog/manufacturers/${m.id}/restore`,
            {},
            {
                preserveScroll: true,
                only: ['manufacturers', 'stats', 'filters'],
                onSuccess: () => success('Manufacturer restored.'),
            },
        );

    const eraseManufacturer = (m) =>
        router.delete(`/admin/catalog/manufacturers/${m.id}/force`, {
            preserveScroll: true,
            only: ['manufacturers', 'stats', 'filters'],
            onSuccess: () => success('Manufacturer deleted permanently.'),
        });

    const toggleManufacturerActive = (m) =>
        router.patch(
            `/admin/catalog/manufacturers/${m.id}/active`,
            {},
            {
                preserveScroll: true,
                only: ['manufacturers', 'stats', 'filters'],
                onSuccess: () => success(m.is_active ? 'Manufacturer deactivated.' : 'Manufacturer activated.'),
            },
        );

    const emptyHint = () => {
        if (activeTab === 'trash') return 'Trash is empty.';
        if (activeTab === 'active') return 'No active manufacturers.';
        if (activeTab === 'inactive') return 'No inactive manufacturers.';
        if ((filters.search || '').trim()) return 'No manufacturers match your search.';
        return 'No manufacturers yet. Create one from the catalog menu.';
    };

    const isTrash = activeTab === 'trash';

    return (
        <PanelLayout title="Manufacturers" subtitle="Brand profiles linked to catalog products.">
            <Head title="Manufacturers — Admin" />

            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div />
                <Link
                    href="/admin/catalog/manufacturers/create"
                    className="rounded-[3px] bg-brand-orange px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white shadow-sm hover:opacity-95"
                >
                    Add manufacturer
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Total" value={stats.total ?? 0} icon="fa-industry" />
                <StatCard label="Active" value={stats.active ?? 0} icon="fa-circle-check" />
                <StatCard label="Inactive" value={stats.inactive ?? 0} icon="fa-ban" />
                <StatCard label="In trash" value={stats.trashed ?? 0} icon="fa-trash" />
                <StatCard label="Linked products" value={stats.products ?? 0} icon="fa-tags" />
            </div>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Manufacturer list" subtitle="Manage brands, logos, and storefront links." />

                <div className="mb-4 flex flex-wrap gap-2 border-b border-zinc-100 pb-4">
                    {tabsConfig.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => goTab(t.key)}
                            className={`rounded-[3px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition ${
                                activeTab === t.key ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            {t.label}
                            <span
                                className={`ml-2 inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 py-0.5 text-[9px] ${
                                    activeTab === t.key ? 'bg-brand-orange text-white' : 'bg-zinc-100 text-zinc-600'
                                }`}
                            >
                                {tabCounts[t.key] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mb-4 flex flex-wrap items-end gap-3">
                    <div className="flex flex-wrap gap-2">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                            placeholder="Search name, email, phone…"
                            className="rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange w-full min-w-[12rem] sm:w-52"
                        />
                        <button
                            type="button"
                            onClick={runSearch}
                            className="rounded-[3px] bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
                        >
                            Search
                        </button>
                        {search ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    const q = {};
                                    if (sort && sort !== 'name') q.sort = sort;
                                    q.per_page = Number(filters.per_page) || defaultPerPage;
                                    if (activeTab !== 'all') q.status = activeTab;
                                    applyFilters(q);
                                }}
                                className="rounded-[3px] border border-zinc-200 px-4 py-2 text-sm text-zinc-600"
                            >
                                Clear
                            </button>
                        ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Sort</label>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                applyFilters({
                                    ...snapToQuery(undefined, Number(filters.per_page) || defaultPerPage),
                                    sort: e.target.value,
                                });
                            }}
                            className="rounded-[3px] border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-brand-orange"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                            <tr>
                                <th className="py-2 pr-3">Image</th>
                                <th className="py-2 pr-3">Name</th>
                                <th className="py-2 pr-3">Phone</th>
                                <th className="py-2 pr-3">Email</th>
                                <th className="py-2 pr-3">Country</th>
                                <th className="py-2 pr-3">Products</th>
                                {!isTrash && <th className="py-2 pr-3">Status</th>}
                                <th className="py-2 pr-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manufacturers.data.map((m) => (
                                <tr key={m.id} className="border-t border-zinc-100">
                                    <td className="py-2 pr-3">
                                        <div className="h-10 w-10 overflow-hidden rounded-[3px] border border-zinc-100 bg-zinc-50">
                                            {m.logo_url ? (
                                                <img src={m.logo_url} alt="" className="h-full w-full object-contain object-center p-0.5" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-zinc-300">
                                                    <i className="fa-regular fa-image" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-2 pr-3 font-semibold text-zinc-900">{m.name}</td>
                                    <td className="py-2 pr-3 text-zinc-600">{m.phone || '—'}</td>
                                    <td className="py-2 pr-3 text-zinc-600">{m.email || '—'}</td>
                                    <td className="py-2 pr-3 text-zinc-600">{m.country || '—'}</td>
                                    <td className="py-2 pr-3 font-medium text-zinc-800">
                                        {(m.products_count ?? 0) > 0 ? (
                                            <Link
                                                href={`/admin/products?manufacturer=${m.id}`}
                                                className="font-semibold text-brand-orange hover:underline"
                                            >
                                                {m.products_count}
                                            </Link>
                                        ) : (
                                            <span className="text-zinc-400">0</span>
                                        )}
                                    </td>
                                    {!isTrash && (
                                        <td className="py-2 pr-3">
                                            <span
                                                className={`inline-flex rounded-[3px] px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    m.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                                                }`}
                                            >
                                                {m.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="py-2 pr-3">
                                        <div className="flex justify-end gap-1">
                                            {!isTrash ? (
                                                <>
                                                    <AdminTableIconAction
                                                        as={Link}
                                                        href={`/admin/catalog/manufacturers/${m.id}`}
                                                        variant="view"
                                                        label="View manufacturer"
                                                    >
                                                        <i className="fa-regular fa-eye text-sm" />
                                                    </AdminTableIconAction>
                                                    <AdminTableIconAction
                                                        as={Link}
                                                        href={`/admin/catalog/manufacturers/${m.id}/edit`}
                                                        variant="edit"
                                                        label="Edit manufacturer"
                                                    >
                                                        <i className="fa-solid fa-pen text-sm" />
                                                    </AdminTableIconAction>
                                                    <AdminTableIconAction
                                                        variant={m.is_active ? 'toggleOn' : 'toggleOff'}
                                                        label={m.is_active ? 'Deactivate manufacturer' : 'Activate manufacturer'}
                                                        onClick={() => toggleManufacturerActive(m)}
                                                    >
                                                        <i
                                                            className={`fa-solid text-sm ${m.is_active ? 'fa-toggle-on' : 'fa-toggle-off'}`}
                                                        />
                                                    </AdminTableIconAction>
                                                    <AdminTableIconAction
                                                        variant="danger"
                                                        label="Move to trash"
                                                        onClick={() =>
                                                            confirm(`Move "${m.name}" to trash?`, () => trashDelete(m), {
                                                                title: 'Move to trash?',
                                                                confirmText: 'Yes',
                                                                icon: 'question',
                                                            })
                                                        }
                                                    >
                                                        <i className="fa-solid fa-trash text-sm" />
                                                    </AdminTableIconAction>
                                                </>
                                            ) : (
                                                <>
                                                    <AdminTableIconAction
                                                        variant="restore"
                                                        label="Restore manufacturer"
                                                        onClick={() =>
                                                            confirm(`Restore "${m.name}"?`, () => restoreManufacturer(m), {
                                                                title: 'Restore manufacturer?',
                                                                confirmText: 'Restore',
                                                                icon: 'question',
                                                            })
                                                        }
                                                    >
                                                        <i className="fa-solid fa-rotate-left text-sm" />
                                                    </AdminTableIconAction>
                                                    <AdminTableIconAction
                                                        variant="danger"
                                                        label="Erase permanently"
                                                        onClick={() =>
                                                            confirm(
                                                                `Permanently delete "${m.name}"? Linked products will be unlinked from this brand.`,
                                                                () => eraseManufacturer(m),
                                                                { title: 'Erase permanently?', confirmText: 'Erase', icon: 'warning' },
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-eraser text-sm" />
                                                    </AdminTableIconAction>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {manufacturers.data.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-14 text-center text-sm text-zinc-400">{emptyHint()}</div>
                    )}
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        {total > 0 ? (
                            <>
                                <span>
                                    Showing <span className="font-semibold text-zinc-800">{from ?? '–'}</span>–
                                    <span className="font-semibold text-zinc-800">{to ?? '–'}</span> of{' '}
                                    <span className="font-semibold text-zinc-800">{total}</span>
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
                                        aria-label="Rows per page"
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
                            <span>0 entries</span>
                        )}
                    </div>
                    {total > 0 && Array.isArray(manufacturers.links) && manufacturers.links.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1" role="navigation" aria-label="Pagination">
                            {manufacturers.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                            only: ['manufacturers', 'stats', 'filters'],
                                        })
                                    }
                                    className={`min-h-8 min-w-8 rounded-[3px] border px-2.5 py-1 text-xs font-semibold transition ${
                                        link.active
                                            ? 'border-brand-orange bg-brand-orange text-white'
                                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
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
