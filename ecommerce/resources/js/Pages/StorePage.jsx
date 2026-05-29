import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';

export default function StorePage({ store, products }) {
    return (
        <MainLayout>
            <Head title={`${store.name} — ZMarket`} />

            {/* Banner */}
            <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
                {store.banner && <img src={store.banner.startsWith('http') ? store.banner : `/storage/${store.banner}`} alt="" className="w-full h-full object-cover opacity-50" />}
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-end gap-5 -mt-10 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden">
                        {store.logo ? <img src={store.logo.startsWith('http') ? store.logo : `/storage/${store.logo}`} alt={store.name} className="w-full h-full object-cover" /> : (
                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-2xl font-black text-indigo-600">{store.name[0]}</div>
                        )}
                    </div>
                    <div className="pb-2">
                        <h1 className="text-2xl font-black text-gray-900">{store.name}</h1>
                        <p className="text-gray-500 text-sm">{store.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
                    {products.data.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </MainLayout>
    );
}
