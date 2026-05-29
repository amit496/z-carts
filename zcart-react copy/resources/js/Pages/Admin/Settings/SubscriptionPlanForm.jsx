import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function SubscriptionPlanForm({ subscriptionPlan }) {
    const isEdit = !!subscriptionPlan;
    const { data, setData, post, put, processing, errors } = useForm({
        name: subscriptionPlan?.name ?? '',
        plan_id: subscriptionPlan?.plan_id ?? '',
        price: subscriptionPlan?.price ?? 0,
        interval: subscriptionPlan?.interval ?? 'month',
        inventory_limit: subscriptionPlan?.inventory_limit ?? '',
        team_size: subscriptionPlan?.team_size ?? '',
        active: subscriptionPlan?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/subscription-plans/${subscriptionPlan.id}`) : post('/admin/subscription-plans');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Subscription Plan' : 'Add Subscription Plan'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/subscription-plans" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Subscription Plan' : 'Add Subscription Plan'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    </FormField>

                    <FormField label="Plan ID *" error={errors.plan_id}>
                        <Input value={data.plan_id} onChange={e => setData('plan_id', e.target.value)} error={errors.plan_id} disabled={isEdit} placeholder="price_..." />
                    </FormField>

                    <FormField label="Price *" error={errors.price}>
                        <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} error={errors.price} />
                    </FormField>

                    <FormField label="Interval" error={errors.interval}>
                        <Select value={data.interval} onChange={e => setData('interval', e.target.value)} error={errors.interval}>
                            <option value="month">month</option>
                            <option value="year">year</option>
                        </Select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Inventory limit" error={errors.inventory_limit}>
                            <Input type="number" value={data.inventory_limit} onChange={e => setData('inventory_limit', e.target.value)} error={errors.inventory_limit} placeholder="blank = unlimited" />
                        </FormField>
                        <FormField label="Team size" error={errors.team_size}>
                            <Input type="number" value={data.team_size} onChange={e => setData('team_size', e.target.value)} error={errors.team_size} placeholder="blank = unlimited" />
                        </FormField>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/subscription-plans" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

