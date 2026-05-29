import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function FaqForm({ faq }) {
    const isEdit = Boolean(faq?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        question: faq?.question ?? '',
        answer: faq?.answer ?? '',
        order: faq?.order ?? '',
        active: faq?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(`/admin/faqs/${faq.id}`);
        else post('/admin/faqs');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit FAQ' : 'New FAQ'}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={isEdit ? 'Edit FAQ' : 'Create FAQ'} />
                <Link href="/admin/faqs" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="Question" error={errors.question}>
                    <Input value={data.question} onChange={e => setData('question', e.target.value)} />
                </FormField>
                <FormField label="Answer" error={errors.answer}>
                    <Textarea rows={8} value={data.answer} onChange={e => setData('answer', e.target.value)} />
                </FormField>
                <FormField label="Order" error={errors.order}>
                    <Input value={data.order} onChange={e => setData('order', e.target.value)} />
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

