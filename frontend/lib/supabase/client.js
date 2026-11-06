import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for Client Components (Browser).
 * Uses public anon key and handles browser cookie sessions.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return dummy or null client when credentials are not yet set
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
