import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function ChatIndex({ chats }) {
    return (
        <MainLayout>
            <Head title="Messages — ZMarket" />
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-black text-gray-900 mb-6">Messages</h1>
                {chats.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-5xl mb-4">💬</p>
                        <p className="text-lg font-medium">No conversations yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <Link key={chat.id} href={`/chat/${chat.id}`} className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
                                    {(chat.store?.name || chat.buyer?.name || '?')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800">{chat.store?.name || chat.buyer?.name}</p>
                                    {chat.product && <p className="text-xs text-indigo-500 truncate">Re: {chat.product.name}</p>}
                                    <p className="text-sm text-gray-500 truncate">{chat.last_message?.message || 'No messages yet'}</p>
                                </div>
                                <p className="text-xs text-gray-400 shrink-0">{chat.last_message_at ? new Date(chat.last_message_at).toLocaleDateString() : ''}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
