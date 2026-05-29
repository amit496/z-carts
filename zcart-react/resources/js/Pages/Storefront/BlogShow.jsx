import MainLayout from '@/Layouts/MainLayout';
export default function BlogShow({ blog }) {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto px-4 py-10">
                {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-6"/>}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{blog.title}</h1>
                <p className="text-gray-400 text-sm mb-6">{blog.created_at}</p>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content }}/>
            </div>
        </MainLayout>
    );
}
