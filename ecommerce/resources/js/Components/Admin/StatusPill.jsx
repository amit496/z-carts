const TONES = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-zinc-100 text-zinc-600',
    suspended: 'bg-rose-100 text-rose-700',
    banned: 'bg-rose-100 text-rose-700',
    confirmed: 'bg-sky-100 text-sky-700',
    processing: 'bg-violet-100 text-violet-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-amber-100 text-amber-700',
    featured: 'bg-indigo-100 text-indigo-700',
    normal: 'bg-zinc-100 text-zinc-600',
};

export default function StatusPill({ value = '', className = '' }) {
    const key = String(value || '').toLowerCase();
    const tone = TONES[key] || TONES.normal;

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${tone} ${className}`}>
            {value}
        </span>
    );
}
