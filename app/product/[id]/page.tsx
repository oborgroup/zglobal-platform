"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addToCart } from "@/lib/cart";

type Product = {
  id: string; name: string; sku: string | null; category: string | null;
  description: string | null; image_url: string | null; stock: number;
  brand_id: string; retail_price: number | null; moq: number | null;
};
type Brand = { id: string; name: string; slug: string; website: string | null };
type Variant = {
  id: string; option1_name: string | null; option1_value: string | null;
  option2_name: string | null; option2_value: string | null;
  sku: string | null; retail_price: number | null; stock: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [opt1, setOpt1] = useState<string>("");
  const [opt2, setOpt2] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: prod } = await supabase
        .from("products").select("id, name, sku, category, description, image_url, stock, brand_id, retail_price, moq")
        .eq("id", id).eq("visible", true).single();
      if (!prod) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);
      const { data: br } = await supabase.from("brands").select("id, name, slug, website").eq("id", prod.brand_id).single();
      setBrand(br);
      const { data: vars } = await supabase.from("product_variants").select("*").eq("product_id", id);
      setVariants(vars || []);
      if (prod.moq && prod.moq > 1) setQty(prod.moq);
      setLoading(false);
    }
    load();
  }, [id]);

  const opt1Name = variants.find((v) => v.option1_name)?.option1_name || null;
  const opt2Name = variants.find((v) => v.option2_name)?.option2_name || null;
  const opt1Values = Array.from(new Set(variants.map((v) => v.option1_value).filter(Boolean))) as string[];
  const opt2Values = Array.from(new Set(variants.map((v) => v.option2_value).filter(Boolean))) as string[];

  const selectedVariant = variants.find(
    (v) => (!opt1 || v.option1_value === opt1) && (!opt2 || v.option2_value === opt2)
  );

  const displayPrice = selectedVariant?.retail_price ?? product?.retail_price ?? null;
  const moq = product?.moq && product.moq > 1 ? product.moq : 1;

  function handleAdd() {
    if (!product) return;
    const variantLabel = [opt1, opt2].filter(Boolean).join(" / ") || null;
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image_url,
      brandName: brand?.name || "",
      variant: variantLabel,
      price: displayPrice || 0,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-8">
        <a href="/catalog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e] transition-colors">← Back to catalog</a>

        {loading ? (
          <div className="text-center text-slate-400 py-32 text-sm">Loading…</div>
        ) : notFound ? (
          <div className="text-center text-slate-400 py-32">
            <p className="text-sm mb-4">Product not found.</p>
            <a href="/catalog" className="text-[#0d2b5e] text-sm hover:underline">Return to catalog</a>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-10 mt-6">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (<div className="text-slate-300 text-sm">No image available</div>)}
            </div>

            <div>
              {brand && <div className="text-[11px] uppercase tracking-[0.15em] text-[#c49a3a] mb-3">{brand.name}</div>}
              <h1 className="text-2xl font-semibold text-[#0d2b5e] leading-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-5">
                {(selectedVariant?.stock ?? product.stock) > 0 ? (
                  <span className="text-sm text-green-600 font-medium">● In stock</span>
                ) : (
                  <span className="text-sm text-slate-400 font-medium">● Backorder</span>
                )}
                {(selectedVariant?.sku || product.sku) && (
                  <span className="text-xs text-slate-400">SKU: {selectedVariant?.sku || product.sku}</span>
                )}
              </div>

              <div className="mb-6">
                {displayPrice && displayPrice > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-[#0d2b5e]">€{displayPrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">RRP incl. VAT</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Price on request</span>
                )}
                <p className="text-xs text-slate-400 mt-1">Wholesale pricing available for approved buyers.</p>
              </div>

              {opt1Name && opt1Values.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{opt1Name}</label>
                  <select value={opt1} onChange={(e) => setOpt1(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]">
                    <option value="">Select {opt1Name.toLowerCase()}…</option>
                    {opt1Values.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}
              {opt2Name && opt2Values.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{opt2Name}</label>
                  <select value={opt2} onChange={(e) => setOpt2(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]">
                    <option value="">Select {opt2Name.toLowerCase()}…</option>
                    {opt2Values.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Quantity {moq > 1 && <span className="text-slate-400 normal-case">· MOQ {moq} units</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button onClick={() => setQty((q) => Math.max(moq, q - 1))} className="px-4 py-2.5 text-slate-500 hover:text-[#0d2b5e] text-lg">−</button>
                    <input type="number" value={qty} min={moq} onChange={(e) => setQty(Math.max(moq, parseInt(e.target.value) || moq))} className="w-16 text-center border-x border-slate-200 py-2.5 text-sm focus:outline-none" />
                    <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-slate-500 hover:text-[#0d2b5e] text-lg">+</button>
                  </div>
                  {displayPrice && displayPrice > 0 && (
                    <span className="text-sm text-slate-500">Subtotal: <span className="font-semibold text-[#0d2b5e]">€{(displayPrice * qty).toFixed(2)}</span></span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button onClick={handleAdd} className="flex-1 bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#163d80] transition-colors flex items-center justify-center gap-2">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                  {added ? "Added ✓" : "Add to Cart"}
                </button>
                <button className="flex-1 border border-[#0d2b5e] text-[#0d2b5e] text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#0d2b5e] hover:text-white transition-colors">
                  Request a Quote
                </button>
              </div>

              {product.description && (
                <div className="mb-6 border-t border-slate-200 pt-6">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Description</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 space-y-2">
                {product.category && <div className="flex text-sm"><span className="text-slate-400 w-28">Category</span><span className="text-slate-700">{product.category}</span></div>}
                {brand?.website && <div className="flex text-sm"><span className="text-slate-400 w-28">Brand</span><span className="text-slate-700">{brand.website}</span></div>}
                {variants.length > 0 && <div className="flex text-sm"><span className="text-slate-400 w-28">Variants</span><span className="text-slate-700">{variants.length} available</span></div>}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}