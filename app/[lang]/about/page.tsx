"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function AboutPage() {
  const { dict } = useLocale();
  const t = dict.about;
  const h = useHref();
  const cards = [
    { title: t.card1t, desc: t.card1d },
    { title: t.card2t, desc: t.card2d },
    { title: t.card3t, desc: t.card3d },
    { title: t.card4t, desc: t.card4d },
    { title: t.card5t, desc: t.card5d },
    { title: t.card6t, desc: t.card6d },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="bg-[#0d2b5e] text-white">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">{t.eyebrow}</div>
            <h1 className="text-4xl md:text-5xl font-light leading-tight max-w-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t.title} <em className="text-[#c49a3a]">{t.titleEm}</em>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-2xl mt-6">
              {t.heroText}
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <p className="text-slate-600 leading-relaxed">
                {t.para1}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t.para2}
              </p>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-8">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">{t.missionLabel}</div>
              <p className="text-[#0d2b5e] leading-relaxed font-medium">
                {t.missionText}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] border-y border-slate-200">
          <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16">
            <div className="max-w-2xl mb-10">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#c49a3a] mb-3">{t.businessLabel}</div>
              <h2 className="text-3xl font-light text-[#0d2b5e] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t.businessTitle} <em>{t.businessTitleEm}</em>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {t.businessText}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0d2b5e] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#eaf1fb] flex items-center justify-center mb-4 text-[#0d2b5e]">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>
                  </div>
                  <h3 className="text-[#0d2b5e] font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-20 text-center">
          <h2 className="text-3xl font-light text-[#0d2b5e] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t.ctaTitle} <em>{t.ctaTitleEm}</em>
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            {t.ctaText}
          </p>
          <div className="flex gap-3 justify-center">
            <a href={h("/signup")} className="bg-[#0d2b5e] text-white text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:bg-[#163d80] transition-colors">{t.requestAccess}</a>
            <a href={h("/catalog")} className="border border-slate-300 text-[#0d2b5e] text-sm uppercase tracking-wider px-8 py-3 rounded-md hover:border-[#0d2b5e] transition-colors">{t.browseCatalog}</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}