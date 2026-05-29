import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useEffect, useRef, useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import Modal from '@/Components/Admin/Modal';

function resolveMedia(img) {
    if (!img) return null;
    return img.startsWith('http') ? img : `/storage/${img}`;
}

function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

/** Sub-group picker (Group › Sub-group) — searchable like zCart. */
function SearchableSubGroupSelect({ subGroups, value, onChange, error }) {
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

    const labelOf = (sg) => `${sg.parent?.name || ''} › ${sg.name}`;
    const term = search.trim().toLowerCase();
    const filtered = term
        ? subGroups.filter((sg) =>
              labelOf(sg).toLowerCase().includes(term) ||
              String(sg.name).toLowerCase().includes(term))
        : subGroups;
    const selected = subGroups.find((sg) => String(sg.id) === String(value));

    return (
        <div className="relative" ref={wrapRef}>
            <button
                type="button"
                onClick={() => {
                    setOpen((o) => {
                        if (!o) setSearch('');
                        return !o;
                    });
                }}
                className={`flex w-full items-center justify-between border px-3 py-2 text-left text-sm outline-none transition focus:border-brand-orange ${error ? 'border-red-300' : 'border-zinc-200'} ${!value ? 'text-zinc-400' : 'text-zinc-800'}`}
            >
                <span className="truncate">{selected ? labelOf(selected) : 'Select sub-group'}</span>
                <i className={`fa-solid fa-chevron-down text-xs text-zinc-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-[60] mt-1 max-h-64 w-full overflow-hidden border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 p-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sub-groups…"
                            autoFocus
                            className="w-full border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-50"
                            >
                                Select sub-group
                            </button>
                        </li>
                        {filtered.length === 0 && <li className="px-3 py-2 text-xs text-zinc-400">No matches</li>}
                        {filtered.map((sg) => (
                            <li key={sg.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(String(sg.id));
                                        setOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                                        String(sg.id) === String(value) ? 'bg-orange-50 font-semibold text-brand-orange' : 'text-zinc-700'
                                    }`}
                                >
                                    {labelOf(sg)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function CatalogCategoryModal({ category, subGroups, show, onClose }) {
    const isEdit = !!category;
    const [parentMissing, setParentMissing] = useState(false);
    const { data, setData, errors, reset } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        parent_id: category?.parent_id != null ? String(category.parent_id) : '',
        order: category?.order ?? 100,
        active: category?.active ?? true,
        is_featured: category?.is_featured ?? false,
        description: category?.description || '',
        meta_title: category?.meta_title || '',
        meta_description: category?.meta_description || '',
        cover_image: null,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (!data.parent_id) {
            setParentMissing(true);
            return;
        }
        setParentMissing(false);
        const url = isEdit ? `/admin/categories/items/${category.id}` : '/admin/categories/items';
        const payload = isEdit ? { ...data, _method: 'PATCH' } : data;
        router.post(url, payload, {
            forceFormData: true,
            onSuccess: () => {
                if (!isEdit) reset();
                onClose();
            },
        });
    };

    const parentChain = category?.parent
        ? `${category.parent.parent?.name || ''} › ${category.parent.name}`.replace(/^\s*›\s*/, '')
        : null;

    return (
        <Modal show={show} onClose={onClose} title={isEdit ? 'Edit category' : 'Add category'} maxWidth="max-w-3xl">
            <form onSubmit={submit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Category name *</label>
                        <input
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                if (!isEdit) setData('slug', slugify(e.target.value));
                            }}
                            placeholder="Category name"
                            required
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Sub-group *</label>
                        <SearchableSubGroupSelect
                            subGroups={subGroups}
                            value={data.parent_id}
                            onChange={(id) => {
                                setData('parent_id', id);
                                setParentMissing(false);
                            }}
                            error={!!errors.parent_id || parentMissing}
                        />
                        {(errors.parent_id || parentMissing) && (
                            <p className="mt-1 text-xs text-red-500">{errors.parent_id || 'Please select a sub-group.'}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Slug *</label>
                        <input
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="SEO friendly URL"
                            required
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        />
                        {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Status *</label>
                        <select
                            value={data.active ? '1' : '0'}
                            onChange={(e) => setData('active', e.target.value === '1')}
                            required
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Order</label>
                        <input
                            type="number"
                            value={data.order}
                            onChange={(e) => setData('order', e.target.value)}
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                        <input
                            type="checkbox"
                            checked={!!data.is_featured}
                            onChange={(e) => setData('is_featured', e.target.checked)}
                            className="border-zinc-300 text-brand-orange focus:ring-brand-orange"
                        />
                        Featured (shows badge)
                    </label>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={2}
                        placeholder="Short explanation"
                        className="w-full resize-none border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Cover image</label>
                        {isEdit && category?.cover_image && !data.cover_image ? (
                            <div className="mb-2">
                                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">Current</p>
                                <img
                                    src={resolveMedia(category.cover_image)}
                                    alt=""
                                    className="max-h-28 w-full border border-zinc-200 object-cover object-center"
                                />
                            </div>
                        ) : null}
                        <label className="flex h-24 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-brand-orange">
                            {data.cover_image ? (
                                <span className="truncate px-2 text-center text-xs font-medium text-green-600">{data.cover_image.name}</span>
                            ) : (
                                <>
                                    <i className="fa-solid fa-upload mb-1 text-lg text-zinc-300" />
                                    <span className="text-[10px] text-zinc-400">
                                        {isEdit && category?.cover_image ? 'Replace • ' : ''}1280×300px recommended
                                    </span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                            />
                        </label>
                        {errors.cover_image && <p className="mt-1 text-xs text-red-500">{errors.cover_image}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Featured image</label>
                        {isEdit && category?.image && !data.image ? (
                            <div className="mb-2">
                                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">Current</p>
                                <img
                                    src={resolveMedia(category.image)}
                                    alt=""
                                    className="max-h-28 w-full border border-zinc-200 object-cover object-center"
                                />
                            </div>
                        ) : null}
                        <label className="flex h-24 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-brand-orange">
                            {data.image ? (
                                <span className="truncate px-2 text-center text-xs font-medium text-green-600">{data.image.name}</span>
                            ) : (
                                <>
                                    <i className="fa-solid fa-upload mb-1 text-lg text-zinc-300" />
                                    <span className="text-[10px] text-zinc-400">
                                        {isEdit && category?.image ? 'Replace • ' : ''}285×190px recommended
                                    </span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            />
                        </label>
                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Meta title</label>
                        <input
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            placeholder="Meta title"
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-zinc-600">Meta description</label>
                        <textarea
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            rows={2}
                            placeholder="Meta description"
                            className="w-full resize-none border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                </div>
                {parentChain && isEdit && (
                    <p className="border-t border-zinc-100 pt-2 text-[11px] text-zinc-400">
                        Hierarchy: <span className="text-zinc-600">{parentChain}</span>
                    </p>
                )}
                <div className="flex justify-end gap-2 border-t pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="bg-brand-orange px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default function AdminCategoriesIndex({ categories, subGroups, stats, catalogStats, filters }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [createKey, setCreateKey] = useState(0);
    const [search, setSearch] = useState(filters?.search ?? '');
    const skipSearchEffect = useRef(true);
    const { confirm, success } = useAlert();

    useEffect(() => {
        const t = setTimeout(() => {
            if (skipSearchEffect.current) {
                skipSearchEffect.current = false;
                return;
            }
            router.get(
                route('admin.categories.index'),
                { search: search.trim() || undefined },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const openCreate = () => {
        setEditing(null);
        setCreateKey((k) => k + 1);
        setModalOpen(true);
    };

    const resolveImg = (img) => (img ? (img.startsWith('http') ? img : `/storage/${img}`) : null);

    const del = (cat) => {
        confirm(
            `Delete category "${cat.name}"? Products may lose this category.`,
            () =>
                router.delete(`/admin/categories/items/${cat.id}`, {
                    preserveScroll: true,
                    onSuccess: () => success('Category deleted!'),
                }),
            { title: 'Delete category?', confirmText: 'Yes, delete', icon: 'warning' }
        );
    };

    const parentLabel = (row) => {
        const sg = row.parent;
        if (!sg) return '—';
        const g = sg.parent;
        return g ? `${g.name} › ${sg.name}` : sg.name;
    };

    return (
        <AdminLayout title="Catalog categories">
            <Head title="Categories — Admin" />

            <CatalogCategoryModal
                key={editing ? `cat-${editing.id}` : `cat-new-${createKey}`}
                category={editing}
                subGroups={subGroups}
                show={modalOpen || !!editing}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
            />

            <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-xl">
                <div className="border border-zinc-100 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-black text-zinc-800">{catalogStats?.total ?? '—'}</p>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">Catalog categories</p>
                </div>
                <div className="border border-zinc-100 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-black text-zinc-800">{catalogStats?.featured ?? '—'}</p>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">Featured</p>
                </div>
            </div>

            <div className="overflow-hidden border border-zinc-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-bold text-zinc-800">Categories</h3>
                        <p className="text-xs text-zinc-400">
                            All catalog rows · Groups {stats.roots} · Sub-rows {stats.children}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or slug…"
                            className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange sm:w-52"
                        />
                        <button
                            type="button"
                            onClick={openCreate}
                            className="bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                            <i className="fa-solid fa-plus mr-1.5" />
                            Add category
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                            <tr>
                                <th className="px-4 py-3 text-left">Cover</th>
                                <th className="px-4 py-3 text-left">Featured</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Parent</th>
                                <th className="px-4 py-3 text-left">Products</th>
                                <th className="px-4 py-3 text-left">Sub</th>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {(categories?.data ?? []).map((row) => (
                                <tr key={row.id} className="transition hover:bg-zinc-50">
                                    <td className="px-4 py-3">
                                        {resolveImg(row.cover_image) ? (
                                            <img src={resolveImg(row.cover_image)} alt="" className="h-10 w-16 border border-zinc-100 object-cover" />
                                        ) : (
                                            <div className="h-10 w-16 border border-zinc-100 bg-zinc-100" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {resolveImg(row.image) ? (
                                            <img src={resolveImg(row.image)} alt="" className="h-10 w-16 border border-zinc-100 object-cover" />
                                        ) : (
                                            <div className="h-10 w-16 border border-zinc-100 bg-zinc-100" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-zinc-800">{row.name}</span>
                                            {row.is_featured && (
                                                <span className="bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Featured</span>
                                            )}
                                        </div>
                                        {row.description && <p className="mt-1 max-w-xs truncate text-xs text-zinc-400">{row.description}</p>}
                                    </td>
                                    <td className="max-w-xs px-4 py-3 text-zinc-600">
                                        <span className="line-clamp-2">{parentLabel(row)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600">{row.products_count ?? 0}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">{row.children_count ?? 0}</span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">{row.order}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-0.5 text-xs font-bold ${row.active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}
                                        >
                                            {row.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setModalOpen(false);
                                                setEditing(row);
                                            }}
                                            className="mr-3 text-zinc-400 hover:text-brand-orange"
                                            title="Edit"
                                        >
                                            <i className="fa-solid fa-pen-to-square" />
                                        </button>
                                        <button type="button" onClick={() => del(row)} className="text-zinc-400 hover:text-red-500" title="Delete">
                                            <i className="fa-solid fa-trash-can" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(categories?.data ?? []).length === 0 && (
                        <div className="py-16 text-center text-zinc-400">
                            <i className="fa-solid fa-layer-group mb-2 block text-3xl" />
                            No categories match your filters
                        </div>
                    )}
                </div>

                {categories?.links?.length > 0 && (
                    <div className="flex flex-col items-start justify-between gap-2 border-t px-5 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center">
                        <span>
                            {categories.from}–{categories.to} of {categories.total}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {categories.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    className={`border px-3 py-1.5 font-semibold transition ${link.active ? 'border-brand-orange bg-brand-orange text-white' : 'border-zinc-200 bg-white text-zinc-600'} ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
