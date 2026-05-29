import MerchantLayout from '@/Layouts/MerchantLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function MerchantProductForm({ product, categories = [], manufacturers = [] }) {
    const isEdit = !!product;
    const { data, setData, post, put, processing, errors } = useForm({
        name:            product?.name ?? '',
        description:     product?.description ?? '',
        min_price:       product?.min_price ?? '',
        manufacturer_id: product?.manufacturer_id ?? '',
        active:          product?.active ?? true,
        categories:      product?.categories?.map(c => c.id) ?? [],
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/merchant/products/${product.id}`) : post('/merchant/products');
    }

    return (
        <MerchantLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/merchant/products" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Product Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Product name"/>
                    </FormField>
                    <FormField label="Description" error={errors.description}>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={4} placeholder="Describe your product..."/>
                    </FormField>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Price *" error={errors.min_price}>
                            <Input type="number" step="0.01" value={data.min_price} onChange={e => setData('min_price', e.target.value)} error={errors.min_price} placeholder="0.00"/>
                        </FormField>
                        <FormField label="Manufacturer" error={errors.manufacturer_id}>
                            <Select value={data.manufacturer_id} onChange={e => setData('manufacturer_id', e.target.value)}>
                                <option value="">Select manufacturer</option>
                                {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                        </FormField>
                    </div>
                    <FormField label="Categories" error={errors.categories}>
                        <div className="grid grid-cols-2 gap-2 border rounded-xl p-3">
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
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded"/>
                        Active (visible to customers)
                    </label>
                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update Product' : 'Create Product'}/>
                        <Link href="/merchant/products" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </MerchantLayout>
    );
}
