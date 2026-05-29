import MerchantLayout from '@/Layouts/MerchantLayout';

export default function MerchantReports({ monthly, totals }) {
    return (
        <MerchantLayout title="Reports">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Total Revenue', value: `$${Number(totals?.revenue ?? 0).toFixed(2)}`, color: 'bg-green-500' },
                    { label: 'Total Orders', value: totals?.orders ?? 0, color: 'bg-indigo-500' },
                    { label: 'Items Sold', value: totals?.items_sold ?? 0, color: 'bg-purple-500' },
                    { label: 'Pending Orders', value: totals?.pending ?? 0, color: 'bg-yellow-500' },
                ].map(c => (
                    <div key={c.label} className={`${c.color} text-white rounded-xl p-5 shadow`}>
                        <p className="text-sm opacity-80">{c.label}</p>
                        <p className="text-3xl font-bold mt-1">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow p-5">
                <h2 className="font-semibold text-gray-700 mb-4">Monthly Sales</h2>
                {monthly?.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b">
                                <th className="pb-2">Month</th>
                                <th className="pb-2">Orders</th>
                                <th className="pb-2">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthly.map(row => (
                                <tr key={row.month} className="border-b last:border-0">
                                    <td className="py-2 font-medium">{row.month}</td>
                                    <td className="py-2">{row.orders}</td>
                                    <td className="py-2 text-green-600 font-semibold">${Number(row.revenue).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-400 text-sm text-center py-8">No sales data yet.</p>
                )}
            </div>
        </MerchantLayout>
    );
}
