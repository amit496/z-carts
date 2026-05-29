import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, SubmitButton } from '@/Components/FormComponents';

export default function CurrencyForm({ currency }) {
    const isEdit = !!currency;
    const { data, setData, post, put, processing, errors } = useForm({
        name: currency?.name ?? '',
        iso_code: currency?.iso_code ?? '',
        symbol: currency?.symbol ?? '',
        exchange_rate: currency?.exchange_rate ?? 1,
        active: currency?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/currencies/${currency.id}`) : post('/admin/currencies');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Currency' : 'Add Currency'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/currencies" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Currency' : 'Add Currency'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="US Dollar" />
                    </FormField>
                    <FormField label="ISO Code (3 letters) *" error={errors.iso_code}>
                        <Input value={data.iso_code} onChange={e => setData('iso_code', e.target.value.toUpperCase())} error={errors.iso_code} placeholder="USD" disabled={isEdit} />
                    </FormField>
                    <FormField label="Symbol *" error={errors.symbol}>
                        <Input value={data.symbol} onChange={e => setData('symbol', e.target.value)} error={errors.symbol} placeholder="$" />
                    </FormField>
                    <FormField label="Exchange rate *" error={errors.exchange_rate}>
                        <Input type="number" step="0.0001" value={data.exchange_rate} onChange={e => setData('exchange_rate', e.target.value)} error={errors.exchange_rate} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/currencies" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

