import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
export default function Wishlist({ items }) {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>
                {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <Link href={`/product/${item.inventory?.slug}`}>
                                    <div className="aspect-square bg-gray-100">
                                        {item.inventory?.images?.[0] && <img src={item.inventory.images[0].path} className="w-full h-full object-cover"/>}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.inventory?.title}</p>
                                        <p className="text-indigo-600 font-bold mt-1">${item.inventory?.sale_price}</p>
                                    </div>
                                </Link>
                                <button onClick={() => router.post(`/wishlist/${item.inventory?.slug}`)}
                                    className="w-full text-xs text-red-500 hover:bg-red-50 py-2 border-t">Remove</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">❤️</p>
                        <p>Your wishlist is empty.</p>
                        <Link href="/products" className="text-indigo-600 hover:underline mt-2 inline-block">Browse Products</Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
