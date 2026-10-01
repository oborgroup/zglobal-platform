"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CATEGORIES,
  deriveCategory,
  slugifySub,
  sortProducts,
  SORT_OPTIONS,
  type SortKey,
  type Product,
} from "@/lib/categories";

type Brand = { id: string; name: string };

const PAGE_SIZE = 24;

function thumb(url: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.shopify.com")) return url.replace(/(\.[a-zA-Z]+)(\?|$)/, "_400x$1$2");
  return url;
}

export default function SubCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const sub = params.sub as string;
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("price-desc");
  const [q, setQ] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function load() {
      const { data: b } = await supabase.from("brands").select("id, name").eq("visible", true);
      const { data: p } = await supabase
        .from("products")
        .select("id, name, sku, category, image_url, stock, brand_id, wholesale_price, created_at")
        .eq("visible", true);
      setBrands(b || []);
      setProducts(p || []);
      setLoading(false);
    }
    load();
  }, [slug, sub]);

  const brandName = (id: string) => brands.find((x) => x.id === id)?.name || "";
  const parentTitle = CATEGORIES[slug]?.title || slug;

  const inSub = useMemo(
    () =>
      products.filter((p) => {
        const d = deriveCategory(p.category, brandName(p.brand_id));
        return d.parent === slug && !!d.sub && slugifySub(d.sub) === sub;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, brands, slug, sub]
  );

  const subLabel = useMemo(() => {
    for (const p of products) {
      const d = deriveCategory(p.category, brandName(p.brand_id));
      if (d.parent === slug && d.sub && slugifySub(d.sub) === sub) return d.sub;
    }
    return sub.replace(/-/g, " ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, brands, slug, sub]);

  const query = q.trim().toLowerCase();
  const searched = query
    ? inSub.filter((p) => p.name.toLowerCase().includes(query) || (p.sku || "").toLowerCase().includes(query))
    : inSub;
  const filtered = sortProducts(searched, sort);
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          <a href="/catalog" className="hover:text-[#0d2b5e]">All products</a>
          <span className="mx-2">/</span>
          <a href={`/category/${slug}`} className="hover:text-[#0d2b5e]">{parentTitle}</a>
        </div>
        <h1 className="text-3xl text-[#0d2b5e] mt-3 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
          {subLabel}
        </h1>
        <p className="text-sm text-slate-500 mb-6">{loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Search products or SKU…"
            className="w-full sm:max-w-xs border border-slate-200 rounded-md px-4 py-2 text-sm bg-white focus:outline-none focus:border-[#0d2b5e]"
          />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortKey); setVisibleCount(PAGE_SIZE); }}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-600 focus:outline-none focus:border-[#0d2b5e] sm:ml-auto"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-md aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
            <p className="text-slate-500 mb-6">No products found here.</p>
            <a href={`/category/${slug}`} className="inline-block bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80]">Back to {parentTitle}</a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((p) => <Card key={p.id} p={p} brandName={brandName(p.brand_id)} />)}
            </div>
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );

  function Card({ p, brandName }: { p: Product; brandName: string }) {
    return (
      <a href={`/product/${p.id}`} className="bg-white border border-slate-200 rounded-md overflow-hidden hover:shadow-lg hover:border-[#0d2b5e] transition-all group block">
        <div className="aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
          {p.image_url ? (
            <img src={thumb(p.image_url)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <span className="text-slate-300 text-xs">No image</span>
          )}
        </div>
        <div className="p-4">
          <div className="text-[9px] uppercase tracking-wider text-[#c49a3a] mb-1">{brandName}</div>
          <div className="text-sm text-[#0d2b5e] font-medium leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
          <span className="text-[11px]">{p.stock > 0 ? <span className="text-green-600">In stock</span> : <span className="text-slate-400">Backorder</span>}</span>
        </div>
      </a>
    );
  }
}
