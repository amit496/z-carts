import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminBlogs() {
    return (
        <PanelLayout title="Blogs" subtitle="Manage blog posts and articles.">
            <Head title="Blogs — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Blog Posts" subtitle="Create and manage blog content for the storefront."
                    actions={<button className="rounded-[3px] bg-brand-orange px-4 py-2 text-xs font-semibold text-white">+ New Post</button>}
                />
                <div className="py-16 text-center">
                    <i className="fa-solid fa-newspaper text-4xl text-zinc-200 mb-4" />
                    <p className="text-sm font-semibold text-zinc-500">No blog posts yet</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Create your first blog post to engage customers.</p>
                    <button className="mt-4 rounded-[3px] bg-brand-orange px-6 py-2 text-sm font-semibold text-white">Create First Post</button>
                </div>
            </section>
        </PanelLayout>
    );
}
