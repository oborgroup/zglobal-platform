"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBuyer } from "@/lib/useBuyer";
import { STATUS_LABEL, STATUS_STYLE, asOrderStatus, type OrderStatus } from "@/lib/orderStatus";

type Brand = { id: string; name: string; slug: string; category: string | null; sku_count: number };
type OrderRow = {
  id: string;
  status: OrderStatus;
  subtotal: number | null;
  currency: string | null;
  created_at: string;
  order_items: { qty: number }[];
};

function fmtDate(s: string) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, state, loading: authLoading } = useBuyer();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState("Your company");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    setEmail(user.email || "");
    setCompany((user.user_metadata?.company_name as string) || "Your company");
    async function load() {
      const [{ data: ord }, { data: brandData }, { count }] = await Promise.all([
        supabase.from("orders").select("id, status, subtotal, currency, created_at, order_items(qty)").order("created_at", { ascending: false }),
        supabase.from("brands").select("id, name, slug, category, sku_count").eq("visible", true).order("sort_order"),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("visible", true),
      ]);
      setOrders(((ord as OrderRow[] | null) || []).map((o) => ({ ...o, status: asOrderStatus(o.status) })));
      setBrands((brandData as Brand[]) || []);
      setProductCount(count || 0);
      setLoading(false);
    }
    load();
  }, [authLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col"><Header /><div className="flex-1 flex items-center justify-center bg-slate-50"><div className="text-slate-400 text-sm">Loading your dashboard…</div></div><Footer /></div>
    );
  }

  const initials = company.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const openOrders = orders.filter((o) => o.status === "pending" || o.status === "approved").length;
  const statusBadge =
    state === "approved" ? { t: "Approved", c: "text-green-700 bg-green-100" }
    : state === "rejected" ? { t: "Not approved", c: "text-red-700 bg-red-100" }
    : state === "admin" ? { t: "Admin", c: "text-[#0d2b5e] bg-[#c49a3a]" }
    : { t: "Pending review", c: "text-amber-800 bg-amber-100" };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <div className="bg-gradient-to-r from-[#0d2b5e] to-[#163d80] rounded-xl p-8 mb-8 text-white flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-[#c49a3a] text-[#0d2b5e] flex items-center justify-center text-2xl font-bold flex-shrink-0">{initials}</div>
          <div>
            <div className="mb-1"><span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded ${statusBadge.c}`}>{statusBadge.t}</span></div>
            <h1 className="text-2xl font-semibold">Welcome, {company}</h1>
            <p className="text-sm text-white/60 mt-1">{email}</p>
          </div>
        </div>

        {state === "pending" && (
          <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
            <span className="font-medium">Your account is under review.</span> Once an admin approves you, you&apos;ll see wholesale pricing and be able to place orders. We review applications within 48 hours.
          </div>
        )}
        {state === "rejected" && (
          <div className="mb-8 rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
            Your wholesale account isn&apos;t approved. If you think this is a mistake, please <a href="/support" className="underline">contact support</a>.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Open orders", value: String(openOrders), note: openOrders ? "In progress" : "None active" },
            { label: "Total orders", value: String(orders.length), note: "All time" },
            { label: "Available products", value: String(productCount), note: "Across all brands" },
            { label: "Account", value: statusBadge.t, note: "Wholesale" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-xl font-semibold text-[#0d2b5e]">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">My orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
                <p className="text-slate-500 mb-5">You haven&apos;t placed any orders yet.</p>
                <a href="/catalog" className="inline-block bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#163d80]">Browse catalog</a>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 border-b border-slate-200 text-left">
                    <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Order</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Date</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Items</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Subtotal</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold text-right">Status</th>
                  </tr></thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-[#0d2b5e] font-mono text-xs">#{o.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-slate-500">{fmtDate(o.created_at)}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{o.order_items?.reduce((n, it) => n + (it.qty || 0), 0) ?? 0}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{o.subtotal != null ? `€${o.subtotal.toFixed(2)}` : "—"}</td>
                        <td className="px-4 py-3 text-right"><span className={`text-[11px] px-2 py-1 rounded ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Account</h2>
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
                <div><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Company</div><div className="text-sm text-[#0d2b5e] font-medium">{company}</div></div>
                <div className="border-t border-slate-100 pt-4"><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Email</div><div className="text-sm text-slate-700 break-all">{email}</div></div>
                <div className="border-t border-slate-100 pt-4"><div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Payment terms</div><div className="text-sm text-slate-700">Bank transfer · NET 30 / 60 for approved accounts</div></div>
              </div>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">Your brands</h2>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
                {brands.map((b) => (
                  <a key={b.id} href="/catalog" className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                    <div><div className="text-sm font-medium text-[#0d2b5e]">{b.name}</div><div className="text-[11px] text-slate-400">{b.category} · {b.sku_count} SKUs</div></div>
                    <span className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Live</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
