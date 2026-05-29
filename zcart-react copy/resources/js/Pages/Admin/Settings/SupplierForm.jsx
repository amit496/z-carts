import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function SupplierForm({ supplier, shops = [] }) {
    const isEdit = !!supplier;
    const { data, setData, post, put, processing, errors } = useForm({
        shop_id: supplier?.shop_id ?? '',
        name: supplier?.name ?? '',
        email: supplier?.email ?? '',
        phone: supplier?.phone ?? '',
        active: supplier?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/suppliers/${supplier.id}`) : post('/admin/suppliers');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Supplier' : 'Add Supplier'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/suppliers" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Shop *" error={errors.shop_id}>
                        <Select value={data.shop_id} onChange={e => setData('shop_id', e.target.value)} error={errors.shop_id} disabled={isEdit}>
                            <option value="">Select shop</option>
                            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    </FormField>

                    <FormField label="Email" error={errors.email}>
                        <Input value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                    </FormField>

                    <FormField label="Phone" error={errors.phone}>
                        <Input value={data.phone} onChange={e => setData('phone', e.target.value)} error={errors.phone} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/suppliers" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

