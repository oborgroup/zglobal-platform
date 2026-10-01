import type { Metadata } from "next";
import "../globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "ZGlobal Admin",
  icons: { icon: "/favicon.png" },
};

// Admin is English-only. We still wrap it in a LocaleProvider (pinned to "en")
// so shared components like <Footer> that read the locale keep working here.
export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary("en");
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <LocaleProvider locale="en" dict={dict}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
