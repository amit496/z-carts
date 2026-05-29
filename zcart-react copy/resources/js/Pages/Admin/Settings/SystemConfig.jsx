import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormField, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function SystemConfigPage({ json }) {
    const { data, setData, post, processing, errors } = useForm({
        json: json ?? '{}\n',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/system-config');
    }

    return (
        <AdminLayout title="System Config">
            <PageHeader title="System Config" />
            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="JSON" error={errors.json}>
                    <textarea
                        rows={16}
                        value={data.json}
                        onChange={e => setData('json', e.target.value)}
                        className={`w-full font-mono text-xs border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.json ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                </FormField>
                <SubmitButton processing={processing} label="Save" />
            </form>
        </AdminLayout>
    );
}

