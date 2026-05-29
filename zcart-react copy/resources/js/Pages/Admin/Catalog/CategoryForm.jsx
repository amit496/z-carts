import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function CategoryForm({ category, subGroups = [] }) {
    const isEdit = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name:                  category?.name ?? '',
        slug:                  category?.slug ?? '',
        category_sub_group_id: category?.category_sub_group_id ?? '',
        active:                category?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/categories/${category.id}`) : post('/admin/categories');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Category' : 'Add Category'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/categories" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Category' : 'Add Category'}</h1>
                </div>
                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => { setData('name', e.target.value); if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }} error={errors.name} placeholder="e.g. Smartphones" />
                    </FormField>
                    <FormField label="Slug *" error={errors.slug}>
                        <Input value={data.slug} onChange={e => setData('slug', e.target.value)} error={errors.slug} placeholder="smartphones" />
                    </FormField>
                    <FormField label="Sub Group" error={errors.category_sub_group_id}>
                        <Select value={data.category_sub_group_id} onChange={e => setData('category_sub_group_id', e.target.value)}>
                            <option value="">Select sub group</option>
                            {subGroups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                    </FormField>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>
                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/categories" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
