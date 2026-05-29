import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState } from 'react';

export default function Product({ product, related, inWishlist }) {
    const { auth } = usePage().props;
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [mainImg, setMainImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState('description');
    const [reviewOpen, setReviewOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ rating: 5, comment: '' });

    const sizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
    const colors = [...new Map(product.variants.map(v => [v.color, v])).values()].filter(v => v.color);

    const selectSize = (size) => {
        setSelectedSize(size);
        const v = product.variants.find(vv => vv.size === size && (!selectedColor || vv.color === selectedColor));
        if (v) setSelectedVariant(v);
    };

    const selectColor = (color, v) => {
        setSelectedColor(color);
        const variant = product.variants.find(vv => vv.color === color && (!selectedSize || vv.size === selectedSize));
        if (variant) setSelectedVariant(variant);
    };

    const addToCart = () => {
        if (!auth.user) { router.visit('/login'); return; }
        router.post('/cart', { product_id: product.id, variant_id: selectedVariant?.id, quantity: qty }, { preserveScroll: true });
    };

    const toggleWishlist = () => {
        if (!auth.user) { router.visit('/login'); return; }
        router.post('/wishlist/toggle', { product_id: product.id }, { preserveScroll: true });
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(`/products/${product.id}/reviews`, { onSuccess: () => { reset(); setReviewOpen(false); } });
    };

    const price = product.flash_sale ? product.flash_sale.sale_price : product.price;
    const imgs = product.images?.length ? product.images : [];
    const getImgUrl = (img) => img?.image ? `/storage/${img.image}` : img?.url || `https://picsum.photos/seed/${product.id}/600/700`;

    return (
        <MainLayout>
            <Head title={`${product.name} — zCart`} />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-orange-500">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-orange-500">Shop</Link>
                    <span>/</span>
                    {product.category && <><Link href={`/shop?category=${product.category.slug}`} className="hover:text-orange-500">{product.category.name}</Link><span>/</span></>}
                    <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Images */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            {imgs.map((img, i) => (
                                <button key={i} onClick={() => setMainImg(i)}
                                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition ${mainImg === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100 relative">
                            <img src={imgs[mainImg] ? getImgUrl(imgs[mainImg]) : `https://picsum.photos/seed/${product.id}/600/700`} alt={product.name} className="w-full h-[550px] object-cover" />
                            {product.flash_sale && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white font-black px-4 py-2 rounded-full text-lg">
                                    ⚡ {Math.round((1 - product.flash_sale.sale_price / product.price) * 100)}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <Link href={`/store/${product.store?.slug}`} className="text-sm font-bold text-orange-500 hover:text-orange-600">{product.store?.name}</Link>
                                <h1 className="text-3xl font-black text-zinc-900 mt-1 leading-tight">{product.name}</h1>
                            </div>
                            <button onClick={toggleWishlist} className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-400 transition shrink-0">
                                <svg className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex">
                                {[1,2,3,4,5].map(n => (
                                    <svg key={n} className={`w-5 h-5 ${n <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                            <span className="text-sm text-gray-500">({product.reviews_count} reviews)</span>
                            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-orange-50 rounded-2xl">
                            <span className="text-4xl font-black text-zinc-900">${price}</span>
                            {product.compare_price && <span className="text-xl text-gray-400 line-through">${product.compare_price}</span>}
                            {product.compare_price && <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">Save ${(product.compare_price - price).toFixed(2)}</span>}
                        </div>

                        {/* Meta tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {product.brand && <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">Brand: {product.brand}</span>}
                            {product.material && <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">Material: {product.material}</span>}
                            {product.gender && <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">For: {product.gender}</span>}
                        </div>

                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="mb-5">
                                <p className="text-sm font-bold text-gray-700 mb-2">Color: <span className="font-normal text-gray-500">{selectedColor || 'Select a color'}</span></p>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(v => (
                                        <button key={v.id} onClick={() => selectColor(v.color, v)} title={v.color}
                                            className={`w-9 h-9 rounded-full border-4 transition-transform hover:scale-110 ${selectedColor === v.color ? 'border-orange-500 scale-110' : 'border-gray-200'}`}
                                            style={{ backgroundColor: v.color_hex || '#ccc' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-bold text-gray-700 mb-2">Size: <span className="font-normal text-gray-500">{selectedSize || 'Select a size'}</span></p>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(s => {
                                        const v = product.variants.find(vv => vv.size === s);
                                        const oos = v?.stock === 0;
                                        return (
                                            <button key={s} onClick={() => !oos && selectSize(s)}
                                                className={`min-w-[52px] py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition ${selectedSize === s ? 'border-orange-500 bg-orange-500 text-white' : oos ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through' : 'border-gray-200 text-gray-700 hover:border-orange-400'}`}>
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Qty + Actions */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50 text-xl font-bold text-gray-600">−</button>
                                <span className="px-5 py-3 font-black text-lg min-w-[3rem] text-center">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-gray-50 text-xl font-bold text-gray-600">+</button>
                            </div>
                            <button onClick={addToCart} disabled={product.stock === 0}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-orange-200 disabled:opacity-50 text-lg">
                                🛒 Add to Cart
                            </button>
                        </div>

                        <button onClick={addToCart} disabled={product.stock === 0}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-3.5 rounded-xl transition mb-4 text-lg disabled:opacity-50">
                            ⚡ Buy Now
                        </button>

                        {/* Chat */}
                        {auth.user && product.store && (
                            <form action="/chat/start" method="POST">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name=csrf-token]')?.content} />
                                <input type="hidden" name="store_id" value={product.store.id} />
                                <input type="hidden" name="product_id" value={product.id} />
                                <button type="submit" className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition">
                                    💬 Chat with Seller
                                </button>
                            </form>
                        )}

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 mt-5">
                            {[['🚚','Free Shipping','On orders $100+'],['↩️','Easy Returns','30-day policy'],['🔒','Secure Pay','100% protected']].map(([icon,title,sub]) => (
                                <div key={title} className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-2xl mb-1">{icon}</p>
                                    <p className="text-xs font-bold text-gray-700">{title}</p>
                                    <p className="text-xs text-gray-500">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-12">
                    <div className="flex border-b border-gray-200 gap-1">
                        {['description','reviews','shipping'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-6 py-3 text-sm font-bold capitalize transition border-b-2 -mb-px ${tab === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {t} {t === 'reviews' && `(${product.reviews?.length || 0})`}
                            </button>
                        ))}
                    </div>

                    <div className="py-8">
                        {tab === 'description' && (
                            <div className="prose max-w-none text-gray-600 leading-relaxed">
                                <p>{product.description}</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    {[['Brand',product.brand],['Material',product.material],['Gender',product.gender],['Category',product.category?.name]].filter(([,v]) => v).map(([k,v]) => (
                                        <div key={k} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                            <span className="text-sm font-bold text-gray-500 w-24">{k}</span>
                                            <span className="text-sm font-semibold text-gray-900 capitalize">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 'reviews' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-6xl font-black text-zinc-900">{product.rating}</p>
                                            <div className="flex justify-center mt-1">
                                                {[1,2,3,4,5].map(n => <svg key={n} className={`w-5 h-5 ${n <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{product.reviews_count} reviews</p>
                                        </div>
                                    </div>
                                    {auth.user && (
                                        <button onClick={() => setReviewOpen(!reviewOpen)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition">
                                            Write a Review
                                        </button>
                                    )}
                                </div>

                                {reviewOpen && (
                                    <form onSubmit={submitReview} className="bg-orange-50 rounded-2xl p-6 mb-6 border border-orange-100">
                                        <h4 className="font-bold text-gray-800 mb-4">Your Review</h4>
                                        <div className="flex gap-1 mb-4">
                                            {[1,2,3,4,5].map(n => (
                                                <button key={n} type="button" onClick={() => setData('rating', n)}>
                                                    <svg className={`w-8 h-8 ${n <= data.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={data.comment} onChange={e => setData('comment', e.target.value)} placeholder="Share your experience with this product..." rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 resize-none mb-3" />
                                        <button type="submit" disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50">Submit Review</button>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {product.reviews?.map(r => (
                                        <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                            <div className="flex items-start gap-4">
                                                <img src={`https://i.pravatar.cc/40?u=${r.user?.email}`} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-bold text-gray-900">{r.user?.name}</p>
                                                        {r.is_verified && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ Verified Purchase</span>}
                                                    </div>
                                                    <div className="flex mt-1 mb-2">
                                                        {[1,2,3,4,5].map(n => <svg key={n} className={`w-4 h-4 ${n <= r.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{r.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 'shipping' && (
                            <div className="space-y-4">
                                {[['🚚','Standard Shipping','3-5 business days','Free on orders over $100, otherwise $9.99'],['⚡','Express Shipping','1-2 business days','$19.99'],['↩️','Returns','30-day return policy','Free returns on all orders']].map(([icon,title,time,desc]) => (
                                    <div key={title} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5">
                                        <span className="text-3xl">{icon}</span>
                                        <div>
                                            <p className="font-bold text-gray-900">{title}</p>
                                            <p className="text-sm text-orange-500 font-semibold">{time}</p>
                                            <p className="text-sm text-gray-500 mt-1">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related */}
                {related?.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-black text-zinc-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
