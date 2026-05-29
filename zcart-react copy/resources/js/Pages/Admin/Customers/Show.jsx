import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function CustomerShow({ customer }) {
    return (
        <AdminLayout title={customer.name}>
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/customers" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Customers</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Customer Info</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                ['Name', customer.name],
                                ['Email', customer.email],
                                ['Phone', customer.phone],
                                ['Date of Birth', customer.dob],
                                ['Gender', customer.sex],
                                ['Verified', customer.verification_token == null ? '✓ Yes' : '✗ No'],
                                ['Accepts Marketing', customer.accepts_marketing ? 'Yes' : 'No'],
                                ['Joined', customer.created_at],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-gray-400 text-xs">{label}</p>
                                    <p className="font-medium text-gray-700">{value ?? '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-4">Recent Orders</h2>
                        {customer.orders?.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-gray-400 border-b">
                                    <th className="pb-2">Order #</th>
                                    <th className="pb-2">Total</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Date</th>
                                </tr></thead>
                                <tbody>
                                    {customer.orders.slice(0, 5).map(o => (
                                        <tr key={o.id} className="border-b last:border-0">
                                            <td className="py-2 text-indigo-600">
                                                <Link href={`/admin/orders/${o.id}`}>#{o.order_number}</Link>
                                            </td>
                                            <td className="py-2 font-semibold">${o.grand_total}</td>
                                            <td className="py-2">{o.order_status_id}</td>
                                            <td className="py-2 text-gray-400 text-xs">{o.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-400 text-sm">No orders yet.</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-4">Actions</h2>
                        <div className="space-y-2">
                            <button onClick={() => router.patch(`/admin/customers/${customer.id}/toggle`)}
                                className={`w-full py-2 rounded-lg text-sm font-medium transition ${customer.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {customer.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => { if (confirm('Delete this customer?')) router.delete(`/admin/customers/${customer.id}`); }}
                                className="w-full py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                                Delete Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
