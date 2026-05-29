import MerchantLayout from '@/Layouts/MerchantLayout';
import { useForm } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function MerchantSettings({ shop, taxes = [], carriers = [], shippingZones = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name:        shop?.name ?? '',
        email:       shop?.email ?? '',
        description: shop?.description ?? '',
    });

    return (
        <MerchantLayout title="Settings">
            <div className="max-w-2xl space-y-6">
                <h1 className="text-xl font-bold text-gray-800">Shop Settings</h1>

                {/* General */}
                <form onSubmit={e => { e.preventDefault(); put('/merchant/shop'); }} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <h2 className="font-semibold text-gray-700 border-b pb-2">General Info</h2>
                    <FormField label="Shop Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    </FormField>
                    <FormField label="Email" error={errors.email}>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </FormField>
                    <FormField label="Description" error={errors.description}>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border-gray-300" />
                    </FormField>
                    <SubmitButton processing={processing} label="Save Changes" />
                </form>

                {/* Taxes */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 border-b pb-2 mb-4">Taxes</h2>
                    {taxes.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Name</th><th className="pb-2">Rate</th><th className="pb-2">Status</th>
                            </tr></thead>
                            <tbody>
                                {taxes.map(t => (
                                    <tr key={t.id} className="border-b last:border-0">
                                        <td className="py-2">{t.name}</td>
                                        <td className="py-2 text-indigo-600 font-semibold">{t.rate}%</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${t.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p className="text-gray-400 text-sm">No taxes configured.</p>}
                </div>

                {/* Shipping Zones */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 border-b pb-2 mb-4">Shipping Zones</h2>
                    {shippingZones.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Zone</th><th className="pb-2">Status</th>
                            </tr></thead>
                            <tbody>
                                {shippingZones.map(z => (
                                    <tr key={z.id} className="border-b last:border-0">
                                        <td className="py-2">{z.name}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${z.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {z.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p className="text-gray-400 text-sm">No shipping zones configured.</p>}
                </div>

                {/* Carriers */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 border-b pb-2 mb-4">Carriers</h2>
                    {carriers.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Carrier</th><th className="pb-2">Tracking URL</th>
                            </tr></thead>
                            <tbody>
                                {carriers.map(c => (
                                    <tr key={c.id} className="border-b last:border-0">
                                        <td className="py-2">{c.name}</td>
                                        <td className="py-2 text-gray-400 text-xs truncate max-w-xs">{c.tracking_url ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p className="text-gray-400 text-sm">No carriers configured.</p>}
                </div>
            </div>
        </MerchantLayout>
    );
}
