import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminSystem({ config }) {
    const rows = [
        ['App Name', config.app_name],
        ['Environment', config.app_env],
        ['Debug Mode', config.app_debug ? 'Enabled' : 'Disabled'],
        ['Database Driver', config.db_driver],
        ['Cache Driver', config.cache_driver],
        ['Queue Driver', config.queue_driver],
        ['Mail Driver', config.mail_mailer],
        ['PHP Version', config.php_version],
        ['Laravel Version', config.laravel_ver],
    ];

    return (
        <PanelLayout title="System Settings" subtitle="Platform configuration and environment info.">
            <Head title="System Settings — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="System Configuration" subtitle="Read-only environment and configuration values." />
                <div className="mt-2 divide-y divide-zinc-100">
                    {rows.map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between py-3 text-sm">
                            <span className="text-zinc-500">{key}</span>
                            <span className={`font-semibold font-mono ${
                                val === 'Enabled' ? 'text-rose-600' :
                                val === 'Disabled' ? 'text-emerald-600' :
                                'text-zinc-900'
                            }`}>{val}</span>
                        </div>
                    ))}
                </div>
            </section>
        </PanelLayout>
    );
}
