"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  stock: number;
  brand_id: string;
};

type Brand = { id: string; name: string; slug: string; website: string | null };

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: prod } = await supabase
        .from("products")
        .select("id, name, sku, category, description, image_url, stock, brand_id")
        .eq("id", id)
        .eq("visible", true)
        .single();

      if (!prod) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProduct(prod);

      const { data: br } = await supabase
        .from("brands")
        .select("id, name, slug, website")
        .eq("id", prod.brand_id)
        .single();
      setBrand(br);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#0d2b5e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-[0.12em] uppercase">
            ZG<span className="text-[#c49a3a]">.</span>lobal
          </a>
          <a href="/login" className="text-xs uppercase tracking-wider bg-[#c49a3a] text-[#0d2b5e] px-5 py-2 rounded-sm font-medium hover:bg-[#d4aa50] transition-colors">
            Sign in
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <a href="/catalog" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e] transition-colors">
          ← Back to catalog
        </a>

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
              ) : (
                <div className="text-slate-300 text-sm">No image available</div>
              )}
            </div>

            <div>
              {brand && (
                <div className="text-[11px] uppercase tracking-[0.15em] text-[#c49a3a] mb-3">{brand.name}</div>
              )}
              <h1 className="text-2xl font-semibold text-[#0d2b5e] leading-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 font-medium">● In stock</span>
                ) : (
                  <span className="text-sm text-slate-400 font-medium">● Backorder</span>
                )}
                {product.sku && <span className="text-xs text-slate-400">SKU: {product.sku}</span>}
              </div>

              <div className="bg-white border border-slate-200 rounded-md p-5 mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Wholesale pricing</div>
                <p className="text-sm text-slate-600 mb-4">Sign in to your wholesale account to view pricing and place orders.</p>
                <a href="/login" className="inline-block bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#163d80] transition-colors">
                  Login for pricing
                </a>
              </div>

              {product.description && (
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Description</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 space-y-2">
                {product.category && (
                  <div className="flex text-sm">
                    <span className="text-slate-400 w-28">Category</span>
                    <span className="text-slate-700">{product.category}</span>
                  </div>
                )}
                {brand?.website && (
                  <div className="flex text-sm">
                    <span className="text-slate-400 w-28">Brand</span>
                    <span className="text-slate-700">{brand.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}