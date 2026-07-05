"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = { id: string; name: string; sku: string | null; stock: number; brand_id: string };
type Brand = { id: string; name: string };

export default function InventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      const { data: b } = await supabase.from("brands").select("id, name").eq("visible", true).order("sort_order");
      const { data: p } = await supabase.from("products").select("id, name, sku, stock, brand_id").eq("visible", true).order("name");
      setBrands(b || []);
      setProducts(p || []);
      setLoading(false);
    }
    load();
  }, []);

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name || "";
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || (p.sku || "").toLowerCase().includes(q.toLowerCase()));

  const inStock = products.filter((p) => p.stock > 0).length;
  const outStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <h1 className="text-2xl font-semibold text-[#0d2b5e] mb-1">Live Inventory</h1>
        <p className="text-sm text-slate-500 mb-8">Real-time stock levels across all brands.</p>

        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-[#0d2b5e]">{products.length}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Total SKUs</div></div>
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-green-600">{inStock}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">In stock</div></div>
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-slate-400">{outStock}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Backorder</div></div>
        </div>

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by product or SKU…" className="w-full max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-[#0d2b5e]" />

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Product</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Brand</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">SKU</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Stock</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Loading…</td></tr>
                ) : filtered.slice(0, 100).map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[#0d2b5e] font-medium max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{brandName(p.brand_id)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      {p.stock > 0 ? <span className="text-[11px] text-green-600 bg-green-50 px-2 py-1 rounded">In stock</span> : <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded">Backorder</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filtered.length > 100 && <p className="text-xs text-slate-400 mt-3">Showing first 100 of {filtered.length}. Use search to narrow.</p>}
      </main>
      <Footer />
    </div>
  );
}