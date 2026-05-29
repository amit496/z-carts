import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';

export default function Wishlist({ items }) {
    return (
        <MainLayout>
            <Head title="Wishlist — ZMarket" />
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Wishlist <span className="text-gray-400 font-normal text-xl">({items.length})</span></h1>
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">♡</p>
                        <p className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</p>
                        <a href="/shop" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 inline-block">Discover Products</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {items.map(item => <ProductCard key={item.id} product={item.product} inWishlist={true} />)}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
