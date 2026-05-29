import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton, PageHeader, Select } from '@/Components/FormComponents';

export default function TicketForm({ ticket }) {
    const isEdit = Boolean(ticket?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        subject: ticket?.subject ?? '',
        message: ticket?.message ?? '',
        customer_id: ticket?.customer_id ?? '',
        priority: ticket?.priority ?? 2,
        status: ticket?.status ?? 1,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) put(`/admin/tickets/${ticket.id}`);
        else post('/admin/tickets');
    }

    return (
        <AdminLayout title={isEdit ? `Edit Ticket #${ticket.id}` : 'New Ticket'}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={isEdit ? `Edit Ticket #${ticket.id}` : 'Create Ticket'} />
                <Link href="/admin/tickets" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="Subject" error={errors.subject}>
                    <Input value={data.subject} onChange={e => setData('subject', e.target.value)} />
                </FormField>

                <FormField label="Message" error={errors.message}>
                    <Textarea rows={8} value={data.message} onChange={e => setData('message', e.target.value)} />
                </FormField>

                <FormField label="Customer ID (optional)" error={errors.customer_id}>
                    <Input value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Priority" error={errors.priority}>
                        <Select
                            value={String(data.priority)}
                            onChange={e => setData('priority', Number(e.target.value))}
                            options={[
                                { value: '1', label: 'Low' },
                                { value: '2', label: 'Medium' },
                                { value: '3', label: 'High' },
                            ]}
                        />
                    </FormField>
                    <FormField label="Status" error={errors.status}>
                        <Select
                            value={String(data.status)}
                            onChange={e => setData('status', Number(e.target.value))}
                            options={[
                                { value: '1', label: 'Open' },
                                { value: '2', label: 'In Progress' },
                                { value: '3', label: 'Solved' },
                                { value: '4', label: 'Closed' },
                            ]}
                        />
                    </FormField>
                </div>

                <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
            </form>
        </AdminLayout>
    );
}

