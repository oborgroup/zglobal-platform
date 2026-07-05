"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = { id: string; name: string; category: string | null; image_url: string | null; stock: number; brand_id: string; created_at: string };
type Brand = { id: string; name: string };

function thumb(url: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.shopify.com")) return url.replace(/(\.[a-zA-Z]+)(\?|$)/, "_400x$1$2");
  return url;
}

const CATEGORY_MAP: Record<string, { title: string; match: (p: Product, brandName: string) => boolean }> = {
  "outdoor": { title: "Outdoor & Sports", match: (p, bn) => bn === "OutdoorMaster" || (p.category || "").toLowerCase().includes("sport") || (p.category || "").toLowerCase().includes("outdoor") },
  "home": { title: "Home & Living", match: (p, bn) => bn === "Vakume Home" || bn === "RedKey" || (p.category || "").toLowerCase().includes("home") },
  "electronics": { title: "Electronics", match: (p) => (p.category || "").toLowerCase().includes("electronic") },
  "new-arrivals": { title: "New Arrivals", match: () => true },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const config = CATEGORY_MAP[slug] || { title: slug, match: () => true };

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

  let filtered = products.filter((p) => config.match(p, brandName(p.brand_id)));
  if (slug === "new-arrivals") {
    filtered = [...products].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).slice(0, 24);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <a href="/catalog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e]">← All products</a>
        <h1 className="text-3xl text-[#0d2b5e] mt-4 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{config.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{loading ? "Loading…" : `${filtered.length} products`}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-white border border-slate-200 rounded-md aspect-square animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
            <p className="text-slate-500 mb-6">No products in this category yet.</p>
            <a href="/catalog" className="inline-block bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80]">Browse all</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <a key={p.id} href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
                <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
                  {p.image_url ? <img src={thumb(p.image_url)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <span className="text-slate-300 text-xs">No image</span>}
                </div>
                <div className="p-4">
                  <div className="text-[9px] uppercase tracking-wider text-[#c49a3a] mb-1">{brandName(p.brand_id)}</div>
                  <div className="text-sm text-[#0d2b5e] font-medium leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
                  <span className="text-[11px]">{p.stock > 0 ? <span className="text-green-600">In stock</span> : <span className="text-slate-400">Backorder</span>}</span>
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