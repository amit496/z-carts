import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function AttributeValueForm({ attributeValue, attributes = [] }) {
    const isEdit = !!attributeValue;
    const { data, setData, post, put, processing, errors } = useForm({
        attribute_id: attributeValue?.attribute_id ?? '',
        value: attributeValue?.value ?? '',
        color: attributeValue?.color ?? '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/attribute-values/${attributeValue.id}`) : post('/admin/attribute-values');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Attribute Value' : 'Add Attribute Value'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/attribute-values" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Attribute Value' : 'Add Attribute Value'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Attribute *" error={errors.attribute_id}>
                        <Select value={data.attribute_id} onChange={e => setData('attribute_id', e.target.value)} error={errors.attribute_id} disabled={isEdit}>
                            <option value="">Select attribute</option>
                            {attributes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Value *" error={errors.value}>
                        <Input value={data.value} onChange={e => setData('value', e.target.value)} error={errors.value} />
                    </FormField>

                    <FormField label="Color (optional)" error={errors.color}>
                        <Input value={data.color} onChange={e => setData('color', e.target.value)} error={errors.color} placeholder="#ff0000" />
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/attribute-values" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

