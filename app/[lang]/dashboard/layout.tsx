import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");
  return { title: dict.common.dashboard, robots: { index: false, follow: false } };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
