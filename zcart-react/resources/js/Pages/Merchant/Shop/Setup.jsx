import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function ShopSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', description: '',
    });

    return (
        <MainLayout>
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <p className="text-4xl mb-3">🏪</p>
                        <h1 className="text-2xl font-bold text-gray-800">Create Your Shop</h1>
                        <p className="text-gray-500 text-sm mt-2">Set up your merchant store to start selling</p>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); post('/merchant/setup'); }} className="bg-white rounded-2xl shadow p-8 space-y-5">
                        <FormField label="Shop Name *" error={errors.name}>
                            <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="My Awesome Store"/>
                        </FormField>
                        <FormField label="Business Email *" error={errors.email}>
                            <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} placeholder="shop@example.com"/>
                        </FormField>
                        <FormField label="Description" error={errors.description}>
                            <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} placeholder="Tell customers about your shop..."/>
                        </FormField>
                        <SubmitButton processing={processing} label="Create Shop" loadingLabel="Creating..."/>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
