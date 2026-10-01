"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { localizeHref } from "./config";
import type { Dictionary } from "./dictionaries"; // type-only: erased at build, safe in a client file

type LocaleContextValue = { locale: Locale; dict: Dictionary };

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: LocaleContextValue & { children: React.ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Access the active locale and its dictionary inside Client Components. */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Convenience: build a locale-aware href for the active locale. */
export function useHref() {
  const { locale } = useLocale();
  return (href: string) => localizeHref(href, locale);
}
