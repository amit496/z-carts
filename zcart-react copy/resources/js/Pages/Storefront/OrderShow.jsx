import MainLayout from '@/Layouts/MainLayout';
export default function OrderShow({ order }) {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Order #{order.order_number}</h1>
                <p className="text-sm text-gray-400 mb-6">Placed on {order.created_at}</p>
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Items</h2>
                    <div className="space-y-3">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {item.inventory?.images?.[0] && <img src={item.inventory.images[0].path} className="w-full h-full object-cover"/>}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.inventory?.title}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">${(item.unit_price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Subtotal</span><span>${order.total}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Shipping</span><span>${order.shipping}</span></div>
                    <div className="flex justify-between font-bold text-gray-800 border-t pt-2"><span>Total</span><span>${order.grand_total}</span></div>
                </div>
            </div>
        </MainLayout>
    );
}
