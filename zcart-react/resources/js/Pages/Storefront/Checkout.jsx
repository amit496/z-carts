import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
export default function Checkout({ carts, total, paymentMethods }) {
    const { data, setData, post, processing, errors } = useForm({ shipping_address: '', payment_method_id: '' });
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <form onSubmit={e=>{e.preventDefault();post('/checkout');}} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                            <textarea value={data.shipping_address} onChange={e=>setData('shipping_address',e.target.value)} rows={3}
                                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter full address..."/>
                            {errors.shipping_address && <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select value={data.payment_method_id} onChange={e=>setData('payment_method_id',e.target.value)}
                                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="">Select payment method</option>
                                {paymentMethods?.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                            </select>
                            {errors.payment_method_id && <p className="text-red-500 text-xs mt-1">{errors.payment_method_id}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60">
                            {processing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-4">
                            {carts?.map(c => (
                                <div key={c.id} className="flex justify-between text-sm text-gray-600">
                                    <span>{c.inventory?.title} × {c.quantity}</span>
                                    <span>${(c.unit_price * c.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                            <span>Total</span><span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
