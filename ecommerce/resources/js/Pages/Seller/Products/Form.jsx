import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { useState } from 'react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm({ product, categories }) {
    const isEdit = !!product;
    const [variants, setVariants] = useState(product?.variants || []);
    const [newVariant, setNewVariant] = useState({ size: 'M', color: '', color_hex: '#000000', stock: 10, price_adjustment: 0 });

    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        compare_price: product?.compare_price || '',
        category_id: product?.category_id || '',
        brand: product?.brand || '',
        material: product?.material || '',
        gender: product?.gender || 'women',
        stock: product?.stock || 0,
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
        images: [],
        variants: product?.variants || [],
        _method: isEdit ? 'POST' : undefined,
    });

    const addVariant = () => {
        const updated = [...variants, newVariant];
        setVariants(updated);
        setData('variants', updated);
        setNewVariant({ size: 'M', color: '', color_hex: '#000000', stock: 10, price_adjustment: 0 });
    };

    const removeVariant = (i) => {
        const updated = variants.filter((_, idx) => idx !== i);
        setVariants(updated);
        setData('variants', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'images') { Array.from(v).forEach(f => formData.append('images[]', f)); }
            else if (k === 'variants') { v.forEach((vr, i) => Object.entries(vr).forEach(([vk, vv]) => formData.append(`variants[${i}][${vk}]`, vv))); }
            else if (v !== undefined && v !== null) formData.append(k, v);
        });
        if (isEdit) {
            post(`/seller/products/${product.id}`, { data: formData, forceFormData: true });
        } else {
            post('/seller/products', { data: formData, forceFormData: true });
        }
    };

    return (
        <SellerLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
            <Head title={isEdit ? 'Edit Product' : 'Add Product'} />
            <form onSubmit={submit} className="max-w-3xl space-y-6">

                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-gray-700">Basic Info</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Product Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Brand</label>
                            <input type="text" value={data.brand} onChange={e => setData('brand', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Price *</label>
                            <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Compare Price</label>
                            <input type="number" step="0.01" value={data.compare_price} onChange={e => setData('compare_price', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Category</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400">
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Gender</label>
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400">
                                {['women','men','unisex','kids'].map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Material</label>
                            <input type="text" value={data.material} onChange={e => setData('material', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Stock</label>
                            <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none" />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="accent-indigo-600" />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.is_featured} onChange={e => setData('is_featured', e.target.checked)} className="accent-indigo-600" />
                            <span className="text-sm text-gray-700">Featured</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-3">Product Images</h3>
                    {isEdit && product.images?.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {product.images.map(img => (
                                <img key={img.id} src={`/storage/${img.image}`} alt="" className="w-16 h-20 object-cover rounded-xl border" />
                            ))}
                        </div>
                    )}
                    <input type="file" multiple accept="image/*" onChange={e => setData('images', e.target.files)} className="text-sm text-gray-600" />
                </div>

                {/* Variants */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Size & Color Variants</h3>
                    {variants.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {variants.map((v, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 text-sm">
                                    <span className="font-medium">{v.size}</span>
                                    <span style={{ color: v.color_hex }} className="font-medium">● {v.color}</span>
                                    <span className="text-gray-500">Stock: {v.stock}</span>
                                    <button type="button" onClick={() => removeVariant(i)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <select value={newVariant.size} onChange={e => setNewVariant(v => ({ ...v, size: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                            {SIZES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <input type="text" placeholder="Color name" value={newVariant.color} onChange={e => setNewVariant(v => ({ ...v, color: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
                        <input type="color" value={newVariant.color_hex} onChange={e => setNewVariant(v => ({ ...v, color_hex: e.target.value }))} className="border border-gray-200 rounded-xl px-2 py-1 h-10 w-full cursor-pointer" />
                        <input type="number" placeholder="Stock" value={newVariant.stock} onChange={e => setNewVariant(v => ({ ...v, stock: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" />
                        <button type="button" onClick={addVariant} className="bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">+ Add</button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
                        {processing ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                    <a href="/seller/products" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</a>
                </div>
            </form>
        </SellerLayout>
    );
}
