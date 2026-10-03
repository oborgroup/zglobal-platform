// Canonical site URL used for SEO (sitemap, robots, canonical/OG tags).
// Override in production with NEXT_PUBLIC_SITE_URL if the domain differs.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://b2b.zglobalcorp.com"
).replace(/\/$/, "");

export const SITE_NAME = "ZGlobal";
