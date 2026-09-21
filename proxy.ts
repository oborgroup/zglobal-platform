import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware). Does two things:
 *  1. Keeps the Supabase auth session fresh on every matched request.
 *  2. Optimistic route guards — real authorization is re-checked in the admin
 *     layout (Server Component) and inside every admin Server Action.
 *
 * Guards:
 *  - /admin/*  (except /admin/login) → must be a signed-in admin.
 *  - /admin/login → send already-signed-in admins to /admin.
 *  - /dashboard, /login, /signup → send admins to /admin (keep them out of the
 *    buyer account area).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.is_admin === true;
  const { pathname } = request.nextUrl;

  // Build a redirect that preserves any refreshed auth cookies.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) =>
      res.cookies.set(cookie.name, cookie.value, cookie)
    );
    return res;
  };

  const inAdminArea = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (inAdminArea && !isAdminLogin) {
    if (!user) return redirectTo("/admin/login");
    if (!isAdmin) return redirectTo("/dashboard");
  }

  if (isAdminLogin && isAdmin) {
    return redirectTo("/admin");
  }

  if (
    isAdmin &&
    (pathname === "/dashboard" || pathname === "/login" || pathname === "/signup")
  ) {
    return redirectTo("/admin");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/login", "/signup"],
};
