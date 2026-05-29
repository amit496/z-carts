import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function CarrierForm({ carrier, shops = [] }) {
    const isEdit = !!carrier;
    const { data, setData, post, put, processing, errors } = useForm({
        name: carrier?.name ?? '',
        tracking_url: carrier?.tracking_url ?? '',
        shop_id: carrier?.shop_id ?? '',
        active: carrier?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/carriers/${carrier.id}`) : post('/admin/carriers');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Carrier' : 'Add Carrier'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/carriers" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Carrier' : 'Add Carrier'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="FedEx" />
                    </FormField>

                    <FormField label="Tracking URL" error={errors.tracking_url}>
                        <Input value={data.tracking_url} onChange={e => setData('tracking_url', e.target.value)} error={errors.tracking_url} placeholder="https://tracking.example.com/{tracking_id}" />
                    </FormField>

                    <FormField label="Shop *" error={errors.shop_id}>
                        <Select value={data.shop_id} onChange={e => setData('shop_id', e.target.value)} error={errors.shop_id} disabled={isEdit}>
                            <option value="">Select shop</option>
                            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/carriers" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

