import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, SubmitButton } from '@/Components/FormComponents';

export default function RoleForm({ role }) {
    const isEdit = !!role;
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
        level: role?.level ?? '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/roles/${role.id}`) : post('/admin/roles');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Role' : 'Add Role'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/roles" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Role' : 'Add Role'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    </FormField>
                    <FormField label="Level" error={errors.level}>
                        <Input type="number" value={data.level} onChange={e => setData('level', e.target.value)} error={errors.level} placeholder="Optional" />
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/roles" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

