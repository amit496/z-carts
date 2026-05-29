import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useEffect, useState } from 'react';

const heroImage = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=80';

const promoCards = [
    {
        kicker: 'WIN OVER 4 STAR',
        title: '70% OFF',
        subtitle: 'Mega Sale This Week',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
        bg: 'bg-[#f8cfdb]',
        text: 'text-zinc-900',
    },
    {
        kicker: '',
        title: 'Modern\nFurniture\nstyle',
        subtitle: '',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
        bg: 'bg-[#cfe8b0]',
        text: 'text-zinc-900',
    },
    {
        kicker: 'NEW PRODUCT',
        title: 'SKINCARE',
        subtitle: 'Beauty essence',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        bg: 'bg-white',
        text: 'text-zinc-900',
    },
    {
        kicker: 'NEW SALE',
        title: 'MINIMALIS\nWATCH',
        subtitle: '35%',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
        bg: 'bg-[#11b8ba]',
        text: 'text-white',
    },
];

const twoBanners = [
    {
        title: 'Modern\nFurniture',
        subtitle: 'Up to 25% off',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        badge: '25% Off',
        overlay: 'bg-[#e4a07d]',
        text: 'text-zinc-900',
    },
    {
        title: 'Modern\nFurniture',
        subtitle: 'Up to 50% off',
        image: 'https://images.unsplash.com/photo-1555041469-0d8c2f8c4e75?auto=format&fit=crop&w=1200&q=80',
        badge: 'Hot',
        overlay: 'bg-[#d8ece7]',
        text: 'text-zinc-900',
    },
];

const threePromo = [
    {
        title: 'HEADPHONES',
        kicker: 'NEW ARRIVAL',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'TIRES',
        kicker: 'HOT ITEMS',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    },
    {
        title: 'SHOP NOW',
        kicker: 'AUTO STYLE',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    },
];

const listColumns = [
    {
        title: 'Baby Bloss..',
        color: 'text-pink-500',
        items: [],
    },
    {
        title: 'Lady Charm',
        color: 'text-rose-500',
        items: [],
    },
    {
        title: 'Color Fusi..',
        color: 'text-brand-orange',
        items: [],
    },
];

function getImage(product, fallbackSeed = 'product') {
    const img = product?.images?.[0]?.image;
    if (img) return img.startsWith('http') ? img : `/storage/${img}`;
    return `https://picsum.photos/seed/${product?.id ?? fallbackSeed}/400/500`;
}

function compactPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function SmallCard({ product, href }) {
    return (
        <Link href={href} className="group block rounded-sm border border-zinc-200 bg-white p-1.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="bg-zinc-50">
                <img src={getImage(product)} alt={product.name} className="h-24 w-full object-cover" />
            </div>
            <div className="px-1.5 pb-1.5 pt-1">
                <p className="h-8 overflow-hidden text-[11px] leading-4 text-zinc-700">{product.name}</p>
                <div className="mt-1 flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-brand-orange">{compactPrice(product.price)}</span>
                    {product.compare_price && <span className="text-[10px] text-zinc-400 line-through">{compactPrice(product.compare_price)}</span>}
                </div>
            </div>
        </Link>
    );
}

function ListItem({ product, href }) {
    return (
        <Link href={href} className="flex items-center gap-3 rounded-sm border-b border-zinc-100 py-2 last:border-b-0">
            <img src={getImage(product)} alt={product.name} className="h-12 w-12 rounded-sm border border-zinc-200 object-cover" />
            <div className="min-w-0">
                <p className="truncate text-[11px] leading-4 text-zinc-700">{product.name}</p>
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-brand-orange">{compactPrice(product.price)}</span>
                    {product.compare_price && <span className="text-[10px] text-zinc-400 line-through">{compactPrice(product.compare_price)}</span>}
                </div>
            </div>
        </Link>
    );
}

function SectionTitle({ title, icon = 'fa-fire', actions = null }) {
    return (
        <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-1 text-[13px] font-semibold text-zinc-900">
                {title}
                <i className={`fa-solid ${icon} text-[11px] text-brand-orange`} />
            </h2>
            {actions}
        </div>
    );
}

export default function Home({ flashSales = [], featured = [], newArrivals = [], categories = [], wishlistIds = [], dealOfDay = null, brands = [] }) {
    const [timeLeft, setTimeLeft] = useState({ d: '03', h: '17', m: '09', s: '00' });

    useEffect(() => {
        if (!Array.isArray(flashSales) || !flashSales.length) {
            return;
        }

        const tick = () => {
            const end = new Date(flashSales[0]?.ends_at);
            const diff = end - new Date();

            if (Number.isNaN(diff) || diff <= 0) {
                setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
                return;
            }

            setTimeLeft({
                d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
                h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
                m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
                s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
            });
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [flashSales]);

    const topCategories = Array.isArray(categories) ? categories.slice(0, 8) : [];
    const flashItems = Array.isArray(flashSales) && flashSales.length
        ? flashSales.slice(0, 7).map((sale) => ({
              id: sale.id,
              product: sale.product,
              price: sale.sale_price,
              compare_price: sale.product?.price,
          }))
        : (Array.isArray(featured) ? featured.slice(0, 7) : []).map((product) => ({
              id: product.id,
              product,
              price: product.flash_sale?.sale_price ?? product.price,
              compare_price: product.price,
          }));

    const trendingItems = (Array.isArray(featured) ? featured : []).slice(0, 7);
    const recentItems = (Array.isArray(newArrivals) ? newArrivals : []).slice(0, 7);
    const bestFinds = (Array.isArray(featured) ? featured : []).slice(0, 7);
    const featureList = [
        (Array.isArray(featured) ? featured : []).slice(0, 4),
        (Array.isArray(newArrivals) ? newArrivals : []).slice(0, 4),
        flashItems.slice(0, 4).map((item) => item.product),
    ];
    const brandLabels = (Array.isArray(brands) && brands.length ? brands.slice(0, 6) : ['HYDE', 'Furniture', 'GARNIVA', 'KNN', 'M', 'MILK']);

    const spotlight = dealOfDay || featured[0] || newArrivals[0];

    return (
        <MainLayout>
            <Head title="zCart Marketplace" />

            <div className="mx-auto max-w-[1040px] px-3 py-3 sm:px-4">
                <section className="relative overflow-hidden rounded-[3px] bg-white">
                    <div className="grid grid-cols-12">
                        <div className="col-span-1 hidden items-start justify-center p-3 sm:flex">
                            <button className="mt-2 rounded-sm border border-zinc-200 bg-white p-2 text-[12px] text-zinc-700 shadow-sm">
                                <i className="fa-solid fa-grip" />
                            </button>
                        </div>
                        <div className="col-span-12 sm:col-span-11">
                            <div className="relative h-[170px] overflow-hidden rounded-[3px] sm:h-[235px]">
                                <img src={heroImage} alt="Furniture banner" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/0" />
                                <div className="absolute left-6 top-8 text-zinc-900 sm:left-8 sm:top-10">
                                    <h1 className="font-display text-[38px] leading-[0.9] tracking-tight sm:text-[64px]">NEW</h1>
                                    <h1 className="font-display text-[38px] leading-[0.9] tracking-tight sm:text-[64px]">FURNITURE</h1>
                                    <p className="mt-3 text-[11px] text-zinc-500 sm:text-[12px]">Make your home look elegant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {promoCards.map((card) => (
                        <article key={card.title} className={`relative h-[92px] overflow-hidden rounded-[3px] ${card.bg} p-3`}>
                            <div className="relative z-10 max-w-[62%]">
                                {card.kicker && <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">{card.kicker}</p>}
                                <h3 className={`mt-1 whitespace-pre-line font-display text-[22px] leading-[0.92] ${card.text}`}>{card.title}</h3>
                                {card.subtitle && <p className="mt-1 text-[10px] text-zinc-500">{card.subtitle}</p>}
                            </div>
                            <img
                                src={card.image}
                                alt=""
                                className="absolute right-[-6px] bottom-[-8px] h-[84px] w-[84px] rounded-full object-cover opacity-90"
                            />
                        </article>
                    ))}
                </section>

                <section className="mt-4">
                    <SectionTitle title="Featured Categories" icon="fa-fire" />
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                        {topCategories.map((category) => (
                            <Link key={category.id} href={`/shop?category=${category.slug}`} className="group flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition group-hover:scale-105">
                                    <img
                                        src={category.image || `https://picsum.photos/seed/${category.id}/120/120`}
                                        alt={category.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                </div>
                                <span className="mt-2 text-[10px] text-zinc-700">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[13px] font-semibold text-zinc-900">Flash Deal</h2>
                            <i className="fa-solid fa-bolt text-[11px] text-brand-orange" />
                            <span className="ml-1 rounded-[2px] bg-brand-orange px-2 py-0.5 text-[9px] font-semibold uppercase text-white">
                                End in
                            </span>
                            <div className="hidden text-[9px] text-zinc-500 sm:block">Offer Ends in:</div>
                            <div className="flex items-center gap-1">
                                {[
                                    ['d', 'days'],
                                    ['h', 'hrs'],
                                    ['m', 'mins'],
                                    ['s', 'secs'],
                                ].map(([key, label]) => (
                                    <span key={key} className="rounded-[2px] bg-brand-orange px-2 py-0.5 text-[9px] font-semibold text-white">
                                        {timeLeft[key]} {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button className="h-6 w-6 rounded-[2px] border border-zinc-200 bg-white text-[10px] text-zinc-500">
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button className="h-6 w-6 rounded-[2px] border border-zinc-200 bg-white text-[10px] text-zinc-500">
                                <i className="fa-solid fa-chevron-right" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {flashItems.map((item) => (
                            <SmallCard key={item.id} product={item.product} href={`/product/${item.product.slug}`} />
                        ))}
                    </div>
                </section>

                <section className="mt-6 grid gap-3 lg:grid-cols-[2fr_1fr]">
                    <article className="grid gap-3 rounded-[3px] bg-white p-3 sm:grid-cols-[1.2fr_0.8fr]">
                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="inline-flex rounded-[2px] border border-brand-orange px-2 py-0.5 text-[9px] font-semibold uppercase text-brand-orange">
                                    New
                                </span>
                                <h3 className="mt-2 text-[14px] font-semibold text-zinc-900">Sed dolorem dolor accusandi.</h3>
                                <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                                    Et omnis nostrum sint mollitia. Nihil ipsam nobis tenore aspernatur quae. Consequatur voluptatem velit incidunt minus dolore!
                                </p>
                                <div className="mt-3 grid grid-cols-4 gap-1">
                                    {[
                                        ['03', 'days'],
                                        ['17', 'hrs'],
                                        ['09', 'mins'],
                                        ['00', 'secs'],
                                    ].map(([value, label]) => (
                                        <div key={label} className="rounded-[2px] bg-zinc-900 py-1 text-center text-white">
                                            <div className="text-[11px] font-semibold">{value}</div>
                                            <div className="text-[8px] uppercase text-zinc-400">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3">
                                <button className="rounded-[2px] bg-brand-orange px-3 py-1.5 text-[10px] font-semibold text-white">
                                    <i className="fa-solid fa-cart-shopping mr-1" />
                                    ADD TO CART
                                </button>
                            </div>
                        </div>

                        <div className="relative flex items-end justify-center rounded-[3px] bg-zinc-50 p-2">
                            <span className="absolute left-2 top-2 rounded-[2px] border border-brand-orange px-2 py-0.5 text-[9px] font-semibold text-brand-orange">
                                42% Off
                            </span>
                            <img
                                src={getImage(spotlight || featured[0] || newArrivals[0] || {})}
                                alt=""
                                className="h-[200px] w-full object-cover"
                            />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[16px] font-bold text-brand-orange">
                                $222.77 <span className="text-[10px] font-normal text-zinc-400 line-through">$381.00</span>
                            </div>
                        </div>
                    </article>

                    <aside className="rounded-[3px] bg-white p-3">
                        <SectionTitle
                            title="Featured Items"
                            icon="fa-star"
                            actions={
                                <div className="flex gap-1">
                                    <button className="h-6 w-6 rounded-[2px] border border-zinc-200 bg-white text-[10px] text-zinc-500">
                                        <i className="fa-solid fa-chevron-left" />
                                    </button>
                                    <button className="h-6 w-6 rounded-[2px] border border-zinc-200 bg-white text-[10px] text-zinc-500">
                                        <i className="fa-solid fa-chevron-right" />
                                    </button>
                                </div>
                            }
                        />
                        <div className="space-y-3">
                            {(Array.isArray(featured) ? featured : []).slice(0, 4).map((product) => (
                                <ListItem key={product.id} product={product} href={`/product/${product.slug}`} />
                            ))}
                        </div>
                    </aside>
                </section>

                <section className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {twoBanners.map((banner, index) => (
                        <article key={banner.title + index} className={`relative h-[108px] overflow-hidden rounded-[3px] ${banner.overlay}`}>
                            <img src={banner.image} alt="" className="h-full w-full object-cover opacity-70" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="rounded-full bg-white/85 px-3 py-2 text-center text-zinc-900 shadow-sm">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Up to</div>
                                    <div className="font-display text-[22px] leading-none">25%</div>
                                    <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Off</div>
                                </div>
                            </div>
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${banner.text} text-center`}>
                                <h3 className="whitespace-pre-line font-display text-[26px] leading-[0.9]">Modern Furniture</h3>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="mt-6">
                    <SectionTitle
                        title="Trending Now"
                        icon="fa-fire"
                        actions={
                            <div className="flex items-center gap-1">
                                {['LATEST', 'NEW ARRIVALS', 'BEST SELLER', 'COMING SOON'].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`rounded-[2px] border px-2 py-1 text-[9px] font-semibold uppercase ${i === 0 ? 'border-brand-orange bg-white text-brand-orange' : 'border-zinc-200 bg-white text-zinc-500'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        }
                    />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {trendingItems.map((product) => (
                            <SmallCard key={product.id} product={product} href={`/product/${product.slug}`} />
                        ))}
                    </div>
                </section>

                <section className="mt-6 grid gap-3 lg:grid-cols-[2fr_1fr]">
                    <article className="rounded-[3px] bg-zinc-900 p-3 text-white">
                        <SectionTitle
                            title="Deal Of The Day"
                            icon="fa-fire"
                            actions={<span className="text-[9px] text-zinc-400">Hot Deal</span>}
                        />
                        <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                            <img
                                src={getImage(spotlight || featured[0] || {})}
                                alt=""
                                className="h-[220px] w-full rounded-[3px] object-cover"
                            />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-[18px] font-semibold leading-6 text-white">
                                        Totam et voluptatem quia dolorum est perferendis.
                                    </h3>
                                    <p className="mt-2 text-brand-orange text-[16px] font-bold">$296.04</p>
                                    <p className="mt-2 text-[10px] leading-4 text-zinc-300">
                                        Eum laborum assumenda impedit consectetur. Iusto nam voluptatem quam quod.
                                    </p>
                                    <div className="mt-3">
                                        <div className="text-[10px] font-semibold text-zinc-200">Key Features</div>
                                        <ul className="mt-2 space-y-1 text-[10px] text-zinc-300">
                                            <li>• Free shipping on selected products</li>
                                            <li>• Quick dispatch and secure checkout</li>
                                            <li>• 100% authentic marketplace items</li>
                                            <li>• Easy returns and buyer support</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <button className="rounded-[2px] bg-yellow-400 px-3 py-1.5 text-[10px] font-semibold text-zinc-900">
                                        <i className="fa-solid fa-cart-shopping mr-1" />
                                        Add to Cart
                                    </button>
                                    <button className="rounded-[2px] border border-zinc-700 px-3 py-1.5 text-[10px] text-zinc-300">
                                        <i className="fa-regular fa-heart mr-1" />
                                        Add to Wishlist
                                    </button>
                                    <button className="rounded-[2px] border border-zinc-700 px-3 py-1.5 text-[10px] text-zinc-300">
                                        <i className="fa-solid fa-check mr-1" />
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <aside className="rounded-[3px] bg-white p-3">
                        <SectionTitle title="Featured Items" icon="fa-star" />
                        <div className="space-y-2">
                            {featureList.flat().slice(0, 4).map((product) => (
                                <ListItem key={product.id} product={product} href={`/product/${product.slug}`} />
                            ))}
                        </div>
                    </aside>
                </section>

                <section className="mt-6">
                    <article className="relative h-[92px] overflow-hidden rounded-[3px] bg-pink-200">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <h3 className="font-display text-[28px] leading-[0.9] text-zinc-900">DESIGNERS</h3>
                            <h3 className="font-display text-[28px] leading-[0.9] text-zinc-900">COLLECTION</h3>
                            <p className="mt-1 text-[10px] tracking-[0.24em] text-zinc-600">OLIVIA WILSON</p>
                        </div>
                        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1">
                            {[
                                'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80',
                                'https://images.unsplash.com/photo-1496747611176-7f7b5d5d9f1b?auto=format&fit=crop&w=400&q=80',
                                'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
                            ].map((src) => (
                                <img key={src} src={src} alt="" className="h-[92px] w-[70px] object-cover" />
                            ))}
                        </div>
                        <p className="absolute bottom-2 right-3 text-[9px] uppercase tracking-[0.24em] text-zinc-700">Helena Packer</p>
                    </article>
                </section>

                <section className="mt-6">
                    <SectionTitle title="Recently Added" icon="fa-fire" />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {recentItems.map((product) => (
                            <SmallCard key={product.id} product={product} href={`/product/${product.slug}`} />
                        ))}
                    </div>
                </section>

                <section className="mt-5 grid gap-2 sm:grid-cols-3">
                    {threePromo.map((promo) => (
                        <article key={promo.title} className="relative h-[72px] overflow-hidden rounded-[3px]">
                            <img src={promo.image} alt="" className="h-full w-full object-cover brightness-[0.55]" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                                <p className="text-[9px] uppercase tracking-[0.22em] text-yellow-300">{promo.kicker}</p>
                                <h3 className="font-display text-[20px] leading-[0.9]">{promo.title}</h3>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                        { ...listColumns[0], items: (Array.isArray(newArrivals) ? newArrivals : []).slice(0, 5) },
                        { ...listColumns[1], items: (Array.isArray(featured) ? featured : []).slice(0, 5) },
                        { ...listColumns[2], items: flashItems.slice(0, 5).map((item) => item.product) },
                    ].map((column) => (
                        <article key={column.title} className="rounded-[3px] bg-white p-3">
                            <div className="mb-2 flex items-center justify-between border-b border-zinc-100 pb-2">
                                <h3 className={`text-[13px] font-semibold ${column.color}`}>{column.title}</h3>
                                <span className="text-[9px] text-zinc-400">view all</span>
                            </div>
                            <div>
                                {column.items.map((product) => (
                                    <ListItem key={product.id} product={product} href={`/product/${product.slug}`} />
                                ))}
                            </div>
                        </article>
                    ))}
                </section>

                <section className="mt-6">
                    <SectionTitle title="Featured Brands" icon="fa-fire" />
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {brandLabels.map((brand) => (
                            <Link key={brand} href={`/shop?brand=${brand}`} className="flex h-[42px] items-center justify-center rounded-[3px] border border-zinc-200 bg-white text-[12px] font-semibold italic text-zinc-700">
                                {brand}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-6 overflow-hidden rounded-[3px] bg-white p-2">
                    <img
                        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=80"
                        alt=""
                        className="h-[120px] w-full object-cover"
                    />
                </section>

                <section className="mt-6">
                    <SectionTitle title="Best Finds Under $99" icon="fa-star" />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {bestFinds.map((product) => (
                            <SmallCard key={product.id} product={product} href={`/product/${product.slug}`} />
                        ))}
                    </div>
                </section>

                <section className="mt-5 grid gap-2 sm:grid-cols-2">
                    <article className="relative h-[80px] overflow-hidden rounded-[3px] bg-[#b7ad8a]">
                        <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80" alt="" className="h-full w-full object-cover opacity-65" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                            <p className="text-[9px] uppercase tracking-[0.22em]">Special Promo</p>
                            <h3 className="font-display text-[20px] leading-[0.9]">30% Off</h3>
                            <button className="mt-1 rounded-[2px] bg-white px-2 py-1 text-[9px] font-semibold text-zinc-900">Buy Now</button>
                        </div>
                    </article>
                    <article className="relative h-[80px] overflow-hidden rounded-[3px] bg-zinc-900">
                        <img src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80" alt="" className="h-full w-full object-cover opacity-45" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                            <p className="text-[9px] uppercase tracking-[0.22em]">New Promotion</p>
                            <h3 className="font-display text-[20px] leading-[0.9]">Shop Now</h3>
                            <button className="mt-1 rounded-[2px] bg-yellow-400 px-2 py-1 text-[9px] font-semibold text-zinc-900">Shop Now</button>
                        </div>
                    </article>
                </section>
            </div>
        </MainLayout>
    );
}
