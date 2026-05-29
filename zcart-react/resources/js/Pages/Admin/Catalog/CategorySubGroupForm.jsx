import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/Components/FormComponents';

export default function CategorySubGroupForm({ subGroup, groups = [] }) {
    const isEdit = !!subGroup;
    const { data, setData, post, put, processing, errors } = useForm({
        category_group_id: subGroup?.category_group_id ?? '',
        name: subGroup?.name ?? '',
        slug: subGroup?.slug ?? '',
        description: subGroup?.description ?? '',
        active: subGroup?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/categorySubGroup/${subGroup.id}`) : post('/admin/categorySubGroup');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit Category Sub Group' : 'Add Category Sub Group'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/categorySubGroup" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Category Sub Group' : 'Add Category Sub Group'}</h1>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Category Group *" error={errors.category_group_id}>
                        <Select value={data.category_group_id} onChange={e => setData('category_group_id', e.target.value)} error={errors.category_group_id}>
                            <option value="">Select group</option>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </Select>
                    </FormField>

                    <FormField label="Name *" error={errors.name}>
                        <Input
                            value={data.name}
                            onChange={e => {
                                setData('name', e.target.value);
                                if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                            }}
                            error={errors.name}
                            placeholder="e.g. Mobile & Accessories"
                        />
                    </FormField>

                    <FormField label="Slug *" error={errors.slug}>
                        <Input value={data.slug} onChange={e => setData('slug', e.target.value)} error={errors.slug} placeholder="mobile-accessories" />
                    </FormField>

                    <FormField label="Description (optional)" error={errors.description}>
                        <Textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} error={errors.description} />
                    </FormField>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>

                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update' : 'Create'} />
                        <Link href="/admin/categorySubGroup" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

