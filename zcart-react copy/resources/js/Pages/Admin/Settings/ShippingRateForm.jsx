import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function ShippingRateForm({ shippingRate, zones = [] }) {
    const isEdit = !!shippingRate;
    const { data, setData, post, put, processing, errors } = useForm({
        shipping_zone_id: shippingRate?.shipping_zone_id ?? '',
        name: shippingRate?.name ?? '',
        rate: shippingRate?.rate ?? 0,
        min_order_amount: shippingRate?.min_order_amount ?? '',
        max_order_amount: shippingRate?.max_order_amount ?? '',
        active: shippingRate?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/shipping-rates/${shippingRate.id}`) : post('/admin/shipping-rates');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Shipping Rate' : 'Add Shipping Rate'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/shipping-rates" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Shipping Rate' : 'Add Shipping Rate'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Shipping Zone *" error={errors.shipping_zone_id}>
                        <Select value={data.shipping_zone_id} onChange={e => setData('shipping_zone_id', e.target.value)} error={errors.shipping_zone_id} disabled={isEdit}>
                            <option value="">Select zone</option>
                            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Standard" />
                    </FormField>

                    <FormField label="Rate *" error={errors.rate}>
                        <Input type="number" step="0.01" value={data.rate} onChange={e => setData('rate', e.target.value)} error={errors.rate} />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min order amount" error={errors.min_order_amount}>
                            <Input type="number" step="0.01" value={data.min_order_amount} onChange={e => setData('min_order_amount', e.target.value)} error={errors.min_order_amount} />
                        </FormField>
                        <FormField label="Max order amount" error={errors.max_order_amount}>
                            <Input type="number" step="0.01" value={data.max_order_amount} onChange={e => setData('max_order_amount', e.target.value)} error={errors.max_order_amount} />
                        </FormField>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/shipping-rates" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

