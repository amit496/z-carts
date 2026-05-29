import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormField, Select, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function ThemePage({ theme, themes = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        theme: theme ?? 'default',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/theme');
    }

    return (
        <AdminLayout title="Theme">
            <PageHeader title="Theme" />
            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4 max-w-xl">
                <FormField label="Active theme" error={errors.theme}>
                    <Select value={data.theme} onChange={e => setData('theme', e.target.value)} error={errors.theme}>
                        {themes.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                </FormField>
                <SubmitButton processing={processing} label="Save" />
            </form>
        </AdminLayout>
    );
}

