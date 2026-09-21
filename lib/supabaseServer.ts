import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cookie-bound Supabase client for Server Components and Server Actions.
 * Uses the public anon key + the current request's auth cookies, so it acts
 * AS the signed-in user (RLS applies). Use this to read the session / verify
 * who is calling. For privileged admin writes use `createAdminSupabase()`.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component where cookies are
            // read-only. Session refresh is handled in proxy.ts, so ignore.
          }
        },
      },
    }
  );
}
