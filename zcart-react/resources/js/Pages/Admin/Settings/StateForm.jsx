import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function StateForm({ state, countries = [] }) {
    const isEdit = !!state;
    const { data, setData, post, put, processing, errors } = useForm({
        country_id: state?.country_id ?? '',
        name: state?.name ?? '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/states/${state.id}`) : post('/admin/states');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit State' : 'Add State'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/states" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit State' : 'Add State'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Country *" error={errors.country_id}>
                        <Select value={data.country_id} onChange={e => setData('country_id', e.target.value)} error={errors.country_id} disabled={isEdit}>
                            <option value="">Select country</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="California" />
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/states" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

