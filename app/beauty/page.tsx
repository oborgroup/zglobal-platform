"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { deriveCategory, slugifySub, type Product } from "@/lib/categories";

type Brand = { id: string; name: string };

export default function BeautyPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: b } = await supabase.from("brands").select("id, name").eq("visible", true);
      const { data: p } = await supabase
        .from("products")
        .select("id, name, category, image_url, stock, brand_id")
        .eq("visible", true);
      setBrands(b || []);
      setProducts(p || []);
      setLoading(false);
    }
    load();
  }, []);

  const brandName = (id: string) => brands.find((x) => x.id === id)?.name || "";

  const beauty = useMemo(
    () => products.filter((p) => deriveCategory(p.category, brandName(p.brand_id)).parent === "beauty"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, brands]
  );

  const subs = useMemo(() => {
    const m: Record<string, { count: number; sample: Product | null }> = {};
    for (const p of beauty) {
      const { sub } = deriveCategory(p.category, brandName(p.brand_id));
      if (!sub) continue;
      if (!m[sub]) m[sub] = { count: 0, sample: null };
      m[sub].count++;
      if ((!m[sub].sample || !m[sub].sample?.image_url) && p.image_url) m[sub].sample = p;
    }
    return Object.entries(m).sort((a, b) => b[1].count - a[1].count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beauty, brands]);

  const featured = useMemo(() => beauty.filter((p) => p.image_url), [beauty]).slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <div className="bg-[#0d2b5e] text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20 relative z-10">
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#c49a3a] mb-4">Beauty &amp; Cosmetics</div>
            <h1 className="text-4xl md:text-6xl font-light leading-[1.05] max-w-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Colour, glow &amp; glam —<br /><span className="italic text-[#c49a3a]">wholesale by SHEGLAM.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xl mt-6">
              {loading ? "Loading the beauty range…" : `${beauty.length} makeup SKUs across ${subs.length} categories — blush, lips, eyes, complexion and more. Full master-carton wholesale, EXW EU.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="/category/beauty" className="bg-[#c49a3a] text-[#0d2b5e] text-xs uppercase tracking-wider font-semibold px-7 py-3 rounded-sm hover:bg-[#d4a94a] transition-colors">
                Shop all beauty
              </a>
              <a href="/signup" className="border border-white/30 text-white text-xs uppercase tracking-wider px-7 py-3 rounded-sm hover:bg-white/10 transition-colors">
                Request wholesale access
              </a>
            </div>
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-2">Shop by category</div>
              <h2 className="text-3xl text-[#0d2b5e]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                Find your <em>finish</em>
              </h2>
            </div>
            <a href="/category/beauty" className="text-xs uppercase tracking-wider text-[#0d2b5e] hover:underline hidden sm:block">All categories →</a>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg aspect-[3/4] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {subs.slice(0, 12).map(([sub, info]) => (
                <a key={sub} href={`/category/beauty/${slugifySub(sub)}`} className="group block">
                  <div className="aspect-[3/4] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center mb-2 group-hover:border-[#0d2b5e] transition-colors">
                    {info.sample?.image_url ? (
                      <img src={info.sample.image_url} alt={sub} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </div>
                  <div className="text-sm font-medium text-[#0d2b5e] leading-tight">{sub}</div>
                  <div className="text-[11px] text-slate-400">{info.count} products</div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* FEATURED PRODUCTS */}
        <div className="bg-[#fdf2f8] border-y border-[#fce7f3]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#be185d] mb-2">Trending now</div>
            <h2 className="text-3xl text-[#0d2b5e] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Bestsellers &amp; <em>new arrivals</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(loading ? Array.from({ length: 12 }).map(() => null) : featured).map((p, i) =>
                p ? (
                  <a key={p.id} href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
                    <div className="aspect-square bg-white overflow-hidden flex items-center justify-center">
                      <img src={p.image_url as string} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <div className="text-[8px] uppercase tracking-wider text-[#c49a3a] mb-1">SHEGLAM</div>
                      <div className="text-[12px] text-[#0d2b5e] font-medium leading-snug line-clamp-2 min-h-[2.2rem]">{p.name}</div>
                    </div>
                  </a>
                ) : (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg aspect-[3/4] animate-pulse" />
                )
              )}
            </div>
            <div className="text-center mt-10">
              <a href="/category/beauty" className="inline-block bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">
                View all beauty products
              </a>
            </div>
          </div>
        </div>

        {/* BRAND STORY */}
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">The brand</div>
              <h2 className="text-3xl text-[#0d2b5e] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                SHEGLAM — <em>viral beauty,</em> wholesale-ready
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SHEGLAM brings trend-driven, social-first makeup to your shelves — blush, liquid tints, lip plumpers, concealers,
                mascaras and complexion essentials that sell. High-pigment formulas and playful collabs, priced for wholesale.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 mb-6">
                <li className="flex gap-2"><span className="text-[#c49a3a]">●</span> Full master-carton pricing, EXW EU</li>
                <li className="flex gap-2"><span className="text-[#c49a3a]">●</span> Live stock from Italy-based warehouses</li>
                <li className="flex gap-2"><span className="text-[#c49a3a]">●</span> NET 30 / 60 terms for approved buyers</li>
              </ul>
              <a href="/signup" className="inline-block bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-7 py-3 rounded-md hover:bg-[#163d80] transition-colors">
                Become a stockist
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((p) => (
                <a key={p.id} href={`/product/${p.id}`} className="aspect-square bg-[#f8fafc] border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center hover:border-[#0d2b5e] transition-colors">
                  <img src={p.image_url as string} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
