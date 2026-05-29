import MerchantLayout from '@/Layouts/MerchantLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusColors = {'Pending':'bg-yellow-100 text-yellow-700','Confirmed':'bg-blue-100 text-blue-700','Fulfilled':'bg-purple-100 text-purple-700','Delivered':'bg-green-100 text-green-700','Cancelled':'bg-red-100 text-red-700'};

export default function MerchantOrdersIndex({ orders }) {
    const [search, setSearch] = useState('');
    const filtered = orders.data?.filter(o => o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <MerchantLayout title="Orders">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
                <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>{['Order #','Customer','Total','Status','Payment','Date','Action'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered?.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-indigo-600">#{o.order_number}</td>
                                <td className="px-4 py-3">{o.customer_name}</td>
                                <td className="px-4 py-3 font-semibold">${o.grand_total}</td>
                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] ?? 'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                                <td className="px-4 py-3 text-xs text-gray-500">{o.payment_status}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{o.created_at}</td>
                                <td className="px-4 py-3"><Link href={`/merchant/orders/${o.id}`} className="text-indigo-600 hover:underline text-xs">View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center gap-2 p-4 border-t">
                    {orders.links?.map((l, i) => (
                        <Link key={i} href={l.url ?? '#'}
                            className={`px-3 py-1 rounded text-xs border ${l.active ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-600 hover:bg-gray-100'} ${!l.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: l.label }}/>
                    ))}
                </div>
            </div>
        </MerchantLayout>
    );
}
