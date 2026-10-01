import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import CookieConsent from "@/components/CookieConsent";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "ZGlobal — B2B Wholesale Platform",
  description: "Multi-brand B2B wholesale platform. Outdoor, home & vacuum brands. EU-ready.",
  icons: { icon: "/favicon.png" },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <LocaleProvider locale={lang} dict={dict}>
          {children}
          <CookieConsent />
        </LocaleProvider>
      </body>
    </html>
  );
}
