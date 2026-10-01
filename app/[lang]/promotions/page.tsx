"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function PromotionsPage() {
  const { dict } = useLocale();
  const t = dict.promo;
  const h = useHref();
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-14 py-10">
        <h1 className="text-2xl font-semibold text-[#0d2b5e] mb-1">{t.title}</h1>
        <p className="text-sm text-slate-500 mb-8">{t.intro}</p>

        <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#eaf1fb] flex items-center justify-center mx-auto mb-4 text-[#0d2b5e]">
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-[#0d2b5e] mb-2">{t.noneTitle}</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">{t.noneText}</p>
          <a href={h("/catalog")} className="inline-block bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">{t.browseCatalog}</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}