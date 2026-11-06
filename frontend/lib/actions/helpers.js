import { createClient } from "@/lib/supabase/server";

/**
 * Asserts that the caller is an authenticated administrator.
 * Returns the authenticated supabase client and the user record.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase server client is not configured.");
  }

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

