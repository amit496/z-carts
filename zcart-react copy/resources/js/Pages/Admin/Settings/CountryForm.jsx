import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, SubmitButton } from '@/Components/FormComponents';

export default function CountryForm({ country }) {
    const isEdit = !!country;
    const { data, setData, post, put, processing, errors } = useForm({
        name: country?.name ?? '',
        iso_3166_2: country?.iso_3166_2 ?? '',
        active: country?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/countries/${country.id}`) : post('/admin/countries');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Country' : 'Add Country'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/countries" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Country' : 'Add Country'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    </FormField>
                    <FormField label="ISO (2 letters) *" error={errors.iso_3166_2}>
                        <Input value={data.iso_3166_2} onChange={e => setData('iso_3166_2', e.target.value.toUpperCase())} error={errors.iso_3166_2} disabled={isEdit} placeholder="US" />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/countries" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

