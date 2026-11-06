import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const configStatus = {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(anonKey),
    hasServiceRoleKey,
    environmentConfigured: Boolean(supabaseUrl && anonKey),
  };

  if (!configStatus.environmentConfigured) {
    return NextResponse.json({
      status: "pending_configuration",
      message: "Supabase environment variables are missing in .env.local",
      config: configStatus,
    });
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({
        status: "client_error",
        message: "Failed to initialize Supabase server client.",
      }, { status: 500 });
    }

    // Test connectivity by reading published projects
    const startTime = Date.now();
    const { data, error, count } = await supabase
      .from("projects")
      .select("id, slug, title, status", { count: "exact" });
    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json({
        status: "database_error",
        message: error.message,
        hint: error.hint || "Make sure migrations (01_initial_schema_and_rls.sql) have been run in Supabase SQL editor.",
        config: configStatus,
      }, { status: 502 });
    }

    return NextResponse.json({
      status: "connected",
      message: "Supabase connection and RLS verification successful.",
      latencyMs,
      tables: {
        projects: {
          detected: true,
          totalRows: count ?? data?.length ?? 0,
        },
      },
      config: configStatus,
    });
  } catch (err) {
    return NextResponse.json({
      status: "exception",
      message: err.message,
    }, { status: 500 });
  }
}
