import { Link } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Soft-tint fills + saturated icon colors (visible without hover). Tooltip via fixed portal so table overflow never clips it. */
const VARIANT_CLASS = {
    view: 'border-sky-300/80 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100',
    edit: 'border-orange-200 bg-orange-50 text-brand-orange hover:border-orange-300 hover:bg-orange-100',
    /** Activate/deactivate — same soft pill style as view/edit/star/delete (pastel tint, not filled). */
    toggleOn: 'border-green-300/80 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100',
    toggleOff: 'border-green-300/80 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100',
    featured: 'border-violet-300/80 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100',
    danger: 'border-red-300/90 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100',
    add: 'border-green-300/80 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100',
    restore: 'border-teal-300/80 bg-teal-50 text-teal-800 hover:border-teal-400 hover:bg-teal-100',
};

const SIZE_CLASS = {
    md: 'h-8 w-8 text-sm',
    sm: 'h-7 w-7 text-xs',
};

const BASE_BTN =
    'inline-flex shrink-0 items-center justify-center rounded-[3px] border font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/35';

export default function AdminTableIconAction({
    as: Comp = 'button',
    href,
    label,
    variant = 'view',
    onClick,
    className = '',
    children,
    size = 'md',
}) {
    const wrapRef = useRef(null);
    const [showTip, setShowTip] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const reposition = useCallback(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({ top: r.bottom + 6, left: r.left + r.width / 2 });
    }, []);

    useEffect(() => {
        if (!showTip) return;
        reposition();
        const handler = () => reposition();
        window.addEventListener('scroll', handler, true);
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('scroll', handler, true);
            window.removeEventListener('resize', handler);
        };
    }, [showTip, reposition]);

    const vCls = VARIANT_CLASS[variant] || VARIANT_CLASS.view;
    const sCls = SIZE_CLASS[size] || SIZE_CLASS.md;
    const btnClass = `${BASE_BTN} ${sCls} ${vCls} ${className}`.trim();

    const show = () => {
        reposition();
        setShowTip(true);
    };
    const hide = () => setShowTip(false);

    const tip =
        showTip &&
        typeof document !== 'undefined' &&
        createPortal(
            <span
                role="tooltip"
                style={{
                    position: 'fixed',
                    top: `${pos.top}px`,
                    left: `${pos.left}px`,
                    transform: 'translateX(-50%)',
                    zIndex: 2147483646,
                }}
                className="pointer-events-none max-w-[min(240px,90vw)] rounded-[3px] bg-zinc-900 px-2 py-1 text-center text-[10px] font-semibold leading-tight text-white shadow-lg ring-1 ring-black/20"
            >
                {label}
            </span>,
            document.body,
        );

    const shared = {
        'aria-label': label,
        title: label,
        className: btnClass,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
    };

    return (
        <>
            <span ref={wrapRef} className="inline-flex align-middle leading-none">
                {Comp === Link ? (
                    <Link href={href} {...shared}>
                        {children}
                    </Link>
                ) : (
                    <button type="button" onClick={onClick} {...shared}>
                        {children}
                    </button>
                )}
            </span>
            {tip}
        </>
    );
}
