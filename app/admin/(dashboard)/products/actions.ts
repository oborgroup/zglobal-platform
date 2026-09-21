"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";

export type ProductFormValues = {
  brand_id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image_url: string;
  moq: string;
  retail_price: string;
  wholesale_price: string;
  stock: string;
  visible: boolean;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

function toIntOrNull(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

function toNumOrNull(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

function toTextOrNull(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function buildRow(v: ProductFormValues) {
  return {
    brand_id: v.brand_id,
    name: v.name.trim(),
    sku: toTextOrNull(v.sku),
    category: toTextOrNull(v.category),
    description: toTextOrNull(v.description),
    image_url: toTextOrNull(v.image_url),
    moq: toIntOrNull(v.moq),
    retail_price: toNumOrNull(v.retail_price),
    wholesale_price: toNumOrNull(v.wholesale_price),
    stock: toIntOrNull(v.stock),
    visible: v.visible,
  };
}

function validate(v: ProductFormValues): string | null {
  if (!v.name.trim()) return "Product name is required.";
  if (!v.brand_id) return "Please select a brand.";
  return null;
}

export async function createProduct(values: ProductFormValues): Promise<ActionResult> {
  await assertAdmin();
  const err = validate(values);
  if (err) return { ok: false, error: err };

  const admin = createAdminSupabase();
  const { error } = await admin.from("products").insert(buildRow(values));
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateProduct(
  id: string,
  values: ProductFormValues
): Promise<ActionResult> {
  await assertAdmin();
  const err = validate(values);
  if (err) return { ok: false, error: err };

  const admin = createAdminSupabase();
  const { error } = await admin.from("products").update(buildRow(values)).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setProductVisible(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin.from("products").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}
