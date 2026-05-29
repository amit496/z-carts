import MerchantLayout from '@/Layouts/MerchantLayout';
import { useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function MerchantShopShow({ shop }) {
    const { data, setData, put, processing, errors } = useForm({
        name:        shop.name ?? '',
        email:       shop.email ?? '',
        description: shop.description ?? '',
    });

    return (
        <MerchantLayout title="My Shop">
            <div className="max-w-2xl">
                <h1 className="text-xl font-bold text-gray-800 mb-6">Shop Settings</h1>

                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">🏪</div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">{shop.name}</h2>
                            <p className="text-sm text-gray-400">{shop.email}</p>
                            <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${shop.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {shop.active ? 'Active' : 'Inactive'}
                                </span>
                                {shop.id_verified && shop.phone_verified && shop.address_verified && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">✓ Verified</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={e => { e.preventDefault(); put('/merchant/shop'); }} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <h2 className="font-semibold text-gray-700">Edit Shop Info</h2>
                    <FormField label="Shop Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name}/>
                    </FormField>
                    <FormField label="Email" error={errors.email}>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)}/>
                    </FormField>
                    <FormField label="Description" error={errors.description}>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} placeholder="Tell customers about your shop..."/>
                    </FormField>
                    <SubmitButton processing={processing} label="Save Changes"/>
                </form>
            </div>
        </MerchantLayout>
    );
}
