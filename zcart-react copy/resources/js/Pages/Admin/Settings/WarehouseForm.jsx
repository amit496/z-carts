import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function WarehouseForm({ warehouse, shops = [] }) {
    const isEdit = !!warehouse;
    const { data, setData, post, put, processing, errors } = useForm({
        shop_id: warehouse?.shop_id ?? '',
        name: warehouse?.name ?? '',
        opening_time: warehouse?.opening_time ?? '',
        closing_time: warehouse?.closing_time ?? '',
        pickup_instruction: warehouse?.pickup_instruction ?? '',
        pickup_enabled: warehouse?.pickup_enabled ?? false,
        active: warehouse?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/warehouses/${warehouse.id}`) : post('/admin/warehouses');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Warehouse' : 'Add Warehouse'}>
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/warehouses" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Warehouse' : 'Add Warehouse'}</h1>
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Opening time" error={errors.opening_time}>
                            <Input type="time" value={data.opening_time} onChange={e => setData('opening_time', e.target.value)} error={errors.opening_time} />
                        </FormField>
                        <FormField label="Closing time" error={errors.closing_time}>
                            <Input type="time" value={data.closing_time} onChange={e => setData('closing_time', e.target.value)} error={errors.closing_time} />
                        </FormField>
                    </div>

                    <FormField label="Pickup instruction" error={errors.pickup_instruction}>
                        <Textarea rows={4} value={data.pickup_instruction} onChange={e => setData('pickup_instruction', e.target.value)} error={errors.pickup_instruction} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.pickup_enabled} onChange={e => setData('pickup_enabled', e.target.checked)} className="rounded" />
                        Pickup enabled
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/warehouses" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

