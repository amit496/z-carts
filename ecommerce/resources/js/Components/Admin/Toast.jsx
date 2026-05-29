import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const msg = flash?.success ?? flash?.error;
        if (msg) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), flash?.error ? 5200 : 3000);
            return () => clearTimeout(t);
        }
        setVisible(false);
    }, [flash?.success, flash?.error]);

    if (!visible) return null;
    const err = !!flash?.error;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[3px] px-4 py-3 text-sm font-medium shadow-lg ${
                err ? 'bg-red-900 text-white' : 'bg-zinc-900 text-white'
            }`}
        >
            <i className={`fa-solid ${err ? 'fa-circle-exclamation text-red-300' : 'fa-circle-check text-emerald-400'}`} />
            {err ? flash.error : flash.success}
        </div>
    );
}
