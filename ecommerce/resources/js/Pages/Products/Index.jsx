import Navbar from '@/Components/Navbar';
import ProductCard from '@/Components/ProductCard';
import { Head, Link } from '@inertiajs/react';

export default function Index({ products }) {
    return (
        <>
            <Head title="Products" />
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.data.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-10 flex justify-center gap-2">
                    {products.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1.5 rounded border text-sm ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 border-gray-300 hover:border-indigo-400'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </main>
        </>
    );
}
