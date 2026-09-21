import { createAdminSupabase } from "./supabaseAdmin";

export type AdminProduct = {
  id: string;
  brand_id: string;
  name: string;
  sku: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  moq: number | null;
  retail_price: number | null;
  wholesale_price: number | null;
  stock: number | null;
  visible: boolean | null;
  created_at: string | null;
};

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  website: string | null;
  payment_terms: string | null;
  status: string | null;
  sku_count: number | null;
  sort_order: number | null;
  visible: boolean | null;
  created_at: string | null;
};

export type BrandOption = { id: string; name: string };

export type BuyerApplication = {
  id: string;
  email: string | null;
  createdAt: string;
  emailConfirmedAt: string | null;
  company: string;
  firstName: string;
  lastName: string;
  vat: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  country: string;
  postcode: string;
  marketingConsent: boolean;
};

export type LicenseFile = { name: string; url: string } | null;

/** All products (including hidden), newest first, with brand names attached. */
export async function listAdminProducts(): Promise<{
  products: AdminProduct[];
  brands: BrandOption[];
}> {
  const admin = createAdminSupabase();
  const [{ data: products }, { data: brands }] = await Promise.all([
    admin
      .from("products")
      .select(
        "id, brand_id, name, sku, category, description, image_url, moq, retail_price, wholesale_price, stock, visible, created_at"
      )
      .order("created_at", { ascending: false }),
    admin.from("brands").select("id, name").order("name"),
  ]);

  return {
    products: (products as AdminProduct[]) || [],
    brands: (brands as BrandOption[]) || [],
  };
}

/** All brands (including hidden). */
export async function listAdminBrands(): Promise<AdminBrand[]> {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("brands")
    .select(
      "id, name, slug, category, description, website, payment_terms, status, sku_count, sort_order, visible, created_at"
    )
    .order("sort_order", { ascending: true });
  return (data as AdminBrand[]) || [];
}

export type AdminStats = {
  productTotal: number;
  productHidden: number;
  productOutOfStock: number;
  brandTotal: number;
  brandHidden: number;
  buyerCount: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const admin = createAdminSupabase();

  const [products, brands, buyers] = await Promise.all([
    admin.from("products").select("id, visible, stock"),
    admin.from("brands").select("id, visible"),
    listBuyerApplications(),
  ]);

  const productRows = (products.data as { visible: boolean | null; stock: number | null }[]) || [];
  const brandRows = (brands.data as { visible: boolean | null }[]) || [];

  return {
    productTotal: productRows.length,
    productHidden: productRows.filter((p) => p.visible === false).length,
    productOutOfStock: productRows.filter((p) => (p.stock ?? 0) <= 0).length,
    brandTotal: brandRows.length,
    brandHidden: brandRows.filter((b) => b.visible === false).length,
    buyerCount: buyers.length,
  };
}

/** Buyer accounts (non-admins) with their submitted signup fields. */
export async function listBuyerApplications(): Promise<BuyerApplication[]> {
  const admin = createAdminSupabase();
  const out: BuyerApplication[] = [];
  const perPage = 1000;

  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data.users || [];

    for (const u of users) {
      if (u.app_metadata?.is_admin === true) continue;
      const m = (u.user_metadata || {}) as Record<string, unknown>;
      const str = (k: string) => (typeof m[k] === "string" ? (m[k] as string) : "");
      out.push({
        id: u.id,
        email: u.email ?? null,
        createdAt: u.created_at,
        emailConfirmedAt: u.email_confirmed_at ?? null,
        company: str("company_name"),
        firstName: str("first_name"),
        lastName: str("last_name"),
        vat: str("vat"),
        phone: str("phone"),
        address: str("address"),
        address2: str("address2"),
        city: str("city"),
        country: str("country"),
        postcode: str("postcode"),
        marketingConsent: m["marketing_consent"] === true,
      });
    }

    if (users.length < perPage) break;
  }

  out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return out;
}

/**
 * Signed URL (valid 1h) for a buyer's uploaded business license, if present.
 * Returns null when the bucket or file does not exist.
 */
export async function getLicenseFor(userId: string): Promise<LicenseFile> {
  const admin = createAdminSupabase();
  try {
    const { data: files, error } = await admin.storage
      .from("business-licenses")
      .list(userId);
    if (error || !files || files.length === 0) return null;

    const file = files.find((f) => f.name.startsWith("license")) || files[0];
    const { data: signed } = await admin.storage
      .from("business-licenses")
      .createSignedUrl(`${userId}/${file.name}`, 60 * 60);
    if (!signed) return null;
    return { name: file.name, url: signed.signedUrl };
  } catch {
    return null;
  }
}
