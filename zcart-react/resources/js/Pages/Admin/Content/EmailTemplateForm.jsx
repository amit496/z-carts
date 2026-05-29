import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function EmailTemplateForm({ template }) {
    const isEdit = Boolean(template?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        name: template?.name ?? '',
        slug: template?.slug ?? '',
        subject: template?.subject ?? '',
        body: template?.body ?? '',
        active: template?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(`/admin/email-templates/${template.id}`);
        else post('/admin/email-templates');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Email Template' : 'New Email Template'}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={isEdit ? 'Edit Email Template' : 'Create Email Template'} />
                <Link href="/admin/email-templates" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="Name" error={errors.name}>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Slug" error={errors.slug}>
                    <Input value={data.slug} onChange={e => setData('slug', e.target.value)} />
                </FormField>
                <FormField label="Subject" error={errors.subject}>
                    <Input value={data.subject} onChange={e => setData('subject', e.target.value)} />
                </FormField>
                <FormField label="Body" error={errors.body}>
                    <Textarea rows={10} value={data.body} onChange={e => setData('body', e.target.value)} />
                </FormField>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={!!data.active} onChange={e => setData('active', e.target.checked)} />
                    Active
                </label>
                <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
            </form>
        </AdminLayout>
    );
}

