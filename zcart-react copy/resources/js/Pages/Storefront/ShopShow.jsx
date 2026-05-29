import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
export default function ShopShow({ shop, products }) {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
                    {shop.description && <p className="text-gray-500 mt-2 text-sm">{shop.description}</p>}
                    <div className="flex gap-4 mt-3 text-sm text-gray-400">
                        <span>📦 {shop.total_item_sold ?? 0} sold</span>
                        {shop.email && <span>✉️ {shop.email}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.data?.map(p => (
                        <Link key={p.id} href={`/product/${p.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                            <div className="aspect-square bg-gray-100">
                                {p.images?.[0] && <img src={p.images[0].path} alt={p.name} className="w-full h-full object-cover"/>}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                <p className="text-indigo-600 font-bold mt-1">${p.min_price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
