import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';
import Modal from '@/Components/Admin/Modal';
import SearchablePicker from '@/Components/Admin/SearchablePicker';

function resolveMedia(img) {
    if (!img) return null;
    return img.startsWith('http') ? img : `/storage/${img}`;
}

function SubGroupModal({ subGroup, roots, show, onClose }) {
    const isEdit = !!subGroup;
    const [parentMissing, setParentMissing] = useState(false);
    const { data, setData, processing, errors, reset } = useForm({
        name:               subGroup?.name || '',
        slug:               subGroup?.slug || '',
        parent_id:          subGroup?.parent_id != null ? String(subGroup.parent_id) : '',
        order:              subGroup?.order ?? 99,
        active:             subGroup?.active ?? true,
        description:        subGroup?.description || '',
        meta_title:         subGroup?.meta_title || '',
        meta_description:   subGroup?.meta_description || '',
        cover_image:        null,
    });

    /** Single modal: create + update → one submit path. */
    const submit = (e) => {
        e.preventDefault();
        if (!data.parent_id) {
            setParentMissing(true);
            return;
        }
        setParentMissing(false);
        const url = isEdit
            ? `/admin/categories/sub-groups/${subGroup.id}`
            : '/admin/categories/sub-groups';
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
        <Modal show={show} onClose={onClose} title={isEdit ? 'Edit sub-group' : 'Add sub-group'} maxWidth="max-w-2xl">
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Parent group *</label>
                            <SearchablePicker
                                items={roots}
                                value={data.parent_id}
                                onChange={(id) => { setData('parent_id', id); setParentMissing(false); }}
                                getValue={(r) => String(r.id)}
                                getLabel={(r) => r.name}
                                buttonPlaceholder="Select parent group"
                                searchPlaceholder="Search groups…"
                                clearLabel="Select parent group"
                                error={!!errors.parent_id || parentMissing}
                            />
                            {(errors.parent_id || parentMissing) && (
                                <p className="text-xs text-red-500 mt-1">{errors.parent_id || 'Please select a parent group.'}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Sub-group name *</label>
                            <input value={data.name} onChange={e => { setData('name', e.target.value); if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')); }}
                                placeholder="Category sub-group name" required
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Slug *</label>
                            <input value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="SEO friendly URL" required
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-600 block mb-1">Order</label>
                            <input type="number" value={data.order} onChange={e => setData('order', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Status *</label>
                        <select value={data.active ? '1' : '0'} onChange={e => setData('active', e.target.value === '1')} required
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange">
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Description</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange resize-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Meta title</label>
                        <input value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Meta title"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Meta description</label>
                        <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={2} placeholder="Meta description"
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange resize-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-zinc-600 block mb-1">Cover image</label>
                        {isEdit && subGroup?.cover_image && !data.cover_image ? (
                            <div className="mb-2">
                                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">Current</p>
                                <img
                                    src={resolveMedia(subGroup.cover_image)}
                                    alt=""
                                    className="max-h-28 w-full rounded-lg border border-zinc-200 object-cover object-center"
                                />
                            </div>
                        ) : null}
                        <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-brand-orange">
                            {data.cover_image ? (
                                <span className="truncate px-2 text-center text-xs font-medium text-green-600">{data.cover_image.name}</span>
                            ) : (
                                <>
                                    <i className="fa-solid fa-upload mb-1 text-lg text-zinc-300" />
                                    <span className="text-[10px] text-zinc-400">
                                        {isEdit && subGroup?.cover_image ? 'Replace • ' : ''}1280×300px recommended
                                    </span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={e => setData('cover_image', e.target.files[0] || null)} />
                        </label>
                        {errors.cover_image && <p className="text-xs text-red-500 mt-1">{errors.cover_image}</p>}
                    </div>
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

export default function AdminSubGroups({ subGroups, roots, stats }) {
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [createKey, setCreateKey] = useState(0);
    const { confirm, success } = useAlert();

    const openCreate = () => {
        setEditing(null);
        setCreateKey((k) => k + 1);
        setModal(true);
    };

    const resolveImg = (img) => img ? (img.startsWith('http') ? img : `/storage/${img}`) : null;

    const del = (sg) => {
        confirm(`Trash sub-group "${sg.name}"?`,
            () => router.delete(`/admin/categories/sub-groups/${sg.id}`, {
                preserveScroll: true,
                onSuccess: () => success('Sub-group deleted!'),
            }),
            { title: 'Trash Sub-group?', confirmText: 'Yes, Trash', icon: 'warning' }
        );
    };

    return (
        <AdminLayout title="Category Sub-groups">
            <Head title="Sub-groups — Admin" />

            <SubGroupModal
                key={editing ? `sub-edit-${editing.id}` : `sub-new-${createKey}`}
                subGroup={editing}
                roots={roots}
                show={modal || !!editing}
                onClose={() => { setModal(false); setEditing(null); }}
            />

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="font-bold text-zinc-800">Category sub-groups</h3>
                    <button type="button" onClick={openCreate} className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                        <i className="fa-solid fa-plus mr-1.5" />Add sub-group
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3 text-left w-24">Cover</th>
                                <th className="px-4 py-3 text-left">Sub-group</th>
                                <th className="px-4 py-3 text-left">Parent Group</th>
                                <th className="px-4 py-3 text-left">Categories</th>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {subGroups.data.map(sg => (
                                <tr key={sg.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-4 py-3">
                                        {resolveImg(sg.cover_image) ? (
                                            <img src={resolveImg(sg.cover_image)} alt="" className="h-10 w-16 rounded object-cover border border-zinc-100" />
                                        ) : (
                                            <div className="h-10 w-16 rounded bg-zinc-100 border border-zinc-100" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-zinc-800">{sg.name}</p>
                                        {sg.description && <p className="text-xs text-zinc-400 truncate max-w-xs">{sg.description}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500">{sg.parent?.name || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600">{sg.children_count}</span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">{sg.order}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sg.active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {sg.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => { setModal(false); setEditing(sg); }} className="text-zinc-400 hover:text-brand-orange" title="Edit"><i className="fa-solid fa-edit" /></button>
                                            <button onClick={() => del(sg)} className="text-zinc-400 hover:text-red-500" title="Trash"><i className="fa-solid fa-trash-can" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {subGroups.data.length === 0 && (
                        <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-folder-open text-3xl mb-2 block" />No sub-groups found</div>
                    )}
                </div>

                {subGroups.links && (
                    <div className="border-t px-5 py-3 flex items-center justify-between text-xs text-zinc-500">
                        <span>{subGroups.from}–{subGroups.to} of {subGroups.total} entries</span>
                        <div className="flex gap-1">
                            {subGroups.links.map((link, i) => (
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
