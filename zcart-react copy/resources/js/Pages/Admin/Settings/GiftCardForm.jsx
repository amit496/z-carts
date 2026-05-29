import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function GiftCardForm({ giftCard, shops = [] }) {
    const isEdit = !!giftCard;
    const { data, setData, post, put, processing, errors } = useForm({
        shop_id: giftCard?.shop_id ?? '',
        code: giftCard?.code ?? '',
        amount: giftCard?.amount ?? 0,
        balance: giftCard?.balance ?? '',
        expires_at: giftCard?.expires_at ?? '',
        active: giftCard?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/gift-cards/${giftCard.id}`) : post('/admin/gift-cards');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Gift Card' : 'Add Gift Card'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/gift-cards" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Gift Card' : 'Add Gift Card'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Shop *" error={errors.shop_id}>
                        <Select value={data.shop_id} onChange={e => setData('shop_id', e.target.value)} error={errors.shop_id} disabled={isEdit}>
                            <option value="">Select shop</option>
                            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Code (optional)" error={errors.code}>
                        <Input value={data.code} onChange={e => setData('code', e.target.value)} error={errors.code} placeholder="Leave blank to auto-generate" disabled={isEdit} />
                    </FormField>

                    <FormField label="Amount *" error={errors.amount}>
                        <Input type="number" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} error={errors.amount} />
                    </FormField>

                    <FormField label="Balance" error={errors.balance}>
                        <Input type="number" step="0.01" value={data.balance} onChange={e => setData('balance', e.target.value)} error={errors.balance} placeholder="Blank = same as amount" />
                    </FormField>

                    <FormField label="Expires at" error={errors.expires_at}>
                        <Input type="date" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} error={errors.expires_at} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/gift-cards" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

