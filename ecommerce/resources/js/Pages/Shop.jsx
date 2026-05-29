import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState } from 'react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Shop({ products, categories, brands, wishlistIds }) {
    const params = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState({
        search: params.get('search') || '',
        category: params.get('category') || '',
        gender: params.get('gender') || '',
        brand: params.get('brand') || '',
        min_price: params.get('min_price') || '',
        max_price: params.get('max_price') || '',
        size: params.get('size') || '',
        sort: params.get('sort') || 'latest',
    });
    const [mobileFilter, setMobileFilter] = useState(false);

    const apply = (newFilters) => {
        const f = { ...filters, ...newFilters };
        setFilters(f);
        router.get('/shop', Object.fromEntries(Object.entries(f).filter(([, v]) => v)), { preserveScroll: true });
    };

    const clear = () => {
        setFilters({ search: '', category: '', gender: '', brand: '', min_price: '', max_price: '', size: '', sort: 'latest' });
        router.get('/shop');
    };

    const FilterPanel = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-lg">Filters</h3>
                <button onClick={clear} className="text-xs text-orange-500 hover:text-orange-600 font-semibold">Clear All</button>
            </div>

            {/* Gender */}
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Gender</p>
                <div className="grid grid-cols-2 gap-2">
                    {['women','men','unisex','kids'].map(g => (
                        <button key={g} onClick={() => apply({ gender: filters.gender === g ? '' : g })}
                            className={`py-2 rounded-xl text-sm font-semibold capitalize transition border-2 ${filters.gender === g ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {categories.map(cat => (
                        <div key={cat.id}>
                            <button onClick={() => apply({ category: filters.category === cat.slug ? '' : cat.slug })}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${filters.category === cat.slug ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                                {cat.name}
                            </button>
                            {cat.children?.map(child => (
                                <button key={child.id} onClick={() => apply({ category: filters.category === child.slug ? '' : child.slug })}
                                    className={`w-full text-left pl-6 pr-3 py-1.5 rounded-lg text-xs transition ${filters.category === child.slug ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    ↳ {child.name}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(s => (
                        <button key={s} onClick={() => apply({ size: filters.size === s ? '' : s })}
                            className={`w-12 h-10 rounded-xl text-sm font-bold border-2 transition ${filters.size === s ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Min" value={filters.min_price} onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} onBlur={() => apply({})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                    <span className="text-gray-400">—</span>
                    <input type="number" placeholder="Max" value={filters.max_price} onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} onBlur={() => apply({})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
                </div>
            </div>

            {/* Brands */}
            {brands?.length > 0 && (
                <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Brand</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {brands.map(b => (
                            <button key={b} onClick={() => apply({ brand: filters.brand === b ? '' : b })}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${filters.brand === b ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <MainLayout>
            <Head title="Shop — zCart" />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-orange-500">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Shop</span>
                    {filters.search && <><span>/</span><span className="text-orange-500">"{filters.search}"</span></>}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
                        <FilterPanel />
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1 min-w-0">
                    {/* Toolbar */}
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-3 flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileFilter(true)} className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 border-2 border-gray-200 px-3 py-1.5 rounded-xl">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                Filters
                            </button>
                            <p className="text-sm text-gray-500"><span className="font-bold text-gray-900">{products.total}</span> products found</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 hidden md:block">Sort by:</span>
                            <select value={filters.sort} onChange={e => apply({ sort: e.target.value })} className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500">
                                <option value="latest">Latest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {products.data.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm text-center py-20">
                            <p className="text-6xl mb-4">🔍</p>
                            <p className="text-xl font-bold text-gray-700 mb-2">No products found</p>
                            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                            <button onClick={clear} className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.data.map(p => <ProductCard key={p.id} product={p} inWishlist={wishlistIds.includes(p.id)} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center gap-1.5">
                        {products.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${link.active ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-400 bg-white'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilter && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilter(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-lg">Filters</h3>
                            <button onClick={() => setMobileFilter(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
