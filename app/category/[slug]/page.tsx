"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CATEGORIES, deriveCategory, slugifySub, type Product } from "@/lib/categories";

type Brand = { id: string; name: string };

function thumb(url: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.shopify.com")) return url.replace(/(\.[a-zA-Z]+)(\?|$)/, "_400x$1$2");
  return url;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const config = CATEGORIES[slug] || { title: slug };

  useEffect(() => {
    async function load() {
      const { data: b } = await supabase.from("brands").select("id, name").eq("visible", true);
      const { data: p } = await supabase.from("products").select("id, name, category, image_url, stock, brand_id, created_at").eq("visible", true).order("name");
      setBrands(b || []);
      setProducts(p || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name || "";

  if (slug === "new-arrivals") {
    const newest = [...products].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).slice(0, 24);
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
          <a href="/catalog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e]">← All products</a>
          <h1 className="text-3xl text-[#0d2b5e] mt-4 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>New Arrivals</h1>
          <p className="text-sm text-slate-500 mb-8">{loading ? "Loading…" : `${newest.length} products`}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newest.map((p) => <ProductCard key={p.id} p={p} brandName={brandName(p.brand_id)} />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inCategory = products.filter((p) => deriveCategory(p.category, brandName(p.brand_id)).parent === slug);

  const subMap: Record<string, { count: number; sample: Product | null }> = {};
  for (const p of inCategory) {
    const { sub } = deriveCategory(p.category, brandName(p.brand_id));
    if (!sub) continue;
    if (!subMap[sub]) subMap[sub] = { count: 0, sample: null };
    subMap[sub].count++;
    if (!subMap[sub].sample && p.image_url) subMap[sub].sample = p;
  }
  const subs = Object.entries(subMap).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <a href="/catalog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e]">← All products</a>
        <h1 className="text-3xl text-[#0d2b5e] mt-4 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{config.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{loading ? "Loading…" : `${inCategory.length} products · ${subs.length} categories`}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white border border-slate-200 rounded-lg aspect-[4/3] animate-pulse" />)}
          </div>
        ) : subs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
            <p className="text-slate-500 mb-6">No products in this category yet.</p>
            <a href="/catalog" className="inline-block bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80]">Browse all</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {subs.map(([sub, info]) => (
              <a key={sub} href={`/category/${slug}/${slugifySub(sub)}`} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group">
                <div className="aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center">
                  {info.sample?.image_url ? (
                    <img src={thumb(info.sample.image_url)} alt={sub} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : <span className="text-slate-300 text-xs">—</span>}
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-[#0d2b5e]">{sub}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{info.count} {info.count === 1 ? "product" : "products"}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ p, brandName }: { p: Product; brandName: string }) {
  return (
    <a href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
      <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
        {p.image_url ? <img src={thumb(p.image_url)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <span className="text-slate-300 text-xs">No image</span>}
      </div>
      <div className="p-4">
        <div className="text-[9px] uppercase tracking-wider text-[#c49a3a] mb-1">{brandName}</div>
        <div className="text-sm text-[#0d2b5e] font-medium leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
        <span className="text-[11px]">{p.stock > 0 ? <span className="text-green-600">In stock</span> : <span className="text-slate-400">Backorder</span>}</span>
      </div>
    </a>
  );
}