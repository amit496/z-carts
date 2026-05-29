import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({ sliders = [], banners = [], featuredProducts = [], featuredCategories = [], shops = [] }) {
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <MainLayout>
            {/* Slider */}
            {sliders.length > 0 ? (
                <div className="relative overflow-hidden">
                    <div className="relative h-72 md:h-96">
                        {sliders.map((slide, i) => (
                            <div key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-500 ${i === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
                                    <h1 className="text-3xl md:text-5xl font-bold mb-3">{slide.title}</h1>
                                    {slide.description && <p className="text-lg text-white/80 mb-5">{slide.description}</p>}
                                    {slide.url && (
                                        <Link href={slide.url} className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition">
                                            Shop Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {sliders.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {sliders.map((_, i) => (
                                <button key={i} onClick={() => setActiveSlide(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition ${i === activeSlide ? 'bg-white' : 'bg-white/50'}`} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to zCart</h1>
                    <p className="text-lg text-indigo-100 mb-8">Discover thousands of products from top vendors</p>
                    <Link href="/products" className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition">
                        Shop Now
                    </Link>
                </section>
            )}

            {/* Banners */}
            {banners.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {banners.slice(0, 2).map(banner => (
                            <Link key={banner.id} href={banner.url ?? '/products'}>
                                <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded-2xl hover:opacity-90 transition" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            {featuredCategories.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {featuredCategories.map(cat => (
                            <Link key={cat.id} href={`/category/${cat.slug}`}
                                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition group">
                                <div className="w-12 h-12 mx-auto mb-2 bg-indigo-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition">
                                    🗂
                                </div>
                                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
                    <Link href="/products" className="text-indigo-600 text-sm font-medium hover:underline">View all →</Link>
                </div>
                {featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-12">No products yet.</p>
                )}
            </section>

            {/* Top Shops */}
            {shops.length > 0 && (
                <section className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Top Shops</h2>
                            <Link href="/shops" className="text-indigo-600 text-sm font-medium hover:underline">View all →</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {shops.map(shop => (
                                <Link key={shop.id} href={`/shop/${shop.slug}`}
                                    className="border rounded-xl p-4 text-center hover:shadow-md transition">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-indigo-50 rounded-full flex items-center justify-center text-2xl">🏪</div>
                                    <p className="font-semibold text-gray-700">{shop.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{shop.total_item_sold ?? 0} items sold</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}

function ProductCard({ product }) {
    return (
        <Link href={`/product/${product.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
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
    );
}
