import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function ShopShow({ shop, stats }) {
    return (
        <AdminLayout title={shop.name}>
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/shops" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Shops</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {/* Shop Info */}
                <div className="md:col-span-2 space-y-5">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{shop.name}</h1>
                                <p className="text-sm text-gray-400 mt-1">{shop.email}</p>
                                {shop.description && <p className="text-sm text-gray-600 mt-2">{shop.description}</p>}
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {shop.active ? 'Active' : 'Inactive'}
                                </span>
                                {shop.verified && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">✓ Verified</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                ['Owner', shop.owner],
                                ['Total Items Sold', shop.total_item_sold],
                                ['Commission Rate', shop.commission_rate ? `${shop.commission_rate}%` : 'Default'],
                                ['ID Verified', shop.id_verified ? '✓ Yes' : '✗ No'],
                                ['Phone Verified', shop.phone_verified ? '✓ Yes' : '✗ No'],
                                ['Address Verified', shop.address_verified ? '✓ Yes' : '✗ No'],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-gray-400 text-xs">{label}</p>
                                    <p className="font-medium text-gray-700">{value ?? '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            ['Products', stats.products, 'bg-indigo-500'],
                            ['Inventories', stats.inventories, 'bg-purple-500'],
                            ['Orders', stats.orders, 'bg-green-500'],
                            ['Revenue', `$${Number(stats.revenue).toFixed(2)}`, 'bg-orange-500'],
                        ].map(([label, value, color]) => (
                            <div key={label} className={`${color} text-white rounded-xl p-4 shadow`}>
                                <p className="text-xs opacity-80">{label}</p>
                                <p className="text-2xl font-bold mt-1">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="font-semibold text-gray-700 mb-4">Actions</h2>
                        <div className="space-y-2">
                            <button onClick={() => router.patch(`/admin/shops/${shop.id}/toggle`)}
                                className={`w-full py-2 rounded-lg text-sm font-medium transition ${shop.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {shop.active ? 'Deactivate Shop' : 'Activate Shop'}
                            </button>
                            <button onClick={() => router.patch(`/admin/shops/${shop.id}`, { id_verified: !shop.id_verified })}
                                className="w-full py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                {shop.id_verified ? 'Revoke ID Verification' : 'Verify ID'}
                            </button>
                            <button onClick={() => { if (confirm('Delete this shop?')) router.delete(`/admin/shops/${shop.id}`); }}
                                className="w-full py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition">
                                Delete Shop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
