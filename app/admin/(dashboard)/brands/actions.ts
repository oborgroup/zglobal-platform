"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";

export type BrandFormValues = {
  name: string;
  slug: string;
  category: string;
  description: string;
  website: string;
  payment_terms: string;
  status: string;
  sku_count: string;
  sort_order: string;
  visible: boolean;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toIntOrNull(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

function toTextOrNull(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function buildRow(v: BrandFormValues) {
  const slug = v.slug.trim() ? slugify(v.slug) : slugify(v.name);
  return {
    name: v.name.trim(),
    slug,
    category: v.category.trim(),
    description: toTextOrNull(v.description),
    website: toTextOrNull(v.website),
    payment_terms: toTextOrNull(v.payment_terms),
    status: toTextOrNull(v.status),
    sku_count: toIntOrNull(v.sku_count),
    sort_order: toIntOrNull(v.sort_order),
    visible: v.visible,
  };
}

function validate(v: BrandFormValues): string | null {
  if (!v.name.trim()) return "Brand name is required.";
  if (!v.category.trim()) return "Category is required.";
  return null;
}

export async function createBrand(values: BrandFormValues): Promise<ActionResult> {
  await assertAdmin();
  const err = validate(values);
  if (err) return { ok: false, error: err };

  const admin = createAdminSupabase();
  const { error } = await admin.from("brands").insert(buildRow(values));
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/brands");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateBrand(
  id: string,
  values: BrandFormValues
): Promise<ActionResult> {
  await assertAdmin();
  const err = validate(values);
  if (err) return { ok: false, error: err };

  const admin = createAdminSupabase();
  const { error } = await admin.from("brands").update(buildRow(values)).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/brands");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setBrandVisible(id: string, visible: boolean): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin.from("brands").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/brands");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();

  // Block deletion when products still reference the brand (FK would fail anyway).
  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", id);
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Cannot delete: ${count} product(s) still belong to this brand. Reassign or delete them first.`,
    };
  }

  const { error } = await admin.from("brands").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/brands");
  revalidatePath("/admin");
  return { ok: true };
}
