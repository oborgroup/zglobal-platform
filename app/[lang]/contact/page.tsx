"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const { dict } = useLocale();
  const t = dict.contact;
  const h = useHref();
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const res = await sendContactMessage(form);
    setSending(false);
    if (!res.ok) { setError(res.error); return; }
    setSent(true);
  }

  const input = "w-full border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#0d2b5e]";
  const label = "block text-xs uppercase tracking-wider text-slate-500 mb-2";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1">
        <div className="bg-[#0d2b5e] text-white">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">{t.eyebrow}</div>
            <h1 className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.title} <em className="text-[#c49a3a]">{t.titleEm}</em></h1>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-5 md:px-14 py-12 grid md:grid-cols-[1fr_320px] gap-10">
          <div className="bg-white border border-slate-200 rounded-lg p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">✓</div>
                <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">{t.sentHeading}</h2>
                <p className="text-sm text-slate-500">{form.name ? t.thanksNamed.replace("{name}", form.name) : t.thanksAnon}</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#0d2b5e] mb-1">{t.formHeading}</h2>
                <p className="text-sm text-slate-500 mb-6">{t.formIntro}</p>
                {error && <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={label}>{t.name} *</label><input className={input} required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
                    <div><label className={label}>{t.email} *</label><input type="email" className={input} required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t.emailPlaceholder} /></div>
                  </div>
                  <div><label className={label}>{t.company}</label><input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
                  <div><label className={label}>{t.subject}</label><input className={input} value={form.subject} onChange={(e) => set("subject", e.target.value)} /></div>
                  <div><label className={label}>{t.message} *</label><textarea className={`${input} min-h-[130px]`} required value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
                  <button type="submit" disabled={sending} className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
                    {sending ? t.sending : t.send}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0d2b5e] mb-3">Z Global B.V.</h3>
              <div className="text-sm text-slate-600 space-y-2">
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">{t.email}</div><a href="mailto:info@zglobalcorp.com" className="text-[#0d2b5e] hover:underline">info@zglobalcorp.com</a></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">{t.sidebarSupport}</div><a href="mailto:support@zglobalcorp.com" className="text-[#0d2b5e] hover:underline">support@zglobalcorp.com</a></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">{t.sidebarPhone}</div><a href="tel:+393453067000" className="text-[#0d2b5e] hover:underline">+39 345 306 7000</a></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">{t.sidebarAddress}</div><span>Parelmoervlinder 10<br />3544 DH Utrecht<br />The Netherlands</span></div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0d2b5e] mb-1">{t.newBuyer}</h3>
              <p className="text-sm text-slate-500 mb-3">{t.newBuyerText}</p>
              <a href={h("/signup")} className="text-sm text-[#0d2b5e] font-medium hover:underline">{t.requestAccess}</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
