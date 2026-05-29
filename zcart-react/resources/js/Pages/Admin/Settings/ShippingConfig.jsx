import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormField, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function ShippingConfig({ json, zones_count, rates_count }) {
    const { data, setData, post, processing, errors } = useForm({
        json: json ?? '{}\n',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/shipping-config');
    }

    return (
        <AdminLayout title="Shipping Config">
            <PageHeader title="Shipping Config" />
            <div className="text-xs text-gray-500 mb-3">
                Zones: {zones_count} • Rates: {rates_count}
            </div>
            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="JSON" error={errors.json}>
                    <textarea
                        rows={14}
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

