import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useEffect, useRef } from 'react';

export default function ChatShow({ chat }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({ message: '' });
    const bottomRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.messages]);

    const send = (e) => {
        e.preventDefault();
        if (!data.message.trim()) return;
        post(`/chat/${chat.id}/message`, { onSuccess: () => reset() });
    };

    const other = auth.user.id === chat.buyer_id ? chat.store?.name : chat.buyer?.name;

    return (
        <MainLayout>
            <Head title={`Chat — ${other}`} />
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col" style={{ height: '70vh' }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b">
                        <Link href="/chat" className="text-gray-400 hover:text-gray-600">←</Link>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                            {(other || '?')[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{other}</p>
                            {chat.product && <p className="text-xs text-indigo-500">Re: {chat.product.name}</p>}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chat.messages.map(msg => {
                            const mine = msg.sender_id === auth.user.id;
                            return (
                                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${mine ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                                        <p>{msg.message}</p>
                                        <p className={`text-xs mt-1 ${mine ? 'text-indigo-200' : 'text-gray-400'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={send} className="p-4 border-t flex gap-2">
                        <input type="text" value={data.message} onChange={e => setData('message', e.target.value)} placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
                        <button type="submit" disabled={processing} className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 text-lg">→</button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
