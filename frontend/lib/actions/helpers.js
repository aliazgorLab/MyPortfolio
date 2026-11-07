import { createClient } from "../supabase/server.js";
import { createAdminClient } from "../supabase/admin.js";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
  buildAdminSessionObjects,
} from "../auth/session.js";
import { cookies } from "next/headers.js";

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
 * Asserts that the caller is an authenticated administrator AND that a functional
 * Supabase database client is available.
 * Resolves to the administrative client when available to satisfy RLS mutations.
 */
export async function requireAdminDatabase() {
  const { supabase, user, profile } = await requireAdmin();

  // If service role client is available on the server, use it for administrative mutations
  // to ensure mutations succeed under RLS after identity verification.
  let dbClient = null;
  try {
    const adminClient = createAdminClient();
    if (adminClient) {
      dbClient = adminClient;
    }
  } catch {
    // Fall back to user client
  }

  if (!dbClient) {
    dbClient = supabase;
  }

  if (!dbClient) {
    throw new Error(
      "Database service is currently unreachable. Please check your Supabase connection and environment settings."
    );
  }

  return { supabase: dbClient, user, profile };
}

/**
 * Standard action response helper.
 */
export function successResponse(data, message = "Operation completed successfully") {
  return { success: true, data, message, error: null };
}

export function errorResponse(error, fallbackMessage = "An unexpected error occurred") {
  // Handle Zod validation errors
  if (error?.name === "ZodError" && Array.isArray(error.issues) && error.issues.length > 0) {
    const firstIssue = error.issues[0];
    const field = firstIssue.path?.join(".") || "Form input";
    return {
      success: false,
      data: null,
      error: `${field}: ${firstIssue.message}`,
    };
  }

  let message = error?.message || (typeof error === "string" ? error : fallbackMessage);

  // Sanitize PostgreSQL error codes into readable messages
  if (error?.code === "23505" || message.includes("duplicate key value")) {
    message = "A record with this identifier or slug already exists. Please choose a unique name.";
  } else if (error?.code === "42P01" || message.includes("does not exist")) {
    message = "Database table was not found. Please ensure the latest Supabase migration has been executed.";
  } else if (error?.code === "23503" || message.includes("foreign key constraint")) {
    message = "Referenced parent item (World, Category, or Media) does not exist or has been deleted.";
  } else if (error?.code === "PGRST205" || message.includes("schema cache")) {
    message = "Database schema cache needs refreshing or migration has not yet been executed in Supabase.";
  } else if (
    message.includes("fetch failed") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Failed to fetch")
  ) {
    message = "Unable to reach database service. Please check your Supabase project status or network connection.";
  }

  return { success: false, data: null, error: message };
}

