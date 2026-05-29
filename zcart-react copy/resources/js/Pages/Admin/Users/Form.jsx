import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormField, Input, Select, SubmitButton } from '@/Components/FormComponents';

export default function UserForm({ user, roles = [] }) {
    const isEdit = !!user;
    const { data, setData, post, put, processing, errors } = useForm({
        name:     user?.name ?? '',
        email:    user?.email ?? '',
        phone:    user?.phone ?? '',
        password: '',
        role_id:  user?.role_id ?? '',
        active:   user?.active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        isEdit ? put(`/admin/users/${user.id}`) : post('/admin/users');
    }

    return (
        <AdminLayout title={isEdit ? 'Edit User' : 'Add User'}>
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/admin/users" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit User' : 'Add New User'}</h1>
                </div>
                <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-5">
                    <FormField label="Full Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="John Doe" />
                    </FormField>
                    <FormField label="Email *" error={errors.email}>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} placeholder="john@example.com" />
                    </FormField>
                    <FormField label="Phone" error={errors.phone}>
                        <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+1 234 567 890" />
                    </FormField>
                    <FormField label={isEdit ? 'New Password (leave blank to keep)' : 'Password *'} error={errors.password}>
                        <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} placeholder="••••••••" />
                    </FormField>
                    <FormField label="Role *" error={errors.role_id}>
                        <Select value={data.role_id} onChange={e => setData('role_id', e.target.value)} error={errors.role_id}>
                            <option value="">Select role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select>
                    </FormField>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={data.active} onChange={e => setData('active', e.target.checked)} className="rounded" />
                        Active
                    </label>
                    <div className="flex gap-3 pt-2">
                        <SubmitButton processing={processing} label={isEdit ? 'Update User' : 'Create User'} />
                        <Link href="/admin/users" className="px-6 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
