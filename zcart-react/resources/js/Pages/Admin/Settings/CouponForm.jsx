import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function CouponForm({ coupon }) {
    const isEdit = !!coupon;
    const { data, setData, post, put, processing, errors } = useForm({
        code: coupon?.code ?? '',
        type: coupon?.type ?? 'percentage',
        value: coupon?.value ?? 0,
        min_order_amount: coupon?.min_order_amount ?? '',
        max_uses: coupon?.max_uses ?? '',
        starting_time: coupon?.starting_time ?? '',
        ending_time: coupon?.ending_time ?? '',
        active: coupon?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/coupons/${coupon.id}`) : post('/admin/coupons');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Coupon' : 'Add Coupon'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/coupons" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Coupon' : 'Add Coupon'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Code *" error={errors.code}>
                        <Input value={data.code} onChange={e => setData('code', e.target.value)} error={errors.code} placeholder="SAVE10" disabled={isEdit} />
                    </FormField>

                    <FormField label="Type" error={errors.type}>
                        <Select value={data.type} onChange={e => setData('type', e.target.value)} error={errors.type}>
                            <option value="percentage">percentage</option>
                            <option value="amount">amount</option>
                        </Select>
                    </FormField>

                    <FormField label="Value *" error={errors.value}>
                        <Input type="number" value={data.value} onChange={e => setData('value', e.target.value)} error={errors.value} />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Min order amount" error={errors.min_order_amount}>
                            <Input type="number" value={data.min_order_amount} onChange={e => setData('min_order_amount', e.target.value)} error={errors.min_order_amount} />
                        </FormField>
                        <FormField label="Max uses" error={errors.max_uses}>
                            <Input type="number" value={data.max_uses} onChange={e => setData('max_uses', e.target.value)} error={errors.max_uses} />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start time" error={errors.starting_time}>
                            <Input type="datetime-local" value={data.starting_time} onChange={e => setData('starting_time', e.target.value)} error={errors.starting_time} />
                        </FormField>
                        <FormField label="End time" error={errors.ending_time}>
                            <Input type="datetime-local" value={data.ending_time} onChange={e => setData('ending_time', e.target.value)} error={errors.ending_time} />
                        </FormField>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/coupons" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

