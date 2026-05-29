import { useEffect, useRef, useState } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = 'max-w-2xl',
    closeable = true,
    onClose = () => {},
    onClosed,
    title,
}) {
    const ENTER_DELAY_MS = 10;
    const TRANSITION_MS = 300;

    const [mounted, setMounted] = useState(show);
    const [open, setOpen] = useState(false);
    const enterTimerRef = useRef(null);
    const exitTimerRef = useRef(null);

    const scheduleEnter = () => {
        clearTimeout(enterTimerRef.current);
        enterTimerRef.current = setTimeout(() => setOpen(true), ENTER_DELAY_MS);
    };

    const scheduleExit = (after) => {
        clearTimeout(exitTimerRef.current);
        setOpen(false);
        exitTimerRef.current = setTimeout(() => {
            setMounted(false);
            after?.();
        }, TRANSITION_MS);
    };

    useEffect(() => {
        clearTimeout(enterTimerRef.current);
        clearTimeout(exitTimerRef.current);

        if (show) {
            setMounted(true);
            scheduleEnter();
            return () => clearTimeout(enterTimerRef.current);
        }

        if (!mounted) return undefined;

        // Parent set show=false: animate out before unmounting.
        scheduleExit(() => {
            clearTimeout(enterTimerRef.current);
            onClosed?.();
        });

        return () => clearTimeout(exitTimerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const requestClose = () => {
        if (!closeable) return;
        onClose();
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center overflow-y-auto px-4 py-12 transition-all duration-300 ease-out ${open ? 'bg-black/50' : 'bg-transparent'}`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) requestClose();
            }}
        >
            <div
                className={`w-full ${maxWidth} h-fit rounded-xl bg-white shadow-2xl transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'}`}
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b px-5 py-4 sticky top-0 bg-white rounded-t-xl z-10">
                    <h3 className="font-bold text-zinc-800">{title}</h3>
                    <button type="button" onClick={requestClose} className="text-zinc-400 hover:text-zinc-600 transition">
                        <i className="fa-solid fa-xmark text-lg" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
