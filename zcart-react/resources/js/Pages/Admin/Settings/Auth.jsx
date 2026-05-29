import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/FormComponents';

export default function AuthSettings({ info }) {
    return (
        <AdminLayout title="Auth">
            <PageHeader title="Auth" />
            <div className="bg-white rounded-2xl shadow p-6 max-w-xl space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Login</span>: {info?.login}</p>
                <p><span className="font-semibold">Logout</span>: {info?.logout}</p>
                <p className="text-gray-500 text-xs">This project uses the common auth routes for admin as well.</p>
            </div>
        </AdminLayout>
    );
}

