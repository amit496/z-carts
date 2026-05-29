import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function TaxForm({ tax, shops = [] }) {
    const isEdit = !!tax;
    const { data, setData, post, put, processing, errors } = useForm({
        name: tax?.name ?? '',
        rate: tax?.rate ?? 0,
        shop_id: tax?.shop_id ?? '',
        active: tax?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/taxes/${tax.id}`) : post('/admin/taxes');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Tax' : 'Add Tax'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/taxes" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Tax' : 'Add Tax'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="VAT" />
                    </FormField>

                    <FormField label="Rate (%) *" error={errors.rate}>
                        <Input type="number" value={data.rate} onChange={e => setData('rate', e.target.value)} error={errors.rate} />
                    </FormField>

                    <FormField label="Shop (optional)" error={errors.shop_id}>
                        <Select value={data.shop_id} onChange={e => setData('shop_id', e.target.value)} error={errors.shop_id}>
                            <option value="">Platform</option>
                            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/taxes" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

