import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
export default function Blogs({ blogs }) {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Blog</h1>
                <div className="space-y-6">
                    {blogs.data?.map(blog => (
                        <Link key={blog.id} href={`/blog/${blog.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                            {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-lg mb-4"/>}
                            <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                            <p className="text-gray-400 text-sm mt-2">{blog.created_at}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
