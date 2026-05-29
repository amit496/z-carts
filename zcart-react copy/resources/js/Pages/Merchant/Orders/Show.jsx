import MerchantLayout from '@/Layouts/MerchantLayout';
import { Link, router } from '@inertiajs/react';

const orderStatuses = {1:'Pending',2:'Payment Error',3:'Confirmed',4:'Fulfilled',5:'Awaiting Delivery',6:'Delivered',7:'Returned',8:'Cancelled'};

export default function MerchantOrderShow({ order }) {
    return (
        <MerchantLayout title={`Order #${order.order_number}`}>
            <div className="flex items-center gap-3 mb-6">
                <Link href="/merchant/orders" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Orders</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-4">Order Items</h2>
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Product</th><th className="pb-2">Qty</th><th className="pb-2">Price</th><th className="pb-2">Total</th>
                            </tr></thead>
                            <tbody>
                                {order.items?.map(item => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="py-2 font-medium">{item.inventory?.title ?? item.item_description}</td>
                                        <td className="py-2">{item.quantity}</td>
                                        <td className="py-2">${item.unit_price}</td>
                                        <td className="py-2 font-semibold">${(item.unit_price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-2">Shipping Address</h2>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{order.shipping_address ?? '—'}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-3">Summary</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Customer</span><span className="font-medium">{order.customer_name}</span></div>
                            <div className="flex justify-between"><span>Payment</span><span className="font-medium">{order.payment_method?.name}</span></div>
                            <div className="flex justify-between border-t pt-2 font-bold text-gray-800"><span>Total</span><span className="text-emerald-600">${order.grand_total}</span></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-3">Update Status</h2>
                        <select defaultValue={order.order_status_id}
                            onChange={e => router.patch(`/merchant/orders/${order.id}/status`, { order_status_id: e.target.value })}
                            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            {Object.entries(orderStatuses).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </MerchantLayout>
    );
}
