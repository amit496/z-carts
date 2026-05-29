import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

export default function AdminRoles({ roles }) {
    return (
        <PanelLayout title="User Roles" subtitle="Platform role definitions and user counts.">
            <Head title="User Roles — Admin" />
            <section className="rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm">
                <SectionHeader title="Roles" subtitle="Each user is assigned one of these roles." />
                <div className="grid gap-4 sm:grid-cols-3 mt-2">
                    {roles.map(r => (
                        <div key={r.name} className={`rounded-[3px] border p-5 ${r.color.replace('bg-', 'border-').replace('100', '200')} ${r.color}`}>
                            <p className="text-3xl font-black">{r.count}</p>
                            <p className="text-sm font-bold mt-1">{r.label}</p>
                            <p className="text-[11px] opacity-70 mt-0.5 capitalize">Role: {r.name}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-[3px] border border-zinc-100 p-4">
                    <p className="text-sm font-semibold text-zinc-700 mb-3">Role Permissions</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-[10px] uppercase tracking-widest text-zinc-400">
                                <tr>
                                    <th className="py-2 pr-6 text-left">Permission</th>
                                    <th className="py-2 pr-6 text-center">Admin</th>
                                    <th className="py-2 pr-6 text-center">Seller</th>
                                    <th className="py-2 text-center">Buyer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Admin Panel Access', true, false, false],
                                    ['Seller Panel Access', true, true, false],
                                    ['Manage Products', true, true, false],
                                    ['Manage Orders', true, true, false],
                                    ['Place Orders', true, true, true],
                                    ['Write Reviews', true, true, true],
                                    ['Manage Users', true, false, false],
                                    ['Manage Stores', true, false, false],
                                ].map(([perm, ...vals]) => (
                                    <tr key={perm} className="border-t border-zinc-100">
                                        <td className="py-2.5 pr-6 text-zinc-700">{perm}</td>
                                        {vals.map((v, i) => (
                                            <td key={i} className="py-2.5 pr-6 text-center">
                                                {v ? <i className="fa-solid fa-check text-emerald-500" /> : <i className="fa-solid fa-xmark text-zinc-300" />}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </PanelLayout>
    );
}
