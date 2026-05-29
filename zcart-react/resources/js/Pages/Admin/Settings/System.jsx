import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/FormComponents';

export default function System({ info }) {
    return (
        <AdminLayout title="System">
            <PageHeader title="System" />
            <div className="bg-white rounded-2xl shadow p-6 max-w-xl space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">PHP</span>: {info?.php}</p>
                <p><span className="font-semibold">Laravel</span>: {info?.laravel}</p>
                <p><span className="font-semibold">DB driver</span>: {info?.db_driver}</p>
            </div>
        </AdminLayout>
    );
}

