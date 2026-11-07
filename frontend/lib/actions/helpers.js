import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
  buildAdminSessionObjects,
} from "@/lib/auth/session";
import { cookies } from "next/headers";

/**
 * Asserts that the caller is an authenticated administrator.
 * Returns the authenticated supabase client, user record, and profile.
 */
export async function requireAdmin() {
  // 1. Check verified cryptographic session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (sessionCookie) {
      const verified = await verifyAdminSessionToken(sessionCookie);
      if (verified && verified.role === "admin") {
        let supabase = null;
        try {
          supabase = await createClient();
        } catch {
          // Tolerate offline Supabase client
        }
        const { user, profile } = buildAdminSessionObjects(verified);
        return { supabase, user, profile };
      }
    }
  } catch {
    // Continue to Supabase Auth check
  }

  // 2. Check Supabase Auth
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Unauthorized: Please sign in to access admin operations.");
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized: Please sign in to access admin operations.");
    }

    // Verify admin status and ensure account is not pending deletion
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_pending_deletion")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found.");
    }

    if (profile.is_pending_deletion) {
      throw new Error("Account is pending deletion and cannot perform operations.");
    }

    if (profile.role !== "admin") {
      throw new Error("Forbidden: Administrator privileges required.");
    }

    return { supabase, user, profile };
  } catch {
    throw new Error("Unauthorized: Please sign in to access admin operations.");
  }
}

/**
 * Standard action response helper.
 */
export function successResponse(data, message = "Operation completed successfully") {
  return { success: true, data, message, error: null };
}

export function errorResponse(error, fallbackMessage = "An unexpected error occurred") {
  const message = error?.message || (typeof error === "string" ? error : fallbackMessage);
  return { success: false, data: null, error: message };
}

