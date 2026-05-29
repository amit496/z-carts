import MainLayout from '@/Layouts/MainLayout';

export default function Page({ page }) {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>
                <div className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </MainLayout>
    );
}
