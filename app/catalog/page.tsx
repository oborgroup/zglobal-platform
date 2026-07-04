"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  image_url: string | null;
  stock: number;
  brand_id: string;
};

type Brand = { id: string; name: string; slug: string };

export default function CatalogPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: brandData } = await supabase
        .from("brands").select("id, name, slug").eq("visible", true).order("sort_order");
      const { data: productData } = await supabase
        .from("products").select("id, name, sku, category, image_url, stock, brand_id").eq("visible", true).order("name");
      setBrands(brandData || []);
      setProducts(productData || []);
      setLoading(false);
    }
    load();
  }, []);

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name || "";
  const filtered = activeBrand === "all" ? products : products.filter((p) => p.brand_id === activeBrand);

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
            <button onClick={() => setActiveBrand("all")} className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-sm border transition-colors ${activeBrand === "all" ? "bg-[#0d2b5e] text-white border-[#0d2b5e]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d2b5e]"}`}>All Products</button>
            {brands.map((b) => (
              <button key={b.id} onClick={() => setActiveBrand(b.id)} className={`text-[11px] uppercase tracking-wider px-4 py-2 rounded-sm border transition-colors ${activeBrand === b.id ? "bg-[#0d2b5e] text-white border-[#0d2b5e]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d2b5e]"}`}>{b.name}</button>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pb-20">
          {loading ? (
            <div className="text-center text-slate-400 py-20 text-sm">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-slate-400 py-20 text-sm">No products found.</div>
          ) : (
            <>
              <div className="text-xs text-slate-400 mb-4">{filtered.length} products</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p) => (
                  <a key={p.id} href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
                    <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="text-slate-300 text-xs">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-[9px] uppercase tracking-wider text-[#c49a3a] mb-1">{brandName(p.brand_id)}</div>
                      <div className="text-sm text-[#0d2b5e] font-medium leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {p.stock > 0 ? <span className="text-green-600">In stock</span> : <span className="text-slate-400">Backorder</span>}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#0d2b5e] border-b border-slate-200">View details</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}