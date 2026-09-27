"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function setMessageHandled(id: string, handled: boolean): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  const { error } = await admin.from("contact_messages").update({ handled }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/messages");
  return { ok: true };
}
