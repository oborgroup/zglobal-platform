"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addToCart } from "@/lib/cart";
import { useBuyer } from "@/lib/useBuyer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

type Product = {
  id: string; name: string; sku: string | null; category: string | null;
  description: string | null; image_url: string | null; stock: number;
  brand_id: string; retail_price: number | null; wholesale_price: number | null; moq: number | null;
};
type Brand = { id: string; name: string; slug: string; website: string | null };
type Variant = {
  id: string; option1_name: string | null; option1_value: string | null;
  option2_name: string | null; option2_value: string | null;
  sku: string | null; retail_price: number | null; wholesale_price: number | null; stock: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const router = useRouter();
  const { dict } = useLocale();
  const t = dict.product;
  const h = useHref();
  const { isApproved, state } = useBuyer();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [opt1, setOpt1] = useState<string>("");
  const [opt2, setOpt2] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: prod } = await supabase
        .from("products").select("id, name, sku, category, description, image_url, stock, brand_id, retail_price, wholesale_price, moq")
        .eq("id", id).eq("visible", true).single();
      if (!prod) { setNotFound(true); setLoading(false); return; }
      setProduct(prod);
      // Gallery images (tolerant: the image_urls column may not exist yet)
      let imgs: string[] = [];
      const { data: g } = await supabase.from("products").select("image_urls").eq("id", id).single();
      const arr = (g as { image_urls?: unknown } | null)?.image_urls;
      if (Array.isArray(arr)) imgs = arr.filter((u): u is string => typeof u === "string");
      if (imgs.length === 0 && prod.image_url) imgs = [prod.image_url];
      setGallery(imgs);
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

  const wholesale = selectedVariant?.wholesale_price ?? product?.wholesale_price ?? null;
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
      price: isApproved ? wholesale ?? 0 : 0,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleOrder() {
    handleAdd();
    router.push(h("/cart"));
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-8">
        <a href={h("/catalog")} className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e] transition-colors">{t.backToCatalog}</a>

        {loading ? (
          <div className="text-center text-slate-400 py-32 text-sm">{t.loading}</div>
        ) : notFound ? (
          <div className="text-center text-slate-400 py-32">
            <p className="text-sm mb-4">{t.notFound}</p>
            <a href={h("/catalog")} className="text-[#0d2b5e] text-sm hover:underline">{t.returnToCatalog}</a>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            <div>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center mb-3">
                {gallery.length > 0 ? (
                  <img src={gallery[activeImg] || gallery[0]} alt={product.name} className="w-full h-full object-contain" />
                ) : (<div className="text-slate-300 text-sm">{t.noImage}</div>)}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${i === activeImg ? "border-[#0d2b5e]" : "border-slate-200 hover:border-slate-400"}`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {brand && <div className="text-[11px] uppercase tracking-[0.15em] text-[#c49a3a] mb-3">{brand.name}</div>}
              <h1 className="text-2xl font-semibold text-[#0d2b5e] leading-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-5">
                {(selectedVariant?.stock ?? product.stock) > 0 ? (
                  <span className="text-sm text-green-600 font-medium">● {t.inStock}</span>
                ) : (
                  <span className="text-sm text-slate-400 font-medium">● {t.backorder}</span>
                )}
                {(selectedVariant?.sku || product.sku) && (
                  <span className="text-xs text-slate-400">{t.sku} {selectedVariant?.sku || product.sku}</span>
                )}
              </div>

              <div className="mb-6">
                {isApproved ? (
                  wholesale != null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-[#0d2b5e]">€{wholesale.toFixed(2)}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">{t.wholesaleUnit}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">{t.priceOnRequest}</span>
                  )
                ) : state === "guest" ? (
                  <div className="text-sm text-slate-600"><a href={h("/login")} className="text-[#0d2b5e] font-medium hover:underline">{t.signIn}</a> {t.signInToSee}</div>
                ) : state === "pending" ? (
                  <div className="text-sm text-amber-700">{t.pendingPricing}</div>
                ) : (
                  <div className="text-sm text-slate-500">{t.approvedPricing}</div>
                )}
              </div>

              {opt1Name && opt1Values.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{opt1Name}</label>
                  <select value={opt1} onChange={(e) => setOpt1(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]">
                    <option value="">{t.select} {opt1Name.toLowerCase()}…</option>
                    {opt1Values.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}
              {opt2Name && opt2Values.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{opt2Name}</label>
                  <select value={opt2} onChange={(e) => setOpt2(e.target.value)} className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#0d2b5e]">
                    <option value="">{t.select} {opt2Name.toLowerCase()}…</option>
                    {opt2Values.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                  {t.quantity} {moq > 1 && <span className="text-slate-400 normal-case">· {t.moq.replace("{n}", String(moq))}</span>}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button onClick={() => setQty((q) => Math.max(moq, q - 1))} className="px-4 py-2.5 text-slate-500 hover:text-[#0d2b5e] text-lg">−</button>
                    <input type="number" value={qty} min={moq} onChange={(e) => setQty(Math.max(moq, parseInt(e.target.value) || moq))} className="w-16 text-center border-x border-slate-200 py-2.5 text-sm focus:outline-none" />
                    <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-slate-500 hover:text-[#0d2b5e] text-lg">+</button>
                  </div>
                  {isApproved && wholesale != null && (
                    <span className="text-sm text-slate-500">{t.subtotal} <span className="font-semibold text-[#0d2b5e]">€{(wholesale * qty).toFixed(2)}</span></span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button onClick={handleAdd} className="flex-1 bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#163d80] transition-colors flex items-center justify-center gap-2">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                  {added ? t.added : t.addToCart}
                </button>
                <button onClick={handleOrder} className="flex-1 border border-[#0d2b5e] text-[#0d2b5e] text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#0d2b5e] hover:text-white transition-colors">
                  {t.addAndGo}
                </button>
              </div>

              {product.description && (
                <div className="mb-6 border-t border-slate-200 pt-6">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">{t.description}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 space-y-2">
                {product.category && <div className="flex text-sm"><span className="text-slate-400 w-28">{t.category}</span><span className="text-slate-700">{product.category}</span></div>}
                {brand?.website && <div className="flex text-sm"><span className="text-slate-400 w-28">{t.brand}</span><span className="text-slate-700">{brand.website}</span></div>}
                {variants.length > 0 && <div className="flex text-sm"><span className="text-slate-400 w-28">{t.variants}</span><span className="text-slate-700">{t.available.replace("{n}", String(variants.length))}</span></div>}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}