import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const loc = isLocale(lang) ? lang : "en";
  let name: string | null = null;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const res = await fetch(
        `${url}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=name&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const rows = (await res.json()) as { name: string }[];
        name = rows?.[0]?.name ?? null;
      }
    }
  } catch {
    /* fall back to a generic title */
  }
  const dict = await getDictionary(loc);
  return {
    title: name || dict.catalog.eyebrow,
    alternates: { canonical: `/${loc}/product/${id}` },
    ...(name ? { openGraph: { title: name } } : {}),
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
