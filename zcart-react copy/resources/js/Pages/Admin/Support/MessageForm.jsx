import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function MessageForm({ messageItem }) {
    const isEdit = !!messageItem;
    const { data, setData, post, put, processing, errors } = useForm({
        subject: messageItem?.subject ?? '',
        message: messageItem?.message ?? '',
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/messages/${messageItem.id}`) : post('/admin/messages');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Message' : 'Add Message'}>
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/messages" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Message' : 'Add Message'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Subject" error={errors.subject}>
                        <Input value={data.subject} onChange={e => setData('subject', e.target.value)} error={errors.subject} />
                    </FormField>
                    <FormField label="Message *" error={errors.message}>
                        <Textarea rows={6} value={data.message} onChange={e => setData('message', e.target.value)} error={errors.message} />
                    </FormField>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/messages" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

