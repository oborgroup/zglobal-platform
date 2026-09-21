import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

/**
 * Verifies a Supabase email link (recovery / signup / email change) server-side.
 * The token_hash comes from an admin-generated link or an email template.
 * On success the auth cookies are set and we redirect to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/";

  if (token_hash && type) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  return NextResponse.redirect(new URL("/admin/login?error=invalid_link", request.url));
}
