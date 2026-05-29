export default function SectionHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-4 flex flex-col gap-2 border-b border-zinc-100 pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-[16px] font-semibold text-zinc-900">{title}</h2>
                {subtitle && <p className="mt-1 text-[11px] text-zinc-500">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}
