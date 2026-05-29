import MainLayout from '@/Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Products({ products, filters = {}, categories = [] }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e) {
        e.preventDefault();
        router.get('/products', { search }, { preserveState: true, replace: true });
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-56 shrink-0">
                        <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <Link href="/products" className="block px-2 py-1 rounded hover:bg-indigo-50 text-gray-600">All</Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/products?category=${cat.slug}`}
                                        className="block px-2 py-1 rounded hover:bg-indigo-50 text-gray-600">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main */}
                    <div className="flex-1">
                        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">
                                Search
                            </button>
                        </form>

                        {products.data?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {products.data.map((product) => (
                                        <Link key={product.id} href={`/product/${product.slug}`}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
                                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                                                <p className="text-indigo-600 font-bold mt-1">${product.min_price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center gap-2 mt-8">
                                    {products.links?.map((link, i) => (
                                        <Link key={i} href={link.url ?? '#'}
                                            className={`px-3 py-1 rounded text-sm border ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-400 py-20">No products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
