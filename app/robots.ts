import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Don't index the admin console, auth handlers, or private account areas.
        disallow: ["/admin", "/auth", "/en/dashboard", "/nl/dashboard", "/en/checkout", "/nl/checkout", "/en/cart", "/nl/cart"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
