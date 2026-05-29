import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome() {
    useEffect(() => { window.location.href = '/'; }, []);
    return <Head title="ZMarket" />;
}
