"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";
import type { OrderStatus } from "@/lib/orders";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setOrderAdminNote(orderId: string, admin_note: string): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin
    .from("orders")
    .update({ admin_note, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/orders");
  return { ok: true };
}
