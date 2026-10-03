import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import CookieConsent from "@/components/CookieConsent";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const loc = isLocale(lang) ? lang : "en";
  const dict = await getDictionary(loc);
  const title = "ZGlobal — B2B Wholesale Platform";
  const description = dict.footer.tagline;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description,
    icons: { icon: "/favicon.png" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      locale: loc === "nl" ? "nl_NL" : "en_US",
      images: ["/z-global-logo.png"],
    },
    twitter: { card: "summary", title, description, images: ["/z-global-logo.png"] },
  };
}

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
