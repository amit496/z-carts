export default function StatCard({ label, value, hint, icon, tone = 'bg-white text-zinc-900', accent = 'text-brand-orange' }) {
    return (
        <div className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">{label}</p>
                    <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
                    {hint && <p className="mt-1 text-[11px] text-zinc-500">{hint}</p>}
                </div>
                {icon && (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-[3px] bg-zinc-50 ${accent}`}>
                        <i className={`fa-solid ${icon}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
