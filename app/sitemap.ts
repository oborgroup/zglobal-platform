import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales } from "@/lib/i18n/config";

// Public, indexable routes (excludes cart/checkout/dashboard/inventory/auth/admin).
const STATIC_ROUTES = [
  "",
  "/catalog",
  "/beauty",
  "/category/beauty",
  "/category/outdoor",
  "/category/home",
  "/category/electronics",
  "/promotions",
  "/support",
  "/contact",
  "/about",
  "/signup",
  "/login",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/imprint",
];

function entry(route: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/en${route}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${route}`])),
    },
  };
}

async function productRoutes(): Promise<string[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];
    const res = await fetch(
      `${url}/rest/v1/products?select=id&visible=is.true&limit=2000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { id: string }[];
    return rows.map((r) => `/product/${r.id}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await productRoutes();
  return [...STATIC_ROUTES, ...products].map(entry);
}
