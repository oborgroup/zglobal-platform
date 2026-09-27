import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabaseServer";

/** True when the account is flagged as an admin via app_metadata.is_admin. */
export function isAdminUser(user: User | null | undefined): user is User {
  return user?.app_metadata?.is_admin === true;
}

export type BuyerStatus = "pending" | "approved" | "rejected";

/** A buyer's approval status (server-controlled via app_metadata.status). */
export function getBuyerStatus(user: User | null | undefined): BuyerStatus {
  const s = user?.app_metadata?.status;
  return s === "approved" || s === "rejected" ? s : "pending";
}

/** Approved buyers (and admins) may see wholesale pricing and place orders. */
export function isApprovedBuyer(user: User | null | undefined): boolean {
  return !!user && (isAdminUser(user) || getBuyerStatus(user) === "approved");
}

/** Guard for buyer Server Actions (e.g. placing an order). Throws if not approved. */
export async function assertApprovedBuyer(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be signed in.");
  if (!isApprovedBuyer(user)) throw new Error("Your wholesale account is awaiting approval.");
  return user;
}

/** The currently signed-in user (or null), validated against the auth server. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Guard for admin Server Components / layouts. Redirects non-admins to the
 * admin login instead of rendering the page.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (user && isAdminUser(user)) return user;
  // redirect() returns `never` — execution stops here for non-admins.
  redirect(user ? "/admin/login?forbidden=1" : "/admin/login");
}

/**
 * Guard for Server Actions. Throws (rather than redirecting) so a non-admin
 * POST — including a direct request that bypasses the UI — is rejected.
 */
export async function assertAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!isAdminUser(user)) throw new Error("Unauthorized: admin access required.");
  return user;
}
