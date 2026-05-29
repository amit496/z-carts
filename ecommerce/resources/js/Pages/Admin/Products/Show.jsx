import { Head, Link } from '@inertiajs/react';
import PanelLayout from '@/Layouts/Admin/PanelLayout';
import SectionHeader from '@/Components/Admin/SectionHeader';

function imgUrl(path) {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
}

function SpecCard({ title, children, className = '' }) {
    return (
        <div className={`rounded-[3px] border border-zinc-200 bg-white p-4 shadow-sm ${className}`.trim()}>
            <h3 className="mb-3 border-b border-zinc-100 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{title}</h3>
            {children}
        </div>
    );
}

function DlGrid({ pairs }) {
    return (
        <dl className="grid gap-3 sm:grid-cols-2">
            {pairs.map(([label, val]) => (
                <div key={label}>
                    <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-zinc-900 break-words">{val ?? '—'}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function AdminProductShow({ product }) {
    const imgs = product.images?.length ? product.images : [];
    const primary = imgs.find((im) => im.is_primary)?.image || imgs[0]?.image;
    const mainSrc = primary ? imgUrl(primary) : `https://picsum.photos/seed/${product.id}/560/560`;

    const typeLabel = product.product_type === 'digital' ? 'Digital' : product.product_type === 'service' ? 'Service' : 'Physical';

    const basePrice = Number(product.price);
    const formatMoney = (n) =>
        `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const categoryLines = [...(product.categories || [])];

    const reviewsShown = product.reviews_preview || [];

    return (
        <PanelLayout title={product.name} subtitle="Catalog product — full read-only breakdown. Edit from actions below.">
            <Head title={`${product.name} — Product — Admin`} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 rounded-[3px] border border-zinc-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-zinc-600 shadow-sm hover:bg-zinc-50"
                >
                    <i className="fa-solid fa-arrow-left text-xs" /> Back to products
                </Link>
                {!product.deleted_at_iso ? (
                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-[3px] bg-brand-orange px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm hover:opacity-95"
                    >
                        <i className="fa-solid fa-pen mr-1.5" /> Edit product
                    </Link>
                ) : (
                    <span className="text-[11px] font-semibold text-rose-600">This listing is in trash — restore from the Trash tab on the listing.</span>
                )}
            </div>

            {product.deleted_at_iso && (
                <div className="mb-4 rounded-[3px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
                    <i className="fa-solid fa-trash-can mr-2" />
                    Moved to trash on {new Date(product.deleted_at_iso).toLocaleString()}
                </div>
            )}

            <section className="rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeader title={product.name} subtitle={`${typeLabel} · ${categoryLines.length} categories · ${product.variants_count ?? product.variants?.length ?? 0} variants`} />

                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
                    <div className="space-y-4">
                        <img
                            src={mainSrc}
                            alt=""
                            className="aspect-square w-full rounded-[3px] border border-zinc-100 object-cover"
                        />
                        {imgs.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {imgs.map((im) => {
                                    const s = imgUrl(im.image);
                                    return (
                                        <img
                                            key={im.id}
                                            src={s}
                                            alt=""
                                            className={`aspect-square rounded-[3px] border object-cover ${im.is_primary ? 'ring-2 ring-brand-orange' : 'border-zinc-100'}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 space-y-4">
                        {product.description ? (
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Description</h4>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{product.description}</p>
                            </div>
                        ) : null}

                        <DlGrid
                            pairs={[
                                ['Status', `${product.is_active ? 'Active' : 'Inactive'}${product.is_featured ? ' · Featured' : ''}`],
                                ['Store', product.store_detail?.name || '—'],
                                ['Seller / owner', product.store_detail?.owner_name || '—'],
                                ['Brand', product.brand],
                                ['Rating', product.rating],
                                ['Review count', String(product.reviews_count ?? reviewsShown.length)],
                                ['Inventory (SKU level)', `${product.stock} units parent stock`],
                            ]}
                        />
                    </div>
                </div>
            </section>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
                <SpecCard title="Pricing">
                    <DlGrid
                        pairs={[
                            ['Base price', formatMoney(product.price)],
                            ['Compare-at price', product.compare_price ? formatMoney(product.compare_price) : '—'],
                            ['Requires shipping', product.requires_shipping ? 'Yes' : 'No'],
                        ]}
                    />
                    {product.flash_sale_detail ? (
                        <div className="mt-4 rounded-[3px] border border-amber-100 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Flash sale (latest)</p>
                            <p className="mt-2">
                                Sale price {formatMoney(product.flash_sale_detail.sale_price)} · Active:{' '}
                                {product.flash_sale_detail.is_active ? 'yes' : 'no'}
                                {product.flash_sale_detail.ends_at
                                    ? ` · Ends ${new Date(product.flash_sale_detail.ends_at).toLocaleString()}`
                                    : ''}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-amber-800">
                                Allocation {product.flash_sale_detail.sold} sold / {product.flash_sale_detail.quantity} · Left{' '}
                                {product.flash_sale_detail.remaining}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-3 text-xs text-zinc-400">No flash sale configured for this product.</p>
                    )}
                </SpecCard>

                <SpecCard title="Catalog & taxonomy">
                    <DlGrid
                        pairs={[
                            ['Product type', typeLabel],
                            ['Slug', product.slug],
                            ['Primary category', product.primary_category?.path || product.primary_category?.name || '—'],
                            ['Gender', product.gender || '—'],
                            ['Country of origin', product.origin_country || '—'],
                            ['Material', product.material || '—'],
                            ['Available from', product.available_from || '—'],
                        ]}
                    />
                    {categoryLines.length > 0 && (
                        <>
                            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">All categories</p>
                            <ul className="mt-2 flex flex-wrap gap-1">
                                {categoryLines.map((c) => (
                                    <li
                                        key={c.id}
                                        className="max-w-full truncate rounded-[3px] bg-zinc-50 px-2 py-1 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-100"
                                        title={c.path || c.name}
                                    >
                                        {c.path || c.name}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </SpecCard>

                <SpecCard title="Identification & shipping">
                    <DlGrid
                        pairs={[
                            ['Manufacturer', product.manufacturer || '—'],
                            ['Model number', product.model_number || '—'],
                            ['GTIN', product.gtin || '—'],
                            ['MPN', product.mpn || '—'],
                        ]}
                    />
                </SpecCard>

                <SpecCard title="SEO" className="xl:col-span-1">
                    <DlGrid
                        pairs={[
                            ['Meta title', product.meta_title || '—'],
                            ['Meta description', product.meta_description || '—'],
                        ]}
                    />
                </SpecCard>

                <SpecCard title="Timestamps">
                    <DlGrid pairs={[['Created', product.created_at_formatted], ['Updated', product.updated_at_formatted]]} />
                </SpecCard>
            </div>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Variants" subtitle={`${product.variants?.length ?? 0} SKU rows · unit price = base ${formatMoney(basePrice)} + adjustment`} />
                {product.variants?.length ? (
                    <div className="mt-4 overflow-x-auto rounded-[3px] border border-zinc-100">
                        <table className="min-w-[720px] w-full text-left text-sm">
                            <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                <tr>
                                    <th className="py-3 pl-4 pr-2 font-semibold">SKU</th>
                                    <th className="py-3 pr-2 font-semibold">Size</th>
                                    <th className="py-3 pr-2 font-semibold">Color</th>
                                    <th className="py-3 pr-2 font-semibold text-right">Adj.</th>
                                    <th className="py-3 pr-2 font-semibold text-right">Unit price</th>
                                    <th className="py-3 pr-4 font-semibold text-right">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {product.variants.map((v) => (
                                    <tr key={v.id}>
                                        <td className="py-2 pl-4 pr-2 font-mono text-xs">{v.sku || '—'}</td>
                                        <td className="py-2 pr-2 text-xs font-medium">{v.size || '—'}</td>
                                        <td className="py-2 pr-2">
                                            <div className="flex items-center gap-2">
                                                {v.color_hex ? (
                                                    <span
                                                        className="h-4 w-4 shrink-0 rounded border border-zinc-200"
                                                        style={{ backgroundColor: v.color_hex }}
                                                        title={v.color_hex}
                                                    />
                                                ) : null}
                                                <span className="text-xs">{v.color || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 pr-2 text-right tabular-nums text-xs">${Number(v.price_adjustment).toFixed(2)}</td>
                                        <td className="py-2 pr-2 text-right font-bold tabular-nums">${v.unit_price_formatted}</td>
                                        <td className="py-2 pr-4 text-right tabular-nums">{v.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-zinc-500">No variants — this product relies on parent-level stock only.</p>
                )}
            </section>

            <section className="mt-6 rounded-[3px] border border-zinc-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Reviews (recent)" subtitle="Latest customer feedback synced with storefront" />
                {reviewsShown.length ? (
                    <ul className="mt-4 divide-y divide-zinc-100">
                        {reviewsShown.map((r) => (
                            <li key={r.id} className="py-4 first:pt-0">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="font-semibold text-zinc-900">{r.buyer_name}</span>
                                    <span className="text-[11px] text-zinc-500">{r.created_at_f}</span>
                                </div>
                                <p className="mt-1 text-xs text-amber-700">
                                    ★ {r.rating}/5 {r.is_verified ? <span className="ml-2 text-green-600">Verified buyer</span> : null}
                                </p>
                                {r.comment ? <p className="mt-2 text-sm leading-relaxed text-zinc-700">{r.comment}</p> : null}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-sm text-zinc-500">No reviews recorded yet.</p>
                )}
            </section>
        </PanelLayout>
    );
}
