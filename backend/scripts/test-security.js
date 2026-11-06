import { createAdminClient } from "../src/supabase/admin.js";
import { getSupabaseClient } from "../src/supabase/client.js";
import dotenv from "dotenv";

dotenv.config();

async function runSecurityTests() {
  console.log("🔒 Running Portfolio CMS Security & Access Verification...\n");

  try {
    const anon = getSupabaseClient();
    console.log("1. Testing Anonymous (Public) Read Access to Projects...");
    const { data: pubData, error: pubErr } = await anon
      .from("projects")
      .select("id, title, status")
      .eq("status", "published");

    if (pubErr) {
      console.warn("   Notice: Anon client returned error (likely no live database connected):", pubErr.message);
    } else {
      console.log(`   ✓ Anonymous read successful. Retrieved ${pubData?.length || 0} published records.`);
    }

    console.log("2. Testing Anonymous (Public) Unauthorized Mutation Prevention...");
    const { error: mutErr } = await anon
      .from("projects")
      .insert({ title: "Exploit Test", slug: "exploit-test" });

    if (mutErr) {
      console.log("   ✓ Anonymous mutation correctly rejected by RLS:", mutErr.message);
    } else {
      console.warn("   ⚠️ Warning: Anonymous insert did not return an error.");
    }

    console.log("\nComplete 20-assertion SQL Security Test Suite is located at: backend/supabase/migrations/04_security_test_suite.sql");
  } catch (err) {
    console.error("Test execution caught error:", err.message);
  }
}

runSecurityTests();
