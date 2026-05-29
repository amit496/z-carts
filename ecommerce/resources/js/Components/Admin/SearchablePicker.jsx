import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Searchable dropdown — same markup/classes as Catalog → Sub-groups “Parent group” picker.
 *
 * @param {Array} items
 * @param {string} value - current selection (string from getValue, or '' for cleared)
 * @param {(v: string) => void} onChange
 * @param {(item: object) => string} [getValue]
 * @param {(item: object) => string} [getLabel]
 * @param {string} [buttonPlaceholder]
 * @param {string} [searchPlaceholder]
 * @param {string|null} [clearLabel] - if set, first row clears selection (value '')
 * @param {boolean} [error]
 */
export default function SearchablePicker({
    items = [],
    value = '',
    onChange,
    getValue = (item) => String(item.id),
    getLabel = (item) => item.name ?? '',
    buttonPlaceholder = 'Select…',
    searchPlaceholder = 'Search…',
    clearLabel = null,
    error = false,
    className = '',
}) {
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

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => String(getLabel(item)).toLowerCase().includes(q));
    }, [items, search, getLabel]);

    const selected = items.find((item) => getValue(item) === value);

    return (
        <div className={`relative ${className}`} ref={wrapRef}>
            <button
                type="button"
                onClick={() => {
                    setOpen((o) => {
                        if (!o) setSearch('');
                        return !o;
                    });
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm outline-none transition focus:border-brand-orange ${
                    error ? 'border-red-300' : 'border-zinc-200'
                } ${!value ? 'text-zinc-400' : 'text-zinc-800'}`}
            >
                <span className="truncate">{selected ? getLabel(selected) : buttonPlaceholder}</span>
                <i className={`fa-solid fa-chevron-down text-xs text-zinc-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-[60] mt-1 max-h-64 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl">
                    <div className="border-b border-zinc-100 p-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-brand-orange"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        {clearLabel != null && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange('');
                                        setOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-50"
                                >
                                    {clearLabel}
                                </button>
                            </li>
                        )}
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-xs text-zinc-400">No matches</li>
                        )}
                        {filtered.map((item) => {
                            const v = getValue(item);
                            const label = getLabel(item);
                            return (
                                <li key={item.id != null ? item.id : v}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(v);
                                            setOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                                            v === value ? 'bg-orange-50 font-semibold text-brand-orange' : 'text-zinc-700'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
