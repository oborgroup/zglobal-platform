import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZGlobal — B2B Wholesale Platform",
  description: "Multi-brand B2B wholesale platform. Beauty, outdoor, home & electronics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}