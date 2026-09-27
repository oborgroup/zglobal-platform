"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { createAdminSupabase } from "@/lib/supabaseAdmin";
import type { BuyerStatus } from "@/lib/adminAuth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function setBuyerStatus(userId: string, status: BuyerStatus): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminSupabase();
  // app_metadata is shallow-merged server-side, so is_admin etc. are preserved.
  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { status },
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { ok: true };
}
