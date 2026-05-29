import Navbar from '@/Components/Navbar';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Show({ product }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const addToCart = () => {
        post('/cart', { data: { product_id: product.id, quantity: 1 }, preserveScroll: true });
    };

    return (
        <>
            <Head title={product.name} />
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex">
                    <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-80 object-cover" />
                    <div className="p-8 flex flex-col justify-between">
                        <div>
                            <span className="text-xs text-indigo-500 font-semibold uppercase">{product.category}</span>
                            <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
                            <p className="text-gray-500 mt-4">{product.description}</p>
                            <p className="text-sm text-gray-400 mt-2">In stock: {product.stock}</p>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-3xl font-bold text-indigo-600">${product.price}</span>
                            {product.stock > 0 ? (
                                auth.user ? (
                                    <button
                                        onClick={addToCart}
                                        disabled={processing}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <a href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                                        Login to Buy
                                    </a>
                                )
                            ) : (
                                <span className="text-red-500 font-semibold">Out of Stock</span>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
