"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function SupportPage() {
  const { dict } = useLocale();
  const t = dict.support;
  const h = useHref();
  const faqs = [
    { q: t.faq1q, a: t.faq1a },
    { q: t.faq2q, a: t.faq2a },
    { q: t.faq3q, a: t.faq3a },
    { q: t.faq4q, a: t.faq4a },
    { q: t.faq5q, a: t.faq5a },
  ];

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

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-4 text-[#0d2b5e]">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4z"/></svg>
              </div>
              <h3 className="font-semibold text-[#0d2b5e] mb-1">{t.emailUs}</h3>
              <p className="text-sm text-slate-500 mb-2">{t.emailUsText}</p>
              <a href="mailto:support@zglobalcorp.com" className="text-sm text-[#0d2b5e] font-medium hover:underline">support@zglobalcorp.com</a>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-4 text-[#0d2b5e]">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <h3 className="font-semibold text-[#0d2b5e] mb-1">{t.callUs}</h3>
              <p className="text-sm text-slate-500 mb-2">{t.callUsText}</p>
              <span className="text-sm text-[#0d2b5e] font-medium">+39 —— ——</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-4 text-[#0d2b5e]">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              </div>
              <h3 className="font-semibold text-[#0d2b5e] mb-1">{t.requestAccess}</h3>
              <p className="text-sm text-slate-500 mb-2">{t.requestAccessText}</p>
              <a href={h("/signup")} className="text-sm text-[#0d2b5e] font-medium hover:underline">{t.startApplication}</a>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#0d2b5e] mb-6">{t.faqTitle}</h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-lg p-5 group">
                <summary className="font-medium text-[#0d2b5e] cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="text-sm text-slate-500 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}