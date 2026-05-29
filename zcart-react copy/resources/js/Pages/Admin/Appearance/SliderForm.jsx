import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function SliderForm({ slider }) {
    const isEdit = !!slider;
    const { data, setData, post, put, processing, errors } = useForm({
        title: slider?.title ?? '',
        image: slider?.image ?? '',
        url: slider?.url ?? '',
        description: slider?.description ?? '',
        order: slider?.order ?? 0,
        active: slider?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/sliders/${slider.id}`) : post('/admin/sliders');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Slider' : 'Add Slider'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/sliders" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Slider' : 'Add Slider'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Title *" error={errors.title}>
                        <Input value={data.title} onChange={e => setData('title', e.target.value)} error={errors.title} />
                    </FormField>
                    <FormField label="Image URL *" error={errors.image}>
                        <Input value={data.image} onChange={e => setData('image', e.target.value)} error={errors.image} placeholder="https://..." />
                    </FormField>
                    <FormField label="Target URL" error={errors.url}>
                        <Input value={data.url} onChange={e => setData('url', e.target.value)} error={errors.url} placeholder="https://..." />
                    </FormField>
                    <FormField label="Description" error={errors.description}>
                        <Textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} error={errors.description} />
                    </FormField>
                    <FormField label="Order" error={errors.order}>
                        <Input type="number" value={data.order} onChange={e => setData('order', e.target.value)} error={errors.order} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/sliders" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

