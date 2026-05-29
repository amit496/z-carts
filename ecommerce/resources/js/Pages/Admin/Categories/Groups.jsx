import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import Modal from '@/Components/Admin/Modal';

const FA_ICONS = [
    'fa-home','fa-star','fa-heart','fa-bolt','fa-tag','fa-tags','fa-gift','fa-shopping-cart',
    'fa-laptop','fa-mobile','fa-tablet','fa-desktop','fa-camera','fa-music','fa-film','fa-book',
    'fa-gamepad','fa-car','fa-motorcycle','fa-plane','fa-ship','fa-train','fa-bicycle',
    'fa-tshirt','fa-bath','fa-bed','fa-couch','fa-tools','fa-wrench','fa-cog','fa-cogs',
    'fa-leaf','fa-tree','fa-sun','fa-moon','fa-cloud','fa-snowflake','fa-fire','fa-water',
    'fa-baby','fa-child','fa-user','fa-users','fa-female','fa-male','fa-dog','fa-cat',
    'fa-apple-alt','fa-carrot','fa-bread-slice','fa-pizza-slice','fa-coffee','fa-wine-glass',
    'fa-dumbbell','fa-running','fa-swimming-pool','fa-football-ball','fa-basketball-ball',
    'fa-paint-brush','fa-palette','fa-pen','fa-pencil-alt','fa-scissors','fa-sewing-needle',
    'fa-gem','fa-ring','fa-glasses','fa-hat-cowboy','fa-shoe-prints','fa-socks',
    'fa-plug','fa-battery-full','fa-lightbulb','fa-tv','fa-headphones','fa-keyboard',
    'fa-cube','fa-cubes','fa-box','fa-boxes','fa-archive','fa-warehouse',
];

function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const filtered = FA_ICONS.filter(i => i.includes(search));
    return (
        <div className="relative">
            <div className="flex">
                <input value={value} onChange={e => onChange(e.target.value)} placeholder="fa-cube"
                    className="flex-1 rounded-l-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                <button type="button" onClick={() => setOpen(o => !o)}
                    className="rounded-r-lg border border-l-0 border-zinc-200 bg-zinc-50 px-3 hover:bg-zinc-100">
                    <i className={`fa-solid ${value || 'fa-cube'} text-zinc-600`} />
                </button>
            </div>
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-xl">
                    <div className="p-2 border-b">
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search icon..."
                            className="w-full rounded border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-brand-orange" />
                    </div>
                    <div className="grid grid-cols-8 gap-1 p-2 max-h-48 overflow-y-auto">
                        {filtered.map(icon => (
                            <button key={icon} type="button" title={icon}
                                onClick={() => { onChange(icon); setOpen(false); }}
                                className={`flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-brand-orange hover:text-white transition ${value === icon ? 'bg-brand-orange text-white' : 'text-zinc-600'}`}>
                                <i className={`fa-solid ${icon}`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function resolveMedia(img) {
    if (!img) return null;
    return img.startsWith('http') ? img : `/storage/${img}`;
}

function GroupModal({ group, show, onClose }) {
    const isEdit = !!group;
    const { data, setData, processing, errors, reset } = useForm({
        name:             group?.name || '',
        slug:             group?.slug || '',
        icon:             group?.icon || 'fa-cube',
        order:            group?.order ?? 99,
        active:           group?.active ?? true,
        description:      group?.description || '',
        meta_title:       group?.meta_title || '',
        meta_description: group?.meta_description || '',
        image:            null,
        cover_image:      null,
        icon_image:       null,
    });

    /** Single modal: create + update → one submit path (FormData). */
    const submit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? `/admin/categories/groups/${group.id}`
            : '/admin/categories/groups';
        const payload = isEdit ? { ...data, _method: 'PATCH' } : data;
        router.post(url, payload, {
            forceFormData: true,
            onSuccess: () => {
                if (!isEdit) reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} title={isEdit ? 'Edit category group' : 'Add category group'}>

                <form onSubmit={submit} className="p-5 space-y-4">
                    {/* Name + Order */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Category name *</label>
                            <input value={data.name} onChange={e => { setData('name', e.target.value); if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')); }}
                                placeholder="Category name" required
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Order</label>
                            <input type="number" value={data.order} onChange={e => setData('order', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                        </div>
                    </div>

                    {/* Slug + Icon + Status */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Slug *</label>
                            <input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="seo-friendly-url" required
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Icon</label>
                            <IconPicker value={data.icon} onChange={v => setData('icon', v)} />
                            {!!data.icon && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                                    <i className={`fa-solid ${data.icon.replace(/^fa-solid\s+/i, '').trim()} text-xl text-brand-orange`} aria-hidden />
                                    <span className="truncate text-xs text-zinc-500">{data.icon}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Status *</label>
                            <select value={data.active ? '1' : '0'} onChange={e => setData('active', e.target.value === '1')} required
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange">
                                <option value="">Select status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Description <span className="text-zinc-400 font-normal">(Merchants will see this)</span></label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} placeholder="Description"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange resize-none" />
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { key: 'image',       label: 'Background image', hint: 'Displays in category dropdown' },
                            { key: 'cover_image', label: 'Cover image',      hint: '1280×300px recommended' },
                            { key: 'icon_image',  label: 'Icon Image',       hint: '32×32px .png' },
                        ].map(f => {
                            const current = group?.[f.key] ? resolveMedia(group[f.key]) : null;
                            return (
                            <div key={f.key}>
                                <label className="text-xs font-semibold text-zinc-600 block mb-1">{f.label}</label>
                                {isEdit && current && !data[f.key] ? (
                                    <div className="mb-2">
                                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">Current</p>
                                        <img src={current} alt="" className="h-16 w-full rounded-lg border border-zinc-200 object-cover" />
                                    </div>
                                ) : null}
                                <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-brand-orange">
                                    {!data[f.key] ? (
                                        <>
                                            <i className="fa-solid fa-upload mb-1 text-lg text-zinc-300" />
                                            <span className="text-[10px] text-zinc-400">{isEdit && group?.[f.key] ? 'Replace' : 'Upload'}</span>
                                        </>
                                    ) : (
                                        <span className="truncate px-2 text-center text-xs font-medium text-green-600">{data[f.key].name}</span>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setData(f.key, e.target.files?.[0] ?? null)} />
                                </label>
                                <p className="mt-1 text-[10px] text-zinc-400">{f.hint}</p>
                            </div>
                            );
                        })}
                    </div>

                    {/* Meta */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Meta title</label>
                        <input value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Meta Title"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Meta description</label>
                        <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={2} placeholder="Meta Description"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange resize-none" />
                    </div>

                    <p className="text-xs text-zinc-400">* Required fields.</p>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <button type="button" onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-lg bg-brand-orange px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
    );
}

export default function AdminCategoryGroups({ groups, stats }) {
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [createKey, setCreateKey] = useState(0);
    const { confirm, success } = useAlert();

    const openCreate = () => {
        setEditing(null);
        setCreateKey((k) => k + 1);
        setModal(true);
    };

    const del = (group) => {
        confirm(`Trash category group "${group.name}"?`,
            () => router.delete(`/admin/categories/groups/${group.id}`, {
                preserveScroll: true,
                onSuccess: () => success('Category group deleted!'),
            }),
            { title: 'Trash Group?', confirmText: 'Yes, Trash', icon: 'warning' }
        );
    };

    const resolveImg = (img) => img ? (img.startsWith('http') ? img : `/storage/${img}`) : null;

    return (
        <AdminLayout title="Category Groups">
            <Head title="Category Groups — Admin" />

            <GroupModal
                key={editing ? `group-edit-${editing.id}` : `group-new-${createKey}`}
                group={editing}
                show={modal || !!editing}
                onClose={() => { setModal(false); setEditing(null); }}
            />

            {/* Stats */}
            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Categories', value: stats.total,    color: 'bg-blue-50 text-blue-700',   icon: 'fa-layer-group' },
                    { label: 'Groups',           value: stats.roots,    color: 'bg-green-50 text-green-700', icon: 'fa-folder' },
                    { label: 'Sub-categories',   value: stats.children, color: 'bg-orange-50 text-orange-700', icon: 'fa-folder-open' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="font-bold text-zinc-800">Category groups</h3>
                    <button type="button" onClick={openCreate}
                        className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                        <i className="fa-solid fa-plus mr-1.5" />Add category group
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3 text-left w-24">Background</th>
                                <th className="px-4 py-3 text-left w-24">Cover</th>
                                <th className="px-4 py-3 text-left">Category group</th>
                                <th className="px-4 py-3 text-left w-24">Sub-groups</th>
                                <th className="px-4 py-3 text-left w-16">Order</th>
                                <th className="px-4 py-3 text-left w-16">Status</th>
                                <th className="px-4 py-3 text-left w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {groups.data.map(g => (
                                <tr key={g.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-4 py-3">
                                        {resolveImg(g.image)
                                            ? <img src={resolveImg(g.image)} alt="bg" className="h-10 w-16 rounded object-cover border" />
                                            : <div className="h-10 w-16 rounded bg-zinc-100 flex items-center justify-center"><i className="fa-solid fa-image text-zinc-300" /></div>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        {resolveImg(g.cover_image)
                                            ? <img src={resolveImg(g.cover_image)} alt="cover" className="h-10 w-16 rounded object-cover border" />
                                            : <div className="h-10 w-16 rounded bg-zinc-100 flex items-center justify-center"><i className="fa-solid fa-image text-zinc-300" /></div>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {g.icon && <i className={`fa-solid ${g.icon} text-brand-orange`} />}
                                            <div>
                                                <p className="font-semibold text-zinc-800">{g.name}</p>
                                                {g.description && <p className="text-xs text-zinc-400 max-w-xs truncate">{g.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600">
                                            {g.children_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">{g.order}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${g.active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {g.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => { setModal(false); setEditing(g); }} className="text-zinc-400 hover:text-brand-orange transition" title="Edit">
                                                <i className="fa-solid fa-edit" />
                                            </button>
                                            <button onClick={() => del(g)} className="text-zinc-400 hover:text-red-500 transition" title="Trash">
                                                <i className="fa-solid fa-trash-can" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {groups.data.length === 0 && (
                        <div className="py-16 text-center text-zinc-400">
                            <i className="fa-solid fa-layer-group text-3xl mb-2 block" />No category groups found
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {groups.links && (
                    <div className="border-t px-5 py-3 flex items-center justify-between text-xs text-zinc-500">
                        <span>{groups.from}–{groups.to} of {groups.total} entries</span>
                        <div className="flex gap-1">
                            {groups.links.map((link, i) => (
                                <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    className={`px-3 py-1.5 rounded font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
