"use client";

import { useLocale, useHref } from "@/lib/i18n/LocaleProvider";

export default function Footer() {
  const { dict } = useLocale();
  const h = useHref();

  return (
    <footer className="bg-[#07122a] text-white/50 mt-auto">
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/z-global-logo.png" alt="ZGlobal" className="h-6 w-auto opacity-60 mb-3" />
            <p className="text-[12px] leading-relaxed text-white/30 max-w-[240px]">
              {dict.footer.tagline}
            </p>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">{dict.footer.platform}</div>
            <a href={h("/catalog")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.nav.catalog}</a>
            <a href={h("/catalog")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.nav.brands}</a>
            <a href={h("/signup")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.common.requestAccess}</a>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">{dict.footer.account}</div>
            <a href={h("/login")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.common.signIn}</a>
            <a href={h("/dashboard")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.common.dashboard}</a>
          </div>
          <div>
            <div className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mb-3">{dict.footer.support}</div>
            <a href={h("/support")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.footer.helpCenter}</a>
            <a href={h("/contact")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.footer.contact}</a>
            <a href={h("/support")} className="block text-[12.5px] py-1 hover:text-white transition-colors">{dict.footer.faq}</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px] text-white/30">
          <span>© 2026 Z Global B.V. {dict.footer.rights}</span>
          <div className="flex gap-4 flex-wrap">
            <a href={h("/legal/privacy")} className="hover:text-white transition-colors">{dict.footer.privacy}</a>
            <a href={h("/legal/terms")} className="hover:text-white transition-colors">{dict.footer.terms}</a>
            <a href={h("/legal/cookies")} className="hover:text-white transition-colors">{dict.footer.cookies}</a>
            <a href={h("/legal/imprint")} className="hover:text-white transition-colors">{dict.footer.legalNotice}</a>
          </div>
          <span>{dict.footer.b2bOnly}</span>
        </div>
      </div>
    </footer>
  );
}
