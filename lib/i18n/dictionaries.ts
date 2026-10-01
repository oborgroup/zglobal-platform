// Server-side dictionary loader. Only imported from Server Components, so the
// translation JSON never ships in the client bundle. Client Components receive
// the resolved dictionary via <LocaleProvider> instead.
import type { Locale } from "./config";
import { defaultLocale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  nl: () => import("./dictionaries/nl.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  const load = dictionaries[locale] ?? dictionaries[defaultLocale];
  return load();
}

// The shape of a dictionary, derived from the English source of truth.
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
