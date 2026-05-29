import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function BlogForm({ blog }) {
    const isEdit = Boolean(blog?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        title: blog?.title ?? '',
        content: blog?.content ?? '',
        active: blog?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(`/admin/blogs/${blog.id}`);
        else post('/admin/blogs');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Blog' : 'New Blog'}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={isEdit ? 'Edit Blog Post' : 'Create Blog Post'} />
                <Link href="/admin/blogs" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="Title" error={errors.title}>
                    <Input value={data.title} onChange={e => setData('title', e.target.value)} />
                </FormField>
                <FormField label="Content" error={errors.content}>
                    <Textarea rows={10} value={data.content} onChange={e => setData('content', e.target.value)} />
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

