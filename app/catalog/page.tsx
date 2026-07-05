"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
  id: string; name: string; sku: string | null; category: string | null;
  image_url: string | null; stock: number; brand_id: string;
};
type Brand = { id: string; name: string; slug: string };

function cleanCategory(cat: string | null): string {
  if (!cat || cat.toLowerCase() === "uncategorized" || cat.toLowerCase() === "accessori") return "";
  const top = cat.split(">")[0].trim();
  const map: Record<string, string> = {
    "Home & Garden": "Home", "Sporting Goods": "Outdoor", "Electronics": "Electronics",
    "Apparel & Accessories": "Apparel", "Luggage & Bags": "Bags", "Hardware": "Hardware",
  };
  return map[top] || top;
}
function thumb(url: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.shopify.com")) return url.replace(/(\.[a-zA-Z]+)(\?|$)/, "_400x$1$2");
  return url;
}

const PAGE_SIZE = 24;

export default function CatalogPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function load() {
      const { data: brandData } = await supabase.from("brands").select("id, name, slug").eq("visible", true).order("sort_order");
      const { data: productData } = await supabase.from("products").select("id, name, sku, category, image_url, stock, brand_id").eq("visible", true).order("name");
      setBrands(brandData || []);
      setProducts(productData || []);
      setLoading(false);
    }
    load();
  }, []);

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name || "";
  const filtered = activeBrand === "all" ? products : products.filter((p) => p.brand_id === activeBrand);
  const visible = filtered.slice(0, visibleCount);

  function selectBrand(id: string) {
    setActiveBrand(id);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-10 pb-6">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-2">Product Catalog</div>
          <h1 className="text-3xl text-[#0d2b5e]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Browse the <em>full range</em>
          </h1>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pb-6">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => selectBrand("all")} className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-sm border transition-colors ${activeBrand === "all" ? "bg-[#0d2b5e] text-white border-[#0d2b5e]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d2b5e]"}`}>All Products</button>
            {brands.map((b) => (
              <button key={b.id} onClick={() => selectBrand(b.id)} className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-sm border transition-colors ${activeBrand === b.id ? "bg-[#0d2b5e] text-white border-[#0d2b5e]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d2b5e]"}`}>{b.name}</button>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pb-20">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-slate-100"></div>
                  <div className="p-4 space-y-2"><div className="h-2 bg-slate-100 rounded w-1/3"></div><div className="h-3 bg-slate-100 rounded w-full"></div></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400 mb-4">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((p) => <Card key={p.id} p={p} brandName={brandName(p.brand_id)} />)}
              </div>
              {visibleCount < filtered.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">
                    Load more products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );

  function Card({ p, brandName }: { p: Product; brandName: string }) {
    const cat = cleanCategory(p.category);
    return (
      <a href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
        <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center relative">
          {cat && <span className="absolute top-2 left-2 bg-white/90 text-[9px] uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-sm">{cat}</span>}
          {p.image_url ? (
            <img src={thumb(p.image_url)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (<div className="text-slate-300 text-xs">No image</div>)}
        </div>
        <div className="p-4">
          <div className="text-[9px] uppercase tracking-wider text-[#c49a3a] mb-1">{brandName}</div>
          <div className="text-sm text-[#0d2b5e] font-medium leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]">{p.stock > 0 ? <span className="text-green-600">In stock</span> : <span className="text-slate-400">Backorder</span>}</span>
            <span className="text-[10px] uppercase tracking-wider text-[#0d2b5e] border-b border-slate-200">View details</span>
          </div>
        </div>
      </a>
    );
  }
}