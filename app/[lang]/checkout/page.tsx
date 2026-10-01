"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCart, saveCart, type CartItem } from "@/lib/cart";
import { useBuyer } from "@/lib/useBuyer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";
import { createOrder } from "./actions";

const empty = {
  contact_name: "", contact_email: "", company: "", phone: "", vat: "",
  ship_address: "", ship_address2: "", ship_city: "", ship_postcode: "", ship_country: "", notes: "",
};

export default function CheckoutPage() {
  const supabase = createClient();
  const { dict } = useLocale();
  const t = dict.checkout;
  const h = useHref();
  const { user, state, isApproved, loading } = useBuyer();
  const [items, setItems] = useState<CartItem[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [form, setForm] = useState({ ...empty });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setItems(getCart()); setMounted(true); }, []);

  useEffect(() => {
    if (!user) return;
    const m = (user.user_metadata || {}) as Record<string, string>;
    setForm((f) => ({
      ...f,
      contact_name: f.contact_name || [m.first_name, m.last_name].filter(Boolean).join(" "),
      contact_email: f.contact_email || user.email || "",
      company: f.company || m.company_name || "",
      phone: f.phone || m.phone || "",
      vat: f.vat || m.vat || "",
      ship_address: f.ship_address || m.address || "",
      ship_address2: f.ship_address2 || m.address2 || "",
      ship_city: f.ship_city || m.city || "",
      ship_postcode: f.ship_postcode || m.postcode || "",
      ship_country: f.ship_country || m.country || "",
    }));
  }, [user]);

  useEffect(() => {
    if (items.length === 0) return;
    const ids = [...new Set(items.map((i) => i.productId))];
    supabase.from("products").select("id, wholesale_price").in("id", ids).then(({ data }) => {
      const map: Record<string, number | null> = {};
      (data as { id: string; wholesale_price: number | null }[] | null || []).forEach((p) => (map[p.id] = p.wholesale_price));
      setPrices(map);
    });
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = useMemo(
    () => items.reduce((s, it) => { const p = prices[it.productId]; return s + (p != null ? p * it.qty : 0); }, 0),
    [items, prices]
  );

  function set<K extends keyof typeof empty>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await createOrder({
      ...form,
      items: items.map((i) => ({ productId: i.productId, variant: i.variant, qty: i.qty })),
    });
    setSubmitting(false);
    if (!res.ok) { setError(res.error); return; }
    saveCart([]);
    setOrderId(res.orderId);
  }

  const input = "w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e]";
  const label = "block text-xs uppercase tracking-wider text-slate-500 mb-1.5";

  function Shell({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">{children}</main>
        <Footer />
      </div>
    );
  }

  function Notice({ title, body, cta }: { title: string; body: string; cta?: React.ReactNode }) {
    return (
      <Shell>
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-lg p-10 text-center mt-6">
          <h1 className="text-xl font-semibold text-[#0d2b5e] mb-2">{title}</h1>
          <p className="text-sm text-slate-500 mb-6">{body}</p>
          {cta}
        </div>
      </Shell>
    );
  }

  if (!mounted || loading) return <Notice title={t.loading} body="" />;

  if (orderId) {
    return (
      <Notice
        title={t.orderReceivedTitle}
        body={t.orderReceivedBody}
        cta={<div className="flex gap-3 justify-center"><a href={h("/dashboard")} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#163d80]">{t.viewOrders}</a><a href={h("/catalog")} className="border border-slate-300 text-[#0d2b5e] text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:border-[#0d2b5e]">{t.keepBrowsing}</a></div>}
      />
    );
  }

  if (state === "guest")
    return <Notice title={t.signInTitle} body={t.signInBody} cta={<a href={h("/login")} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#163d80]">{dict.common.signIn}</a>} />;
  if (state === "pending")
    return <Notice title={t.pendingTitle} body={t.pendingBody} cta={<a href={h("/dashboard")} className="text-[#0d2b5e] text-sm font-medium hover:underline">{t.goToDashboard}</a>} />;
  if (state === "rejected")
    return <Notice title={t.rejectedTitle} body={t.rejectedBody} cta={<a href={h("/support")} className="text-[#0d2b5e] text-sm font-medium hover:underline">{t.contactSupport}</a>} />;
  if (!isApproved)
    return <Notice title={t.notAvailableTitle} body={t.notAvailableBody} />;
  if (items.length === 0)
    return <Notice title={t.emptyTitle} body={t.emptyBody} cta={<a href={h("/catalog")} className="bg-[#0d2b5e] text-white text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#163d80]">{dict.cart.browseCatalog}</a>} />;

  return (
    <Shell>
      <h1 className="text-2xl font-semibold text-[#0d2b5e] mb-1">{t.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{t.intro}</p>

      {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{t.contact}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>{t.contactName} *</label><input className={input} required value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></div>
              <div><label className={label}>{t.email} *</label><input type="email" className={input} required value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
              <div><label className={label}>{t.company}</label><input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
              <div><label className={label}>{t.phone}</label><input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><label className={label}>{t.vat}</label><input className={input} value={form.vat} onChange={(e) => set("vat", e.target.value)} /></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{t.deliveryAddress}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={label}>{t.street} *</label><input className={input} required value={form.ship_address} onChange={(e) => set("ship_address", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={label}>{t.address2}</label><input className={input} value={form.ship_address2} onChange={(e) => set("ship_address2", e.target.value)} /></div>
              <div><label className={label}>{t.city} *</label><input className={input} required value={form.ship_city} onChange={(e) => set("ship_city", e.target.value)} /></div>
              <div><label className={label}>{t.postcode}</label><input className={input} value={form.ship_postcode} onChange={(e) => set("ship_postcode", e.target.value)} /></div>
              <div><label className={label}>{t.country} *</label><input className={input} required value={form.ship_country} onChange={(e) => set("ship_country", e.target.value)} /></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <label className={label}>{t.orderNotes}</label>
            <textarea className={`${input} min-h-[80px]`} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t.notesPlaceholder} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{t.orderSummary}</h2>
            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
              {items.map((it, i) => {
                const p = prices[it.productId];
                return (
                  <div key={i} className="flex justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="text-[#0d2b5e] font-medium truncate">{it.name}</div>
                      <div className="text-xs text-slate-400">{t.qty} {it.qty}{it.variant ? ` · ${it.variant}` : ""}</div>
                    </div>
                    <div className="text-slate-600 whitespace-nowrap">{p != null ? `€${(p * it.qty).toFixed(2)}` : "—"}</div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-sm mb-1"><span className="text-slate-500">{t.subtotalWholesale}</span><span className="font-semibold text-[#0d2b5e]">€{subtotal.toFixed(2)}</span></div>
            <p className="text-[11px] text-slate-400 mb-4">{t.excludesNote}</p>
            <button type="submit" disabled={submitting} className="w-full bg-[#0d2b5e] text-white text-sm uppercase tracking-wider py-3.5 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
              {submitting ? t.submitting : t.submitOrder}
            </button>
            <a href={h("/cart")} className="block text-center text-[#0d2b5e] text-sm py-2 mt-1 hover:underline">{t.backToCart}</a>
          </div>
        </div>
      </form>
    </Shell>
  );
}
