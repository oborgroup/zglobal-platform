"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase";
import { useBuyer } from "@/lib/useBuyer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

const EMPTY = {
  company_name: "", first_name: "", last_name: "", phone: "", vat: "",
  address: "", address2: "", country: "", city: "", postcode: "",
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const { dict } = useLocale();
  const a = dict.account;
  const au = dict.auth;
  const h = useHref();
  const { user, state, loading: authLoading } = useBuyer();

  const [form, setForm] = useState({ ...EMPTY });
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(h("/login")); return; }
    setEmail(user.email || "");
    const m = (user.user_metadata || {}) as Record<string, string>;
    setForm({
      company_name: m.company_name || "", first_name: m.first_name || "", last_name: m.last_name || "",
      phone: m.phone || "", vat: m.vat || "", address: m.address || "", address2: m.address2 || "",
      country: m.country || "", city: m.city || "", postcode: m.postcode || "",
    });
  }, [authLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof typeof EMPTY>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); setSaved(false); }

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSaving(true); setSaved(false);
    const { error } = await supabase.auth.updateUser({ data: { ...form } });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null); setPwDone(false);
    if (pw.length < 6) { setPwError(au.errPwMin); return; }
    if (pw !== pw2) { setPwError(au.errPwMatch); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setPwSaving(false);
    if (error) { setPwError(error.message); return; }
    setPw(""); setPw2(""); setPwDone(true);
  }

  const input = "w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e]";
  const label = "block text-xs uppercase tracking-wider text-slate-500 mb-1.5";
  const card = "bg-white border border-slate-200 rounded-lg p-6";

  const badge =
    state === "approved" ? { t: dict.dash.badgeApproved, c: "text-green-700 bg-green-100" }
    : state === "rejected" ? { t: dict.dash.badgeRejected, c: "text-red-700 bg-red-100" }
    : state === "admin" ? { t: dict.dash.badgeAdmin, c: "text-[#0d2b5e] bg-[#c49a3a]" }
    : { t: dict.dash.badgePending, c: "text-amber-800 bg-amber-100" };

  if (authLoading || !user) {
    return <div className="min-h-screen flex flex-col"><Header /><div className="flex-1 flex items-center justify-center bg-slate-50"><div className="text-slate-400 text-sm">{dict.cart.checkingAccount}</div></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-5 md:px-14 py-10">
        <a href={h("/dashboard")} className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#0d2b5e]">{a.backToDashboard}</a>
        <div className="flex items-center gap-3 mt-3 mb-1">
          <h1 className="text-2xl font-semibold text-[#0d2b5e]">{a.title}</h1>
          <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded ${badge.c}`}>{badge.t}</span>
        </div>
        <p className="text-sm text-slate-500 mb-8">{a.intro}</p>

        <form onSubmit={saveDetails} className="space-y-6">
          <div className={card}>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{a.companyInfo}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={label}>{au.companyName}</label><input className={input} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></div>
              <div><label className={label}>{au.firstName}</label><input className={input} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} /></div>
              <div><label className={label}>{au.lastName}</label><input className={input} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} /></div>
              <div><label className={label}>{au.phone}</label><input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><label className={label}>{au.vat}</label><input className={input} value={form.vat} onChange={(e) => set("vat", e.target.value)} /></div>
            </div>
          </div>

          <div className={card}>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{a.addressInfo}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={label}>{au.street}</label><input className={input} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={label}>{au.address2}</label><input className={input} value={form.address2} onChange={(e) => set("address2", e.target.value)} /></div>
              <div><label className={label}>{au.city}</label><input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><label className={label}>{au.postcode}</label><input className={input} value={form.postcode} onChange={(e) => set("postcode", e.target.value)} /></div>
              <div><label className={label}>{au.country}</label><input className={input} value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
            </div>
          </div>

          {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
              {saving ? a.saving : a.save}
            </button>
            {saved && <span className="text-sm text-green-600">✓ {a.saved}</span>}
          </div>
        </form>

        <div className={`${card} mt-6`}>
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-1">{a.emailInfo}</h2>
          <p className="text-sm text-slate-700">{email}</p>
          <p className="text-xs text-slate-400 mt-1">{a.emailNote}</p>
        </div>

        <form onSubmit={savePassword} className={`${card} mt-6`}>
          <h2 className="text-sm uppercase tracking-wider text-slate-500 mb-4">{a.passwordInfo}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={label}>{au.newPassword}</label><input type="password" className={input} value={pw} onChange={(e) => { setPw(e.target.value); setPwDone(false); }} placeholder={au.passwordMin} /></div>
            <div><label className={label}>{au.confirmPassword}</label><input type="password" className={input} value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder={au.reenterPassword} /></div>
          </div>
          {pwError && <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{pwError}</div>}
          <div className="flex items-center gap-4 mt-4">
            <button type="submit" disabled={pwSaving || !pw} className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
              {pwSaving ? a.saving : au.setPassword}
            </button>
            {pwDone && <span className="text-sm text-green-600">✓ {a.pwSaved}</span>}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
