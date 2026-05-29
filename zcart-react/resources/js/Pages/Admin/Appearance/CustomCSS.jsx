import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormField, SubmitButton, PageHeader } from '@/Components/FormComponents';

export default function CustomCssPage({ css }) {
    const { data, setData, post, processing, errors } = useForm({
        css: css ?? '/* Custom CSS */\n',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/customcss');
    }

    return (
        <AdminLayout title="Custom CSS">
            <PageHeader title="Custom CSS" />
            <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
                <FormField label="CSS" error={errors.css}>
                    <textarea
                        rows={16}
                        value={data.css}
                        onChange={e => setData('css', e.target.value)}
                        className={`w-full font-mono text-xs border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.css ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                </FormField>
                <SubmitButton processing={processing} label="Save" />
            </form>
        </AdminLayout>
    );
}

