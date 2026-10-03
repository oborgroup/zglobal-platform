import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const loc = isLocale(lang) ? lang : "en";
  const dict = await getDictionary(loc);
  return { title: dict.beauty.eyebrow, alternates: { canonical: `/${loc}/beauty` } };
}

export default function BeautyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
