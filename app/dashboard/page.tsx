"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Brand = { id: string; name: string; slug: string; category: string | null; sku_count: number };

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [joined, setJoined] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setCompany((user.user_metadata?.company_name as string) || "Your company");
      if (user.created_at) {
        setJoined(new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
      }
      const { data: brandData } = await supabase.from("brands").select("id, name, slug, category, sku_count").eq("visible", true).order("sort_order");
      setBrands(brandData || []);
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("visible", true);
      setProductCount(count || 0);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-slate-400 text-sm">Loading your dashboard…</div>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = company.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <div className="bg-gradient-to-r from-[#0d2b5e] to-[#163d80] rounded-xl p-8 mb-8 text-white flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-[#c49a3a] text-[#0d2b5e] flex items-center justify-center text-2xl font-bold flex-shrink-0">{initials}</div>
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-1">Wholesale Account · Active</div>
            <h1 className="text-2xl font-semibold">Welcome, {company}</h1>
            <p className="text-sm text-white/60 mt-1">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Open orders", value: "0", note: "No active orders" },
            { label: "Total spend", value: "€0", note: "This year" },
            { label: "Available products", value: String(productCount), note: "Across all brands" },
            { label: "Payment terms", value: "NET 60", note: "Approved" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-2xl font-semibold text-[#0d2b5e]">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Quick actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/catalog" className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0d2b5e] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-3 text-[#0d2b5e]">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v4H3zM3 10h18v11H3z"/></svg>
                </div>
                <div className="text-[#0d2b5e] font-medium mb-1">Browse catalog</div>
                <div className="text-xs text-slate-500">Explore all {productCount} products</div>
              </a>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-70">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">My orders</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-70">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">Invoices</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-70">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">Volume pricing</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
            </div>

            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4 mt-8">Getting started</h2>
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
              {[
                { done: true, text: "Account created" },
                { done: true, text: "Email verified" },
                { done: false, text: "Browse the product catalog" },
                { done: false, text: "Place your first order" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${item.done ? "bg-green-500 text-white" : "border-2 border-slate-200 text-transparent"}`}>✓</div>
                  <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Account details</h2>
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
                <div><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Company</div><div className="text-sm text-[#0d2b5e] font-medium">{company}</div></div>
                <div className="border-t border-slate-100 pt-4"><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Email</div><div className="text-sm text-slate-700 break-all">{email}</div></div>
                {joined && <div className="border-t border-slate-100 pt-4"><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Member since</div><div className="text-sm text-slate-700">{joined}</div></div>}
                <div className="border-t border-slate-100 pt-4"><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Payment terms</div><div className="text-sm text-slate-700">NET 30 / 60</div></div>
              </div>
            </div>

            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Your brands</h2>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
                {brands.map((b) => (
                  <a key={b.id} href="/catalog" className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-sm font-medium text-[#0d2b5e]">{b.name}</div>
                      <div className="text-[11px] text-slate-400">{b.category} · {b.sku_count} SKUs</div>
                    </div>
                    <span className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Live</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[#0d2b5e] font-medium">Need help getting started?</div>
            <div className="text-sm text-slate-500">Our team can help set up your account and answer questions.</div>
          </div>
          <a href="#" className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#163d80] transition-colors whitespace-nowrap">Contact support</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}