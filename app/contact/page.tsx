"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
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
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">Contact</div>
            <h1 className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Get in <em className="text-[#c49a3a]">touch</em></h1>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-5 md:px-14 py-12 grid md:grid-cols-[1fr_320px] gap-10">
          <div className="bg-white border border-slate-200 rounded-lg p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-green-600 text-xl">✓</div>
                <h2 className="text-xl font-semibold text-[#0d2b5e] mb-2">Message sent</h2>
                <p className="text-sm text-slate-500">Thanks, {form.name || "there"}. We&apos;ll get back to you within one business day.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#0d2b5e] mb-1">Send us a message</h2>
                <p className="text-sm text-slate-500 mb-6">For wholesale enquiries, orders and support.</p>
                {error && <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={label}>Name *</label><input className={input} required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
                    <div><label className={label}>Email *</label><input type="email" className={input} required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" /></div>
                  </div>
                  <div><label className={label}>Company</label><input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
                  <div><label className={label}>Subject</label><input className={input} value={form.subject} onChange={(e) => set("subject", e.target.value)} /></div>
                  <div><label className={label}>Message *</label><textarea className={`${input} min-h-[130px]`} required value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
                  <button type="submit" disabled={sending} className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors disabled:opacity-60">
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0d2b5e] mb-3">ZGlobal B.V.</h3>
              <div className="text-sm text-slate-600 space-y-2">
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">Email</div><a href="mailto:info@zglobalcorp.com" className="text-[#0d2b5e] hover:underline">info@zglobalcorp.com</a></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">Support</div><a href="mailto:support@zglobalcorp.com" className="text-[#0d2b5e] hover:underline">support@zglobalcorp.com</a></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">Phone</div><span>[Phone number]</span></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-400">Address</div><span>[Registered address]</span></div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0d2b5e] mb-1">New buyer?</h3>
              <p className="text-sm text-slate-500 mb-3">Apply for a wholesale account to see pricing and order.</p>
              <a href="/signup" className="text-sm text-[#0d2b5e] font-medium hover:underline">Request access →</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
