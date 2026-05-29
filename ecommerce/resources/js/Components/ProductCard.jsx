import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductCard({ product, inWishlist = false }) {
    const { auth } = usePage().props;
    const [hovered, setHovered] = useState(false);
    const [adding, setAdding] = useState(false);

    const hasFlash = product.flash_sale;
    const price = hasFlash ? product.flash_sale.sale_price : product.price;
    const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : null;
    const flashDiscount = hasFlash ? Math.round((1 - hasFlash.sale_price / product.price) * 100) : null;

    const imgs = product.images || [];
    const resolveImg = (img) => img ? (img.startsWith('http') ? img : `/storage/${img}`) : null;
    const img1 = resolveImg(imgs[0]?.image) || `https://picsum.photos/seed/${product.id}/400/500`;
    const img2 = resolveImg(imgs[1]?.image) || img1;

    const toggleWishlist = (e) => {
        e.preventDefault();
        if (!auth.user) { router.visit('/login'); return; }
        router.post('/wishlist/toggle', { product_id: product.id }, { preserveScroll: true });
    };

    const addToCart = (e) => {
        e.preventDefault();
        if (!auth.user) { router.visit('/login'); return; }
        setAdding(true);
        router.post('/cart', { product_id: product.id, quantity: 1 }, {
            preserveScroll: true,
            onFinish: () => setAdding(false),
        });
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100"
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="relative overflow-hidden bg-gray-50">
                <Link href={`/product/${product.slug}`}>
                    <img src={hovered ? img2 : img1} alt={product.name}
                        className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105" />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {hasFlash && <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow">⚡ {flashDiscount}% OFF</span>}
                    {discount && !hasFlash && <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow">-{discount}%</span>}
                    {product.is_featured && <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">★ Featured</span>}
                    {product.stock < 5 && product.stock > 0 && <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Only {product.stock} left</span>}
                </div>

                {/* Wishlist */}
                <button onClick={toggleWishlist}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                    <svg className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Quick Add */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={addToCart} disabled={adding}
                        className="w-full bg-zinc-900 hover:bg-orange-500 text-white font-bold py-3 text-sm transition-colors disabled:opacity-70">
                        {adding ? 'Adding...' : '🛒 Quick Add to Cart'}
                    </button>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">{product.brand || product.store?.name}</span>
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <span className="text-xs text-gray-500">{product.rating}</span>
                        </div>
                    )}
                </div>
                <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-gray-800 hover:text-orange-500 transition line-clamp-2 mb-2 flex-1">
                    {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xl font-black text-zinc-900">${price}</span>
                    {(product.compare_price || hasFlash) && (
                        <span className="text-sm text-gray-400 line-through">${hasFlash ? product.price : product.compare_price}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
