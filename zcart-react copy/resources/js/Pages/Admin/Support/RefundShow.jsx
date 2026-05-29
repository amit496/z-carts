import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/FormComponents';

export default function RefundShow({ refund }) {
    return (
        <AdminLayout title={`Refund #${refund.id}`}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={`Refund #${refund.id}`} />
                <Link href="/admin/refunds" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-3 text-sm">
                <div><span className="text-gray-500">Order:</span> <span className="font-semibold">{refund.order_number ?? '—'}</span></div>
                <div><span className="text-gray-500">Shop:</span> <span className="font-semibold">{refund.shop ?? '—'}</span></div>
                <div><span className="text-gray-500">Customer:</span> <span className="font-semibold">{refund.customer ?? '—'}</span></div>
                <div><span className="text-gray-500">Amount:</span> <span className="font-semibold">${Number(refund.amount ?? 0).toFixed(2)}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="font-semibold">{refund.status ?? '—'}</span></div>
                <div><span className="text-gray-500">Created:</span> <span className="font-semibold">{refund.created_at ?? '—'}</span></div>
                <div className="pt-2 border-t">
                    <div className="text-gray-500 text-xs mb-1">Reason</div>
                    <div className="whitespace-pre-wrap text-gray-800">{refund.reason ?? '—'}</div>
                </div>
            </div>
        </AdminLayout>
    );
}

