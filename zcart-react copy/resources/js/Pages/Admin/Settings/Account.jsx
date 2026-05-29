import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormField, Input, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function Account({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put('/admin/account');
    }

    return (
        <AdminLayout title="Account">
            <PageHeader title="Account" />
            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5 max-w-xl">
                <FormField label="Name *" error={errors.name}>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                </FormField>
                <FormField label="Email *" error={errors.email}>
                    <Input value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                </FormField>
                <FormField label="New password" error={errors.password}>
                    <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} />
                </FormField>
                <FormField label="Confirm password" error={errors.password_confirmation}>
                    <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} error={errors.password_confirmation} />
                </FormField>
                <SubmitButton processing={processing} label="Save" />
            </form>
        </AdminLayout>
    );
}

