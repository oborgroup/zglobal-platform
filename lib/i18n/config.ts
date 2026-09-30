// Client-safe i18n configuration. No server-only imports here so this can be
// used from both Server and Client Components.

export const locales = ["en", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
};

// Short label for the header switcher.
export const localeShort: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Paths that must never carry a locale prefix (internal tooling / handlers).
const NON_LOCALIZED = /^\/(admin|auth|api)(\/|$)/;

/** Split a leading /en or /nl off a pathname. */
export function stripLocale(pathname: string): { locale: Locale | null; rest: string } {
  const m = pathname.match(/^\/(en|nl)(?=\/|$)/);
  if (m) {
    return { locale: m[1] as Locale, rest: pathname.slice(m[0].length) || "/" };
  }
  return { locale: null, rest: pathname };
}

/**
 * Prefix an internal storefront href with the active locale.
 * Leaves external links, anchors, mailto:, and /admin, /auth, /api untouched,
 * and is idempotent if the href already has a locale.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href; // external, mailto:, #anchor, etc.
  if (NON_LOCALIZED.test(href)) return href;
  const { rest } = stripLocale(href);
  return rest === "/" ? `/${locale}` : `/${locale}${rest}`;
}
