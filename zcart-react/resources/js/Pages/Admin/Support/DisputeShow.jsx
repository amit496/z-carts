import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/FormComponents';

export default function DisputeShow({ dispute }) {
    return (
        <AdminLayout title={`Dispute #${dispute.id}`}>
            <div className="flex items-center justify-between mb-4">
                <PageHeader title={`Dispute #${dispute.id}`} />
                <Link href="/admin/disputes" className="text-sm text-indigo-600 hover:underline">Back</Link>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-3 text-sm">
                <div><span className="text-gray-500">Order:</span> <span className="font-semibold">{dispute.order_number ?? '—'}</span></div>
                <div><span className="text-gray-500">Shop:</span> <span className="font-semibold">{dispute.shop ?? '—'}</span></div>
                <div><span className="text-gray-500">Customer:</span> <span className="font-semibold">{dispute.customer ?? '—'}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className="font-semibold">{dispute.status ?? '—'}</span></div>
                <div><span className="text-gray-500">Created:</span> <span className="font-semibold">{dispute.created_at ?? '—'}</span></div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => router.patch(`/admin/disputes/${dispute.id}`, { status: 2 })}
                        className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                    >
                        Set Under Review
                    </button>
                    <button
                        onClick={() => router.patch(`/admin/disputes/${dispute.id}`, { status: 3 })}
                        className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                    >
                        Mark Solved
                    </button>
                    <button
                        onClick={() => router.patch(`/admin/disputes/${dispute.id}`, { status: 4 })}
                        className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
                <div className="pt-2 border-t">
                    <div className="text-gray-500 text-xs mb-1">Description</div>
                    <div className="whitespace-pre-wrap text-gray-800">{dispute.description ?? '—'}</div>
                </div>
            </div>
        </AdminLayout>
    );
}

