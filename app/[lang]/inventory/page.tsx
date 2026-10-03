"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";
import { useBuyer } from "@/lib/useBuyer";

type Product = { id: string; name: string; sku: string | null; stock: number; brand_id: string };
type Brand = { id: string; name: string };

export default function InventoryPage() {
  const supabase = createClient();
  const { dict } = useLocale();
  const t = dict.inventory;
  const h = useHref();
  const { state, isApproved, loading: authLoading } = useBuyer();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isApproved) return; // live stock is approved-buyers only
    async function load() {
      const { data: b } = await supabase.from("brands").select("id, name").eq("visible", true).order("sort_order");
      const { data: p } = await supabase.from("products").select("id, name, sku, stock, brand_id").eq("visible", true).order("name");
      setBrands(b || []);
      setProducts(p || []);
      setLoading(false);
    }
    load();
  }, [isApproved]); // eslint-disable-line react-hooks/exhaustive-deps

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name || "";
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || (p.sku || "").toLowerCase().includes(q.toLowerCase()));

  const inStock = products.filter((p) => p.stock > 0).length;
  const outStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <h1 className="text-2xl font-semibold text-[#0d2b5e] mb-1">{t.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{t.intro}</p>

        {authLoading ? (
          <p className="text-sm text-slate-400">{dict.cart.checkingAccount}</p>
        ) : !isApproved ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 max-w-lg text-center">
            <div className="w-12 h-12 rounded-full bg-[#eaf1fb] flex items-center justify-center mx-auto mb-4 text-[#0d2b5e] text-xl">🔒</div>
            <h2 className="text-lg font-semibold text-[#0d2b5e] mb-2">{t.gatedTitle}</h2>
            <p className="text-sm text-slate-500 mb-6">
              {state === "pending" ? t.gatedPending : state === "guest" ? t.gatedGuest : t.gatedOther}
            </p>
            {state === "guest" && (
              <div className="flex gap-3 justify-center">
                <a href={h("/login")} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#163d80]">{dict.common.signIn}</a>
                <a href={h("/signup")} className="border border-slate-300 text-[#0d2b5e] text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:border-[#0d2b5e]">{dict.common.requestAccess}</a>
              </div>
            )}
          </div>
        ) : (
        <>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-[#0d2b5e]">{products.length}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">{t.totalSkus}</div></div>
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-green-600">{inStock}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">{t.inStock}</div></div>
          <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-semibold text-slate-400">{outStock}</div><div className="text-xs uppercase tracking-wider text-slate-400 mt-1">{t.backorder}</div></div>
        </div>

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder} className="w-full max-w-md border border-slate-200 rounded-md px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-[#0d2b5e]" />

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">{t.thProduct}</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">{t.thBrand}</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">{t.thSku}</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">{t.thStock}</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">{t.loading}</td></tr>
                ) : filtered.slice(0, 100).map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-[#0d2b5e] font-medium max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{brandName(p.brand_id)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      {p.stock > 0 ? <span className="text-[11px] text-green-600 bg-green-50 px-2 py-1 rounded">{t.inStock}</span> : <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded">{t.backorder}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filtered.length > 100 && <p className="text-xs text-slate-400 mt-3">{t.showingFirst.replace("{n}", String(filtered.length))}</p>}
        </>
        )}
      </main>
      <Footer />
    </div>
  );
}