import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/FormComponents';

export default function Installer({ php_version, laravel_env }) {
    return (
        <AdminLayout title="Installer">
            <PageHeader title="Installer" />
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div className="text-sm text-gray-700">
                    This React/Inertia variant is already bootstrapped. This page is informational only.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="border rounded-xl p-4">
                        <div className="text-xs text-gray-500">PHP version</div>
                        <div className="font-semibold">{php_version}</div>
                    </div>
                    <div className="border rounded-xl p-4">
                        <div className="text-xs text-gray-500">APP_ENV</div>
                        <div className="font-semibold">{laravel_env}</div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

