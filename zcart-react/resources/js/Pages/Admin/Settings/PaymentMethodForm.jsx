import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function PaymentMethodForm({ paymentMethod }) {
    const isEdit = !!paymentMethod;
    const { data, setData, post, put, processing, errors } = useForm({
        name: paymentMethod?.name ?? '',
        code: paymentMethod?.code ?? '',
        type: paymentMethod?.type ?? 'online',
        order: paymentMethod?.order ?? 0,
        active: paymentMethod?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/payment-methods/${paymentMethod.id}`) : post('/admin/payment-methods');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Payment Method' : 'Add Payment Method'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/payment-methods" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Payment Method' : 'Add Payment Method'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Cash on delivery" />
                    </FormField>

                    <FormField label="Code *" error={errors.code}>
                        <Input value={data.code} onChange={e => setData('code', e.target.value)} error={errors.code} placeholder="cod" disabled={isEdit} />
                    </FormField>

                    <FormField label="Type" error={errors.type}>
                        <Select value={data.type} onChange={e => setData('type', e.target.value)} error={errors.type}>
                            <option value="online">online</option>
                            <option value="manual">manual</option>
                        </Select>
                    </FormField>

                    <FormField label="Order" error={errors.order}>
                        <Input type="number" value={data.order} onChange={e => setData('order', e.target.value)} error={errors.order} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/payment-methods" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

