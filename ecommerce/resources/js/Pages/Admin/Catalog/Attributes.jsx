import { Head, router, useForm } from '@inertiajs/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';
import StatCard from '@/Components/Admin/StatCard';
import Modal from '@/Components/Admin/Modal';
import AdminTableIconAction from '@/Components/Admin/AdminTableIconAction';

const TYPE_LABELS = {
    select: 'Select',
    radio: 'Radio',
    color_pattern: 'Color/Pattern',
};

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function csvEscape(value) {
    const s = String(value ?? '');
    if (/[",\r\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

function buildExportRows(list) {
    return list.map((a) => ({
        order: a.sort_order,
        name: a.name,
        type: TYPE_LABELS[a.type] || a.type,
        categories: a.categories_count,
        entities: a.values_count,
    }));
}

function buildExportTsv(rows) {
    const header = ['Order', 'Name', 'Type', 'Categories', 'Entities'];
    const lines = [header.join('\t'), ...rows.map((r) => [r.order, r.name, r.type, r.categories, r.entities].join('\t'))];
    return lines.join('\n');
}

function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAttributesCsv(rows) {
    const header = ['Order', 'Name', 'Type', 'Categories', 'Entities'];
    const body = rows.map((r) =>
        [csvEscape(r.order), csvEscape(r.name), csvEscape(r.type), csvEscape(r.categories), csvEscape(r.entities)].join(','),
    );
    const csv = [header.join(','), ...body].join('\r\n');
    downloadBlob(`\ufeff${csv}`, `catalog-attributes-${Date.now()}.csv`, 'text/csv;charset=utf-8');
}

function downloadAttributesExcelHtml(rows) {
    let html =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body><table border="1">';
    html += '<thead><tr><th>Order</th><th>Name</th><th>Type</th><th>Categories</th><th>Entities</th></tr></thead><tbody>';
    rows.forEach((r) => {
        html += `<tr><td>${escapeHtml(r.order)}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.categories)}</td><td>${escapeHtml(r.entities)}</td></tr>`;
    });
    html += '</tbody></table></body></html>';
    downloadBlob(html, `catalog-attributes-${Date.now()}.xls`, 'application/vnd.ms-excel');
}

function openAttributesPrintWindow(rows, subtitle) {
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
        return false;
    }
    let doc = `<!DOCTYPE html><html><head><title>Attributes</title><style>
      body{font-family:system-ui,-apple-system,sans-serif;font-size:12px;padding:16px;}
      h1{font-size:18px;margin:0 0 4px;}
      .meta{color:#666;margin:0 0 16px;font-size:11px;}
      table{border-collapse:collapse;width:100%;}
      th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;}
      th{background:#f4f4f5;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;}
    </style></head><body><h1>Attributes</h1><p class="meta">${escapeHtml(subtitle)}</p><table><thead><tr>
      <th>Order</th><th>Name</th><th>Type</th><th>Categories</th><th>Entities</th></tr></thead><tbody>`;
    rows.forEach((r) => {
        doc += `<tr><td>${escapeHtml(r.order)}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.categories)}</td><td>${escapeHtml(r.entities)}</td></tr>`;
    });
    doc += '</tbody></table></body></html>';
    w.document.write(doc);
    w.document.close();
    w.focus();
    w.print();
    window.setTimeout(() => {
        try {
            w.close();
        } catch {
            //
        }
    }, 360);
    return true;
}

function resolveMedia(img) {
    if (!img) return null;
    return img.startsWith('http') ? img : `/storage/${img}`;
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
    const selectedOptions = categoryOptions.filter((c) => sid.has(String(c.id)));
    const term = search.trim().toLowerCase();
    const filtered = categoryOptions.filter(
        (c) => !sid.has(String(c.id)) && (!term || c.label.toLowerCase().includes(term))
    );

    const add = (id) => {
        onChange([...selectedIds.map(String), String(id)]);
        setSearch('');
    };

    const remove = (id) => {
        onChange(selectedIds.filter((x) => String(x) !== String(id)));
    };

    return (
        <div className="relative" ref={wrapRef}>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">Categories</label>
            <div
                className={`flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-[3px] border p-2 ${error ? 'border-red-300' : 'border-zinc-200'}`}
            >
                {selectedOptions.map((c) => (
                    <span
                        key={c.id}
                        className="inline-flex max-w-full items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800"
                    >
                        <span className="truncate">{c.label}</span>
                        <button type="button" onClick={() => remove(c.id)} className="shrink-0 text-blue-600 hover:text-blue-900">
                            <i className="fa-solid fa-xmark text-[10px]" />
                        </button>
                    </span>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        setOpen((o) => {
                            if (!o) setSearch('');
                            return !o;
                        });
                    }}
                    className="rounded-[3px] border border-dashed border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:border-brand-orange hover:text-brand-orange"
                >
                    <i className="fa-solid fa-plus mr-1" />
                    Add
                </button>
            </div>
            {open && (
                <div className="absolute z-[60] mt-1 max-h-64 w-full overflow-hidden border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 p-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories…"
                            autoFocus
                            className="w-full rounded-[3px] border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        {filtered.length === 0 && <li className="px-3 py-2 text-xs text-zinc-400">No matches</li>}
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
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SearchableAttributeSelect({ attributes, value, onChange, error, disabled }) {
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

    const term = search.trim().toLowerCase();
    const filtered = term ? attributes.filter((a) => a.name.toLowerCase().includes(term)) : attributes;
    const selected = attributes.find((a) => String(a.id) === String(value));

    return (
        <div className="relative" ref={wrapRef}>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">Attribute *</label>
            <button
                type="button"
                disabled={disabled}
                onClick={() =>
                    !disabled &&
                    setOpen((o) => {
                        if (!o) setSearch('');
                        return !o;
                    })
                }
                className={`flex w-full items-center justify-between rounded-[3px] border px-3 py-2 text-left text-sm outline-none transition focus:border-brand-orange ${
                    error ? 'border-red-300' : 'border-zinc-200'
                } ${disabled ? 'cursor-not-allowed bg-zinc-50 text-zinc-500' : !value ? 'text-zinc-400' : 'text-zinc-800'}`}
            >
                <span className="truncate">{selected ? selected.name : 'Select'}</span>
                {!disabled && <i className={`fa-solid fa-chevron-down text-xs text-zinc-400 ${open ? 'rotate-180' : ''}`} />}
            </button>
            {open && !disabled && (
                <div className="absolute z-[60] mt-1 max-h-64 w-full overflow-hidden border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 p-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search…"
                            autoFocus
                            className="w-full rounded-[3px] border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        {filtered.map((a) => (
                            <li key={a.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(String(a.id));
                                        setOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                                        String(a.id) === String(value) ? 'bg-orange-50 font-semibold text-brand-orange' : 'text-zinc-700'
                                    }`}
                                >
                                    {a.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function AttributeModal({ attribute, categoryOptions, show, onClose }) {
    const isEdit = !!attribute;
    const {
        data,
        setData,
        errors,
        reset,
        processing,
    } = useForm({
        name: attribute?.name || '',
        type: attribute?.type || 'select',
        sort_order: attribute?.sort_order ?? 0,
        category_ids: attribute?.category_ids?.map(String) || [],
    });

    useEffect(() => {
        if (!show) return;
        reset({
            name: attribute?.name || '',
            type: attribute?.type || 'select',
            sort_order: attribute?.sort_order ?? 0,
            category_ids: attribute?.category_ids?.map(String) || [],
        });
    }, [show, attribute, reset]);

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            category_ids: data.category_ids.map((id) => Number(id)),
            sort_order: Number(data.sort_order) || 0,
        };
        const url = isEdit ? `/admin/catalog/attributes/${attribute.id}` : '/admin/catalog/attributes';
        if (isEdit) {
            router.patch(url, payload, { onSuccess: () => onClose() });
            return;
        }
        router.post(url, payload, { onSuccess: () => onClose() });
    };

    return (
        <Modal show={show} onClose={onClose} title={isEdit ? 'Edit attribute' : 'Add attribute'} maxWidth="max-w-xl">
            <form key={attribute?.id ?? 'new'} onSubmit={submit} className="space-y-4 p-5">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">Attribute type *</label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className={`w-full rounded-[3px] border px-3 py-2 text-sm outline-none focus:border-brand-orange ${errors.type ? 'border-red-300' : 'border-zinc-200'}`}
                    >
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">Attribute name *</label>
                    <input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Attribute name"
                        required
                        className={`w-full rounded-[3px] border px-3 py-2 text-sm outline-none focus:border-brand-orange ${errors.name ? 'border-red-300' : 'border-zinc-200'}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">List order</label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', e.target.value)}
                        placeholder="Viewing order"
                        className={`w-full rounded-[3px] border px-3 py-2 text-sm outline-none focus:border-brand-orange ${errors.sort_order ? 'border-red-300' : 'border-zinc-200'}`}
                    />
                    {errors.sort_order && <p className="mt-1 text-xs text-red-500">{errors.sort_order}</p>}
                </div>
                <CategoryTagPicker
                    categoryOptions={categoryOptions}
                    selectedIds={data.category_ids}
                    onChange={(ids) => setData('category_ids', ids)}
                    error={errors.category_ids}
                />
                <p className="text-[11px] text-zinc-500">* Required fields.</p>
                <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[3px] border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-[3px] bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function AttributeValueModal({ valueRow, preselectAttributeId, attributes, show, onClose }) {
    const isEdit = !!valueRow;
    const {
        data,
        setData,
        errors,
        reset,
        processing,
    } = useForm({
        catalog_attribute_id: preselectAttributeId || valueRow?.catalog_attribute_id || '',
        value: valueRow?.value || '',
        sort_order: valueRow?.sort_order ?? 0,
        image: null,
    });

    useEffect(() => {
        if (!show) return;
        reset({
            catalog_attribute_id: String(preselectAttributeId || valueRow?.catalog_attribute_id || ''),
            value: valueRow?.value || '',
            sort_order: valueRow?.sort_order ?? 0,
            image: null,
        });
    }, [show, valueRow, preselectAttributeId, reset]);

    const submit = (e) => {
        e.preventDefault();
        const attrId = data.catalog_attribute_id;
        if (!attrId) return;

        if (isEdit) {
            router.post(
                `/admin/catalog/attribute-values/${valueRow.id}`,
                {
                    _method: 'patch',
                    value: data.value,
                    sort_order: Number(data.sort_order) || 0,
                    image: data.image,
                },
                {
                    forceFormData: true,
                    onSuccess: () => onClose(),
                }
            );
            return;
        }

        router.post(
            `/admin/catalog/attributes/${attrId}/values`,
            {
                value: data.value,
                sort_order: Number(data.sort_order) || 0,
                image: data.image,
            },
            {
                forceFormData: true,
                onSuccess: () => onClose(),
            }
        );
    };

    const preview = data.image instanceof File ? URL.createObjectURL(data.image) : resolveMedia(valueRow?.image);

    return (
        <Modal show={show} onClose={onClose} title={isEdit ? 'Edit attribute value' : 'Add attribute value'} maxWidth="max-w-lg">
            <form key={valueRow?.id ?? 'nv'} onSubmit={submit} className="space-y-4 p-5">
                <SearchableAttributeSelect
                    attributes={attributes}
                    value={data.catalog_attribute_id}
                    onChange={(id) => setData('catalog_attribute_id', id)}
                    error={errors.catalog_attribute_id}
                    disabled={isEdit || !!preselectAttributeId}
                />
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">Attribute value *</label>
                    <input
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        placeholder="Attribute value"
                        required
                        className={`w-full rounded-[3px] border px-3 py-2 text-sm outline-none focus:border-brand-orange ${errors.value ? 'border-red-300' : 'border-zinc-200'}`}
                    />
                    {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">List order</label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', e.target.value)}
                        placeholder="Viewing order"
                        className="w-full rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600">Image (swatch / icon)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-zinc-600 file:mr-3 file:rounded-[3px] file:border file:border-zinc-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium"
                    />
                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    {preview && (
                        <img src={preview} alt="" className="mt-2 h-16 w-16 rounded border border-zinc-200 object-cover" />
                    )}
                </div>
                <p className="text-[11px] text-zinc-500">* Required fields.</p>
                <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[3px] border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing || !data.catalog_attribute_id}
                        className="rounded-[3px] bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default function Attributes({ attributes: attrList = [], categoryOptions = [] }) {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(() => new Set());
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const [exportBanner, setExportBanner] = useState(null);
    const headerCheckboxRef = useRef(null);
    const exportBannerTimer = useRef(null);
    const [attrModal, setAttrModal] = useState(null);
    const [valueModal, setValueModal] = useState(null);
    const [valuePresetAttrId, setValuePresetAttrId] = useState(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return attrList;
        return attrList.filter((a) => a.name.toLowerCase().includes(q) || TYPE_LABELS[a.type]?.toLowerCase().includes(q));
    }, [attrList, search]);

    const totalValues = useMemo(() => attrList.reduce((n, a) => n + (a.values?.length || 0), 0), [attrList]);

    useEffect(() => {
        const valid = new Set(attrList.map((a) => a.id));
        setSelectedIds((prev) => {
            const next = new Set(Array.from(prev).filter((id) => valid.has(id)));
            return next.size === prev.size ? prev : next;
        });
    }, [attrList]);

    useEffect(() => {
        const ind = filtered.filter((a) => selectedIds.has(a.id)).length;
        const all = filtered.length > 0 && ind === filtered.length;
        const el = headerCheckboxRef.current;
        if (el) el.indeterminate = ind > 0 && !all;
    }, [filtered, selectedIds]);

    useEffect(
        () => () => {
            if (exportBannerTimer.current) clearTimeout(exportBannerTimer.current);
        },
        [],
    );

    const showExportBanner = (msg) => {
        if (exportBannerTimer.current) clearTimeout(exportBannerTimer.current);
        setExportBanner(msg);
        exportBannerTimer.current = setTimeout(() => setExportBanner(null), 2800);
    };

    const toggleSelectAllFiltered = () => {
        const ids = filtered.map((a) => a.id);
        if (ids.length === 0) return;
        const allChecked = ids.every((id) => selectedIds.has(id));
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allChecked) ids.forEach((id) => next.delete(id));
            else ids.forEach((id) => next.add(id));
            return next;
        });
    };

    const toggleRowSelected = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleBulkDelete = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        if (!window.confirm(`Delete ${ids.length} attribute(s) and all their values?`)) return;
        router.delete('/admin/catalog/attributes/bulk', {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const exportRows = useMemo(() => buildExportRows(filtered), [filtered]);

    const handleExportCopy = async () => {
        if (!exportRows.length) {
            showExportBanner('Nothing to copy for the current filter.');
            return;
        }
        try {
            await navigator.clipboard.writeText(buildExportTsv(exportRows));
            showExportBanner('Copied to clipboard (tab-separated — paste into Sheets / Excel).');
        } catch {
            showExportBanner('Clipboard unavailable — download CSV instead.');
        }
    };

    const handleExportCsv = () => {
        if (!exportRows.length) {
            showExportBanner('Nothing to export for the current filter.');
            return;
        }
        downloadAttributesCsv(exportRows);
        showExportBanner('CSV file downloaded.');
    };

    const handleExportExcel = () => {
        if (!exportRows.length) {
            showExportBanner('Nothing to export for the current filter.');
            return;
        }
        downloadAttributesExcelHtml(exportRows);
        showExportBanner('Excel-compatible file (.xls) downloaded.');
    };

    const handleExportPdfDialog = () => {
        if (!exportRows.length) {
            showExportBanner('Nothing to print for the current filter.');
            return;
        }
        const ok = openAttributesPrintWindow(exportRows, 'Use your browser’s print dialog → choose “Save as PDF”.');
        if (!ok) showExportBanner('Pop-up blocked — allow pop-ups for this site to export PDF.');
    };

    const handlePrint = () => {
        if (!exportRows.length) {
            showExportBanner('Nothing to print for the current filter.');
            return;
        }
        const ok = openAttributesPrintWindow(
            exportRows,
            `${exportRows.length} row(s) — current search filter.`,
        );
        if (!ok) showExportBanner('Pop-up blocked — allow pop-ups for this site to print.');
    };

    const exportBtnClass =
        'rounded-[3px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-700 hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40';

    const toggleExpand = (id) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const destroyAttribute = (a) => {
        if (!window.confirm(`Delete attribute “${a.name}” and all its values?`)) return;
        router.delete(`/admin/catalog/attributes/${a.id}`);
    };

    const destroyValue = (v) => {
        if (!window.confirm(`Delete value “${v.value}”?`)) return;
        router.delete(`/admin/catalog/attribute-values/${v.id}`);
    };

    const openAddAttr = () => setAttrModal('new');
    const openEditAttr = (a) => setAttrModal(a);
    const closeAttrModal = () => setAttrModal(null);

    const openAddValue = (attrId = null) => {
        setValuePresetAttrId(attrId);
        setValueModal('new');
    };
    const openEditValue = (v) => {
        setValuePresetAttrId(null);
        setValueModal(v);
    };
    const closeValueModal = () => {
        setValueModal(null);
        setValuePresetAttrId(null);
    };

    const attrForModal = attrModal === 'new' ? null : attrModal;

    return (
        <PanelLayout title="Attributes" subtitle="Define catalog attributes (type, categories) and optional values / swatches.">
            <Head title="Attributes — Admin" />

            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Total attributes" value={attrList.length} icon="fa-list" />
                <StatCard label="Total entities" value={totalValues} icon="fa-tags" />
            </div>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader
                    title="Attributes"
                    subtitle="Map attributes to categories; add values used on product variants or filters."
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => openAddValue()} className="rounded-[3px] bg-zinc-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-zinc-800 hover:bg-zinc-200">
                                Add attribute value
                            </button>
                            <button type="button" onClick={openAddAttr} className="rounded-[3px] bg-brand-orange px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white hover:opacity-95">
                                Add attribute
                            </button>
                        </div>
                    }
                />

                {exportBanner && (
                    <div className="mb-3 rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900">
                        {exportBanner}
                    </div>
                )}

                {selectedIds.size > 0 && (
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-[3px] border border-brand-orange/30 bg-orange-50/80 px-3 py-2">
                        <span className="text-xs font-semibold text-zinc-800">{selectedIds.size} selected</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedIds(new Set())}
                                className="rounded-[3px] border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                            >
                                Clear selection
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkDelete}
                                className="rounded-[3px] bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                            >
                                Delete selected
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or type…"
                        className="w-full max-w-xs rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange lg:max-w-sm"
                    />
                    <div className="flex flex-wrap gap-1.5">
                        <button type="button" disabled={filtered.length === 0} className={exportBtnClass} onClick={handleExportCopy}>
                            Copy
                        </button>
                        <button type="button" disabled={filtered.length === 0} className={exportBtnClass} onClick={handleExportCsv}>
                            CSV
                        </button>
                        <button type="button" disabled={filtered.length === 0} className={exportBtnClass} onClick={handleExportExcel}>
                            Excel
                        </button>
                        <button type="button" disabled={filtered.length === 0} className={exportBtnClass} onClick={handleExportPdfDialog}>
                            PDF
                        </button>
                        <button type="button" disabled={filtered.length === 0} className={exportBtnClass} onClick={handlePrint}>
                            Print
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            <tr>
                                <th className="w-9 py-2 pr-1 text-center">
                                    <input
                                        ref={headerCheckboxRef}
                                        type="checkbox"
                                        checked={filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id))}
                                        disabled={filtered.length === 0}
                                        onChange={toggleSelectAllFiltered}
                                        title="Select all rows in this table (current filter)"
                                        className="h-3.5 w-3.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange"
                                    />
                                </th>
                                <th className="w-10 py-2 pr-1 text-center">#</th>
                                <th className="py-2 pr-4">Order</th>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Type</th>
                                <th className="py-2 pr-4">Categories</th>
                                <th className="py-2 pr-4">Entities</th>
                                <th className="py-2 pr-4 text-right">Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <Fragment key={a.id}>
                                    <tr className="border-t border-zinc-100">
                                        <td className="py-3 pr-1 text-center align-middle">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(a.id)}
                                                onChange={() => toggleRowSelected(a.id)}
                                                aria-label={`Select ${a.name}`}
                                                className="h-3.5 w-3.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange"
                                            />
                                        </td>
                                        <td className="py-3 pr-1 text-center align-middle">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(a.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100"
                                                aria-expanded={expanded.has(a.id)}
                                                title={expanded.has(a.id) ? 'Collapse' : 'Expand values'}
                                            >
                                                <i className={`fa-solid fa-plus text-xs transition ${expanded.has(a.id) ? 'rotate-45' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="py-3 pr-4 text-zinc-600">{a.sort_order}</td>
                                        <td className="py-3 pr-4 font-semibold text-zinc-900">{a.name}</td>
                                        <td className="py-3 pr-4 text-zinc-600">{TYPE_LABELS[a.type] || a.type}</td>
                                        <td className="py-3 pr-4">
                                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                                {a.categories_count}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                                                {a.values_count}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-right">
                                            <div className="flex flex-wrap justify-end gap-1">
                                                <AdminTableIconAction variant="add" label="Add value" onClick={() => openAddValue(a.id)}>
                                                    <i className="fa-solid fa-plus text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction variant="view" label="View values" onClick={() => toggleExpand(a.id)}>
                                                    <i className="fa-regular fa-eye text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction variant="edit" label="Edit attribute" onClick={() => openEditAttr(a)}>
                                                    <i className="fa-solid fa-pen text-sm" />
                                                </AdminTableIconAction>
                                                <AdminTableIconAction variant="danger" label="Delete attribute" onClick={() => destroyAttribute(a)}>
                                                    <i className="fa-solid fa-trash text-sm" />
                                                </AdminTableIconAction>
                                            </div>
                                        </td>
                                    </tr>
                                    {expanded.has(a.id) && (
                                        <tr className="border-t border-zinc-50 bg-zinc-50/80">
                                            <td colSpan={8} className="px-4 py-3">
                                                {a.values?.length ? (
                                                    <table className="w-full text-xs">
                                                        <thead className="text-[10px] uppercase text-zinc-400">
                                                            <tr>
                                                                <th className="pb-2 pr-2 text-left">Image</th>
                                                                <th className="pb-2 pr-2 text-left">Value</th>
                                                                <th className="pb-2 pr-2 text-left">Order</th>
                                                                <th className="pb-2 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {a.values.map((v) => (
                                                                <tr key={v.id} className="border-t border-zinc-100">
                                                                    <td className="py-2 pr-2">
                                                                        {v.image ? (
                                                                            <img
                                                                                src={resolveMedia(v.image)}
                                                                                alt=""
                                                                                className="h-8 w-8 rounded border border-zinc-200 object-cover"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-zinc-400">—</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 pr-2 font-medium text-zinc-800">{v.value}</td>
                                                                    <td className="py-2 pr-2 text-zinc-600">{v.sort_order}</td>
                                                                    <td className="py-2 text-right">
                                                                        <span className="mr-2 inline-flex align-middle">
                                                                            <AdminTableIconAction variant="edit" label="Edit value" size="sm" onClick={() => openEditValue(v)}>
                                                                                <i className="fa-solid fa-pen" />
                                                                            </AdminTableIconAction>
                                                                        </span>
                                                                        <span className="inline-flex align-middle">
                                                                            <AdminTableIconAction variant="danger" label="Delete value" size="sm" onClick={() => destroyValue(v)}>
                                                                                <i className="fa-solid fa-trash" />
                                                                            </AdminTableIconAction>
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-xs text-zinc-500">No values yet. Use “+” to add one.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <p className="py-10 text-center text-sm text-zinc-400">
                            {attrList.length === 0 ? 'No attributes yet. Click “Add attribute” to create one.' : 'No matches for your search.'}
                        </p>
                    )}
                </div>

                {attrList.length > 0 && (
                    <div className="mt-3 flex justify-end border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
                        {search.trim()
                            ? `Showing ${filtered.length} of ${attrList.length} entries (filtered)`
                            : `1 to ${filtered.length} of ${attrList.length} entries`}
                    </div>
                )}
            </section>

            <AttributeModal attribute={attrForModal} categoryOptions={categoryOptions} show={attrModal !== null} onClose={closeAttrModal} />

            <AttributeValueModal
                valueRow={valueModal === 'new' ? null : valueModal}
                preselectAttributeId={valuePresetAttrId}
                attributes={attrList}
                show={valueModal !== null}
                onClose={closeValueModal}
            />
        </PanelLayout>
    );
}
