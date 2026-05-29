import MerchantLayout from '@/Layouts/MerchantLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function InventoryForm({ inventory, products = [] }) {
    const isEdit = !!inventory;
    const { data, setData, post, put, processing, errors } = useForm({
        product_id:      inventory?.product_id ?? '',
        title:           inventory?.title ?? '',
        sku:             inventory?.sku ?? '',
        condition:       inventory?.condition ?? 'New',
        description:     inventory?.description ?? '',
        sale_price:      inventory?.sale_price ?? '',
        offer_price:     inventory?.offer_price ?? '',
        offer_start:     inventory?.offer_start ?? '',
        offer_end:       inventory?.offer_end ?? '',
        stock_quantity:  inventory?.stock_quantity ?? 0,
        min_order_quantity: inventory?.min_order_quantity ?? 1,
        free_shipping:   inventory?.free_shipping ?? false,
        active:          inventory?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/merchant/inventory/${inventory.id}`) : post('/merchant/inventory');
    }

    return (
        <MerchantLayout title={isEdit ? 'Edit Inventory' : 'Add Inventory'}>
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/merchant/inventory" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}</h1>
                </div>
                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Product *" error={errors.product_id}>
                        <Select value={data.product_id} onChange={e => setData('product_id', e.target.value)} error={errors.product_id}>
                            <option value="">Select product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Select>
                    </FormField>
                    <FormField label="Title *" error={errors.title}>
                        <Input value={data.title} onChange={e => setData('title', e.target.value)} error={errors.title} placeholder="Listing title"/>
                    </FormField>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="SKU" error={errors.sku}>
                            <Input value={data.sku} onChange={e => setData('sku', e.target.value)} placeholder="e.g. SKU-001"/>
                        </FormField>
                        <FormField label="Condition *" error={errors.condition}>
                            <Select value={data.condition} onChange={e => setData('condition', e.target.value)}>
                                {['New','Used','Refurbished'].map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </FormField>
                    </div>
                    <FormField label="Description" error={errors.description}>
                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} placeholder="Item description..."/>
                    </FormField>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Sale Price *" error={errors.sale_price}>
                            <Input type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} error={errors.sale_price} placeholder="0.00"/>
                        </FormField>
                        <FormField label="Offer Price" error={errors.offer_price}>
                            <Input type="number" step="0.01" value={data.offer_price} onChange={e => setData('offer_price', e.target.value)} placeholder="0.00"/>
                        </FormField>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Offer Start" error={errors.offer_start}>
                            <Input type="datetime-local" value={data.offer_start} onChange={e => setData('offer_start', e.target.value)}/>
                        </FormField>
                        <FormField label="Offer End" error={errors.offer_end}>
                            <Input type="datetime-local" value={data.offer_end} onChange={e => setData('offer_end', e.target.value)}/>
                        </FormField>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FormField label="Stock Quantity *" error={errors.stock_quantity}>
                            <Input type="number" value={data.stock_quantity} onChange={e => setData('stock_quantity', e.target.value)} error={errors.stock_quantity}/>
                        </FormField>
                        <FormField label="Min Order Qty" error={errors.min_order_quantity}>
                            <Input type="number" value={data.min_order_quantity} onChange={e => setData('min_order_quantity', e.target.value)}/>
                        </FormField>
                    </div>
                    <div className="flex gap-6">
                        {[['free_shipping','Free Shipping'],['active','Active']].map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={data[key]} onChange={e => setData(key, e.target.checked)} className="rounded"/>
                                {label}
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update Item' : 'Create Item'}/>
                        <Link href="/merchant/inventory" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </MerchantLayout>
    );
}
