import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

const SAMPLE_FAQS = [
    { id: 1, question: 'How do I place an order?', answer: 'Browse products, add to cart, and proceed to checkout.' },
    { id: 2, question: 'What payment methods are accepted?', answer: 'We accept credit cards, debit cards, and online banking.' },
    { id: 3, question: 'How can I track my order?', answer: 'You can track your order from the Orders section in your account.' },
    { id: 4, question: 'What is the return policy?', answer: 'Items can be returned within 30 days of delivery.' },
];

export default function AdminFaqs() {
    const [faqs] = useState(SAMPLE_FAQS);
    const { data, setData, reset } = useForm({ question: '', answer: '' });

    return (
        <PanelLayout title="FAQs" subtitle="Manage frequently asked questions.">
            <Head title="FAQs — Admin" />
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="Add FAQ" subtitle="Add a new question and answer." />
                    <div className="space-y-3">
                        <input value={data.question} onChange={e => setData('question', e.target.value)} placeholder="Question" className="w-full rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange" />
                        <textarea value={data.answer} onChange={e => setData('answer', e.target.value)} placeholder="Answer" rows={4} className="w-full rounded-[3px] border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-orange resize-none" />
                        <button className="rounded-[3px] bg-brand-orange px-4 py-2 text-sm font-semibold text-white">Add FAQ</button>
                    </div>
                </section>
                <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                    <SectionHeader title="FAQ List" subtitle="All published FAQs." />
                    <div className="space-y-3">
                        {faqs.map(f => (
                            <div key={f.id} className="rounded-[3px] border border-zinc-100 p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900">{f.question}</p>
                                        <p className="text-[11px] text-zinc-500 mt-1">{f.answer}</p>
                                    </div>
                                    <button className="text-[11px] font-semibold text-rose-600 shrink-0">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PanelLayout>
    );
}
