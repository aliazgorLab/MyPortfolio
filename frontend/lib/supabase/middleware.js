import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Refreshes auth tokens, sets x-pathname header, protects /admin routes, and enforces account lifecycle state.
 */
export async function updateSession(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not configured, allow request through gracefully
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

  // IMPORTANT: Do not run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname === "/admin/login" || pathname.startsWith("/admin/login");
  const isAdminRoute = pathname.startsWith("/admin");

  // Protect /admin routes: redirect unauthenticated users to /admin/login
  if (isAdminRoute && !isAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated on admin routes:
  if (user && isAdminRoute) {
    // If on /admin/login and user is an active admin, redirect to /admin
    if (isAuthRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_pending_deletion")
        .eq("id", user.id)
        .maybeSingle();

      if (profile && profile.role === "admin" && !profile.is_pending_deletion) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // For non-login /admin routes, verify role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_pending_deletion")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.is_pending_deletion || profile.role !== "admin") {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
