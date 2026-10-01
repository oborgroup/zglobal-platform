import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Next.js 16 Proxy (formerly Middleware). Responsibilities:
 *  1. Keep the Supabase auth session fresh on every matched request.
 *  2. Internationalized routing: redirect storefront paths without a locale
 *     prefix (e.g. /catalog) to /<locale>/catalog, choosing the locale from the
 *     NEXT_LOCALE cookie, then the Accept-Language header, then the default.
 *  3. Optimistic route guards (re-checked in the admin layout + server actions):
 *     - /admin/*  (except /admin/login) → must be a signed-in admin.
 *     - /admin/login → send already-signed-in admins to /admin.
 *     - /<locale>/dashboard|login|signup → send admins to /admin.
 *
 * Admin, auth handlers and API routes never receive a locale prefix.
 */

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie as Locale;
  const first = (request.headers.get("accept-language") ?? "")
    .split(",")[0]
    ?.trim()
    .toLowerCase();
  if (first?.startsWith("nl")) return "nl";
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");

  // --- Keep the Supabase session fresh (refreshes auth cookies). ---
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

  // Redirect while preserving any refreshed auth cookies.
  const redirectTo = (path: string, keepQuery = false) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (!keepQuery) url.search = "";
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) =>
      res.cookies.set(cookie.name, cookie.value, cookie)
    );
    return res;
  };

  // --- Admin area: English-only, no locale. Keep the existing guards. ---
  if (isAdminArea) {
    const isAdminLogin = pathname === "/admin/login";
    if (!isAdminLogin) {
      if (!user) return redirectTo("/admin/login");
      if (!isAdmin) return redirectTo(`/${detectLocale(request)}/dashboard`);
    }
    if (isAdminLogin && isAdmin) return redirectTo("/admin");
    return response;
  }

  // --- Storefront: ensure there is a locale prefix. ---
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (!hasLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    const res = NextResponse.redirect(url); // keep query string
    response.cookies.getAll().forEach((cookie) =>
      res.cookies.set(cookie.name, cookie.value, cookie)
    );
    return res;
  }

  // --- Buyer-area guards (locale-aware): keep admins out of the account area. ---
  const locale = pathname.split("/")[1] as Locale;
  const rest = pathname.slice(`/${locale}`.length) || "/";
  if (isAdmin && (rest === "/dashboard" || rest === "/login" || rest === "/signup")) {
    return redirectTo("/admin");
  }

  return response;
}

export const config = {
  // Run on everything except Next internals, the API, and files with an
  // extension (static assets in /public such as the homepage HTML and images).
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|.*\\.).*)"],
};
