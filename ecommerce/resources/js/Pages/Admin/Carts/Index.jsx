import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminCarts({ carts, stats }) {
    return (
        <AdminLayout title="Active Carts">
            <Head title="Carts — Admin" />

            <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Items',   value: stats.total_items,  color: 'bg-blue-50 text-blue-700',   icon: 'fa-cart-shopping' },
                    { label: 'Active Users',  value: stats.active_users, color: 'bg-green-50 text-green-700', icon: 'fa-users' },
                    { label: 'Cart Value',    value: `$${Number(stats.total_value).toFixed(2)}`, color: 'bg-orange-50 text-orange-700', icon: 'fa-sack-dollar' },
                ].map(c => (
                    <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
                        <i className={`fa-solid ${c.icon} text-lg mb-1`} />
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-xs font-medium opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Qty</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Subtotal</th>
                            <th className="px-4 py-3 text-left">Added</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {carts.data.map(item => {
                            const img = item.product?.images?.[0]?.image;
                            const imgSrc = img ? (img.startsWith('http') ? img : `/storage/${img}`) : null;
                            return (
                                <tr key={item.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-4 py-3 font-medium text-zinc-800">{item.user?.name}<p className="text-xs text-zinc-400">{item.user?.email}</p></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {imgSrc && <img src={imgSrc} className="h-8 w-8 rounded object-cover border" />}
                                            <span className="text-zinc-700 max-w-[160px] truncate">{item.product?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-zinc-800">{item.quantity}</td>
                                    <td className="px-4 py-3 text-zinc-600">${item.product?.price}</td>
                                    <td className="px-4 py-3 font-bold text-zinc-800">${(item.quantity * item.product?.price).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-xs text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {carts.data.length === 0 && <div className="py-16 text-center text-zinc-400"><i className="fa-solid fa-cart-shopping text-3xl mb-2 block" />No active carts</div>}
            </div>

            {carts.links && (
                <div className="mt-4 flex justify-center gap-1">
                    {carts.links.map((link, i) => (
                        <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition ${link.active ? 'bg-brand-orange text-white border-brand-orange' : 'border-zinc-200 text-zinc-600 bg-white'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
