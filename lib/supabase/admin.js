import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an administrative Supabase client using the Service Role Key.
 *
 * CRITICAL SECURITY NOTICE:
 * - This client BYPASSES Row Level Security (RLS).
 * - MUST NEVER be called from client components or exposed in browser bundles.
 * - Used exclusively for administrative server operations (bootstrap, cleanup workers, storage moves).
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Checks whether an active administrator profile currently exists.
 */
export async function hasActiveAdmin() {
  const adminClient = createAdminClient();
  if (!adminClient) return false;

  const { count, error } = await adminClient
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("is_pending_deletion", false);

  if (error) {
    console.error("Error checking active admin existence:", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}
