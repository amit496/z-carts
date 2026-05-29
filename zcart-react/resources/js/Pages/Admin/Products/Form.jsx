import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function ProductForm({ product, categories = [], manufacturers = [], shops = [] }) {
    const isEdit = !!product;
    const { data, setData, post, put, processing, errors } = useForm({
        name:            product?.name ?? '',
        slug:            product?.slug ?? '',
        description:     product?.description ?? '',
        min_price:       product?.min_price ?? '',
        max_price:       product?.max_price ?? '',
        manufacturer_id: product?.manufacturer_id ?? '',
        shop_id:         product?.shop_id ?? '',
        active:          product?.active ?? true,
        requires_shipping: product?.requires_shipping ?? true,
        downloadable:    product?.downloadable ?? false,
        categories:      product?.categories?.map(c => c.id) ?? [],
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/products/${product.id}`) : post('/admin/products');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
            <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Product Name *" error={errors.name}>
                            <Input value={data.name} onChange={e => { setData('name', e.target.value); if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')); }} error={errors.name} placeholder="e.g. iPhone 15 Pro"/>
                        </FormField>
                        <FormField label="Slug *" error={errors.slug}>
                            <Input value={data.slug} onChange={e => setData('slug', e.target.value)} error={errors.slug} placeholder="iphone-15-pro"/>
                        </FormField>
                    </div>

                    <FormField label="Description" error={errors.description}>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} placeholder="Product description..."/>
                    </FormField>

                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Min Price *" error={errors.min_price}>
                            <Input type="number" step="0.01" value={data.min_price} onChange={e => setData('min_price', e.target.value)} error={errors.min_price} placeholder="0.00"/>
                        </FormField>
                        <FormField label="Max Price" error={errors.max_price}>
                            <Input type="number" step="0.01" value={data.max_price} onChange={e => setData('max_price', e.target.value)} placeholder="0.00"/>
                        </FormField>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Manufacturer" error={errors.manufacturer_id}>
                            <Select value={data.manufacturer_id} onChange={e => setData('manufacturer_id', e.target.value)}>
                                <option value="">Select manufacturer</option>
                                {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </FormField>
                        <FormField label="Shop" error={errors.shop_id}>
                            <Select value={data.shop_id} onChange={e => setData('shop_id', e.target.value)}>
                                <option value="">Select shop</option>
                                {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </FormField>
                    </div>

                    <FormField label="Categories" error={errors.categories}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border rounded-xl p-3">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={data.categories.includes(cat.id)}
                                        onChange={e => setData('categories', e.target.checked ? [...data.categories, cat.id] : data.categories.filter(id => id !== cat.id))}
                                        className="rounded"/>
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    </FormField>

                    <div className="flex gap-6">
                        {[['active','Active'],['requires_shipping','Requires Shipping'],['downloadable','Downloadable']].map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={data[key]} onChange={e => setData(key, e.target.checked)} className="rounded"/>
                                {label}
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update Product' : 'Create Product'}/>
                        <Link href="/admin/products" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
