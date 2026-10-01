"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { locales, localeShort, stripLocale, type Locale } from "@/lib/i18n/config";

/**
 * EN / NL switcher. Keeps the current path, swaps the locale prefix, and
 * remembers the choice in the NEXT_LOCALE cookie (read by proxy.ts). Uses a
 * plain anchor so the whole tree re-renders in the new language.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const { locale } = useLocale();
  const { rest } = stripLocale(pathname);

  const hrefFor = (loc: Locale) => (rest === "/" ? `/${loc}` : `/${loc}${rest}`);
  const persist = (loc: Locale) => {
    try {
      document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }
  };

  return (
    <span className={`inline-flex items-center ${className}`}>
      {locales.map((loc, i) => (
        <span key={loc} className="inline-flex items-center">
          {i > 0 && <span className="opacity-40 mx-1">/</span>}
          <a
            href={hrefFor(loc)}
            onClick={() => persist(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={loc === locale ? "text-white font-semibold" : "hover:text-white"}
          >
            {localeShort[loc]}
          </a>
        </span>
      ))}
    </span>
  );
}
