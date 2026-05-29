import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/FormComponents';

export default function TicketShow({ ticket }) {
    return (
        <AdminLayout title={`Ticket #${ticket.id}`}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={`Ticket #${ticket.id}`} />
                <Link href="/admin/tickets" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-3 text-sm">
                <div><span className="text-gray-500">Subject:</span> <span className="font-semibold">{ticket.subject}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="font-semibold">{ticket.status}</span></div>
                <div><span className="text-gray-500">Priority:</span> <span className="font-semibold">{ticket.priority}</span></div>
                <div><span className="text-gray-500">Customer:</span> <span className="font-semibold">{ticket.customer_id ? `Customer #${ticket.customer_id}` : '—'}</span></div>
                <div className="pt-2 border-t">
                    <div className="text-gray-500 text-xs mb-1">Message</div>
                    <div className="whitespace-pre-wrap text-gray-800">{ticket.message ?? '—'}</div>
                </div>
            </div>
        </AdminLayout>
    );
}

