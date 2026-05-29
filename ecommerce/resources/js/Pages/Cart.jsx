import { Head, Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';
import axios from 'axios';

export default function Cart({ cartItems }) {
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        shipping_address: { name: '', address: '', city: '', zip: '', country: 'US' },
        payment_method: 'card',
        coupon_code: '',
    });

    const subtotal = cartItems.reduce((s, i) => {
        const price = i.product.flash_sale ? i.product.flash_sale.sale_price : i.product.price;
        return s + price * i.quantity;
    }, 0);
    const discount = couponData?.discount || 0;
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const total = Math.max(0, subtotal - discount + shipping);

    const applyCoupon = async () => {
        setCouponError(''); setCouponLoading(true);
        try {
            const res = await axios.post('/coupon/apply', { code: couponCode, subtotal });
            setCouponData(res.data);
            setData('coupon_code', couponCode);
        } catch (e) {
            setCouponError(e.response?.data?.error || 'Invalid coupon');
        } finally { setCouponLoading(false); }
    };

    const placeOrder = (e) => { e.preventDefault(); post('/checkout'); };

    if (cartItems.length === 0) return (
        <MainLayout>
            <Head title="Cart — zCart" />
            <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h2 className="text-3xl font-black text-zinc-900 mb-3">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Start shopping!</p>
                <Link href="/shop" className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-10 py-4 rounded-full hover:from-orange-600 hover:to-red-700 transition shadow-lg">Start Shopping</Link>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <Head title="Shopping Cart — zCart" />
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-orange-500">Home</Link><span>/</span>
                    <span className="text-gray-900 font-medium">Shopping Cart</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-zinc-900 mb-8">Shopping Cart <span className="text-gray-400 font-normal text-xl">({cartItems.length} items)</span></h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => {
                            const price = item.product.flash_sale ? item.product.flash_sale.sale_price : item.product.price;
                            const img = item.product.images?.[0]?.image ? `/storage/${item.product.images[0].image}` : item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product_id}/200/250`;
                            return (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 items-center">
                                    <Link href={`/product/${item.product.slug}`}>
                                        <img src={img} alt={item.product.name} className="w-24 h-28 object-cover rounded-xl" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.product.slug}`} className="font-bold text-gray-900 hover:text-orange-500 transition line-clamp-2">{item.product.name}</Link>
                                        {item.variant && <p className="text-sm text-gray-500 mt-1">{item.variant.size} / {item.variant.color}</p>}
                                        <p className="text-orange-500 font-black text-lg mt-1">${price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => router.patch(`/cart/${item.id}`, { quantity: item.quantity - 1 }, { preserveScroll: true })} className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 font-bold text-lg transition">−</button>
                                        <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                                        <button onClick={() => router.patch(`/cart/${item.id}`, { quantity: item.quantity + 1 }, { preserveScroll: true })} className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 font-bold text-lg transition">+</button>
                                    </div>
                                    <p className="font-black text-xl text-zinc-900 w-24 text-right">${(price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => router.delete(`/cart/${item.id}`, { preserveScroll: true })} className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition">✕</button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-black text-xl text-zinc-900 mb-5">Order Summary</h3>
                            <div className="space-y-3 text-sm mb-5">
                                <div className="flex justify-between text-gray-600"><span>Subtotal ({cartItems.length} items)</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                                {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Coupon Discount</span><span>-${discount.toFixed(2)}</span></div>}
                                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
                                <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between font-black text-xl text-zinc-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>

                            {/* Coupon */}
                            <div className="mb-5">
                                <p className="text-sm font-bold text-gray-700 mb-2">Have a coupon?</p>
                                <div className="flex gap-2">
                                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500 font-mono" />
                                    <button onClick={applyCoupon} disabled={couponLoading} className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50">Apply</button>
                                </div>
                                {couponError && <p className="text-red-500 text-xs mt-1.5 font-medium">{couponError}</p>}
                                {couponData && <p className="text-green-600 text-xs mt-1.5 font-semibold">✓ Coupon applied! You saved ${discount.toFixed(2)}</p>}
                            </div>

                            <button onClick={() => setCheckoutOpen(true)} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black py-4 rounded-xl transition shadow-lg shadow-orange-200 text-lg">
                                Proceed to Checkout →
                            </button>
                            {subtotal < 100 && <p className="text-xs text-center text-gray-400 mt-3">Add <span className="font-bold text-orange-500">${(100 - subtotal).toFixed(2)}</span> more for free shipping!</p>}
                        </div>

                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                            <div className="flex items-center gap-3 text-sm text-orange-700">
                                <span className="text-2xl">🔒</span>
                                <div>
                                    <p className="font-bold">Secure Checkout</p>
                                    <p className="text-xs text-orange-600">Your payment info is encrypted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {checkoutOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-zinc-900">Checkout</h2>
                                <button onClick={() => setCheckoutOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>
                            </div>
                            <form onSubmit={placeOrder} className="space-y-5">
                                <div>
                                    <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Shipping Address</p>
                                    <div className="space-y-3">
                                        {[['name','Full Name'],['address','Street Address'],['city','City'],['zip','ZIP / Postal Code']].map(([field,label]) => (
                                            <input key={field} type="text" placeholder={label} value={data.shipping_address[field]} onChange={e => setData('shipping_address', { ...data.shipping_address, [field]: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition" />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Payment Method</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[['card','💳','Card'],['paypal','🅿️','PayPal'],['cod','💵','Cash']].map(([m,icon,label]) => (
                                            <button key={m} type="button" onClick={() => setData('payment_method', m)}
                                                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-bold transition ${data.payment_method === m ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                <span className="text-xl">{icon}</span>{label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
                                    <div className="flex justify-between font-black text-lg text-zinc-900 border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                                </div>
                                <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-xl transition shadow-lg disabled:opacity-50 text-lg">
                                    {processing ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
