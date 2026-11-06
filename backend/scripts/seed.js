import { createAdminClient } from "../src/supabase/admin.js";
import dotenv from "dotenv";

dotenv.config();

async function runSeed() {
  console.log("Starting portfolio database seed...");
  const admin = createAdminClient();
  if (!admin) {
    console.error("Supabase Admin client could not be initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  // Check if projects already exist
  const { count, error } = await admin.from("projects").select("id", { count: "exact", head: true });
  if (error) {
    console.error("Failed to query projects table:", error.message);
    process.exit(1);
  }

  console.log(`Current project count: ${count}`);
  console.log("To apply full SQL seed migrations, run supabase/migrations/03_seed_portfolio_data.sql via Supabase SQL Editor or CLI.");
}

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});

