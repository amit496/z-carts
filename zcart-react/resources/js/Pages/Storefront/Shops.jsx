import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
export default function Shops({ shops }) {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">All Shops</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {shops.data?.map(shop => (
                        <Link key={shop.id} href={`/shop/${shop.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 text-center">
                            <p className="font-semibold text-gray-800">{shop.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{shop.total_item_sold ?? 0} items sold</p>
                            {shop.isVerified && <span className="text-xs text-green-600 mt-1 block">✓ Verified</span>}
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
