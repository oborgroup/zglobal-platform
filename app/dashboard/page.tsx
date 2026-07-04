"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [joined, setJoined] = useState<string>("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setCompany((user.user_metadata?.company_name as string) || "Your company");
      if (user.created_at) {
        setJoined(new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0d2b5e] text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-[0.12em] uppercase">
            ZG<span className="text-[#c49a3a]">.</span>lobal
          </a>
          <div className="flex items-center gap-5">
            <a href="/catalog" className="text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors">Catalog</a>
            <button onClick={handleLogout} className="text-xs uppercase tracking-wider bg-white/10 border border-white/20 px-4 py-2 rounded-sm hover:bg-white/20 transition-colors">Log out</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-2">Wholesale Account</div>
          <h1 className="text-3xl font-semibold text-[#0d2b5e]">Welcome, {company}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your wholesale account and browse the full catalog.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Open orders", value: "0" },
            { label: "Total orders", value: "0" },
            { label: "Pending invoices", value: "0" },
            { label: "Account status", value: "Active" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-2xl font-semibold text-[#0d2b5e]">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Quick actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/catalog" className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0d2b5e] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-3 text-[#0d2b5e]">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v4H3zM3 10h18v11H3z"/></svg>
                </div>
                <div className="text-[#0d2b5e] font-medium mb-1">Browse catalog</div>
                <div className="text-xs text-slate-500">Explore all products across every brand</div>
              </a>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-60">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">My orders</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-60">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">Invoices</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 opacity-60">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>
                </div>
                <div className="text-slate-600 font-medium mb-1">Volume pricing</div>
                <div className="text-xs text-slate-400">Coming soon</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Account details</h2>
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Company</div>
                <div className="text-sm text-[#0d2b5e] font-medium">{company}</div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Email</div>
                <div className="text-sm text-slate-700 break-all">{email}</div>
              </div>
              {joined && (
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Member since</div>
                  <div className="text-sm text-slate-700">{joined}</div>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Payment terms</div>
                <div className="text-sm text-slate-700">NET 30 / 60</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}