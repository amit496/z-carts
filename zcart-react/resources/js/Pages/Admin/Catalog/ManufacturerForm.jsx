import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormField, Input, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function ManufacturerForm({ manufacturer }) {
    const isEdit = Boolean(manufacturer?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        name: manufacturer?.name ?? '',
        active: manufacturer?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(`/admin/manufacturers/${manufacturer.id}`);
        else post('/admin/manufacturers');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Manufacturer' : 'New Manufacturer'}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={isEdit ? 'Edit Manufacturer' : 'Create Manufacturer'} />
                <Link href="/admin/manufacturers" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="Name" error={errors.name}>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                </FormField>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={!!data.active} onChange={e => setData('active', e.target.checked)} />
                    Active
                </label>
                <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
            </form>
        </AdminLayout>
    );
}

