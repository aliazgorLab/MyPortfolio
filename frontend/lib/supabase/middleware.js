import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth/session";

/**
 * Refreshes auth tokens, sets x-pathname header, protects /admin routes, and enforces account lifecycle state.
 */
export async function updateSession(request) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  requestHeaders.set("x-pathname", pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isAuthRoute = pathname === "/admin/login" || pathname.startsWith("/admin/login");
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. Check verified cryptographic session cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isLocalAdmin = false;

  if (sessionCookie) {
    try {
      const verified = await verifyAdminSessionToken(sessionCookie);
      if (verified && verified.role === "admin") {
        isLocalAdmin = true;
      }
    } catch {
      isLocalAdmin = false;
    }
  }

  if (isLocalAdmin) {
    // If authenticated admin visits /admin/login, redirect to /admin
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    // Allow access to all other /admin routes
    return supabaseResponse;
  }

  // 2. Check Supabase Auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isAdminRoute && !isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  let user = null;
  let supabase = null;

  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // Catch fetch failed / offline Supabase gracefully
    user = null;
  }

  // Protect /admin routes: redirect unauthenticated users to /admin/login
  if (isAdminRoute && !isAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated via Supabase on admin routes:
  if (user && isAdminRoute && supabase) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_pending_deletion")
        .eq("id", user.id)
        .maybeSingle();

      if (isAuthRoute) {
        if (profile && profile.role === "admin" && !profile.is_pending_deletion) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return NextResponse.redirect(url);
        }
        return supabaseResponse;
      }

      if (!profile || profile.is_pending_deletion || profile.role !== "admin") {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    } catch {
      // Tolerate read failures
    }
  }

  return supabaseResponse;
}
