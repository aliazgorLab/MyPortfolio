import crypto from "crypto";
import dotenv from "dotenv";
import { createAdminClient, hasActiveAdmin } from "../src/supabase/admin.js";

dotenv.config();

/**
 * Generates a cryptographically strong, high-entropy password.
 * Length: 28 characters
 * Character pool: uppercase, lowercase, numbers, special symbols
 */
function generateSecurePassword(length = 28) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*()_+-=[]{}|";
  const allChars = upper + lower + numbers + symbols;

  // Guarantee at least 2 of each category
  const guaranteed = [
    upper[crypto.randomInt(0, upper.length)],
    upper[crypto.randomInt(0, upper.length)],
    lower[crypto.randomInt(0, lower.length)],
    lower[crypto.randomInt(0, lower.length)],
    numbers[crypto.randomInt(0, numbers.length)],
    numbers[crypto.randomInt(0, numbers.length)],
    symbols[crypto.randomInt(0, symbols.length)],
    symbols[crypto.randomInt(0, symbols.length)],
  ];

  const remainingLength = length - guaranteed.length;
  const remaining = [];
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = crypto.randomInt(0, allChars.length);
    remaining.push(allChars[randomIndex]);
  }

  // Cryptographically shuffle array
  const fullArray = guaranteed.concat(remaining);
  for (let i = fullArray.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [fullArray[i], fullArray[j]] = [fullArray[j], fullArray[i]];
  }

  return fullArray.join("");
}

async function main() {
  const args = process.argv.slice(2);
  const isExecute = args.includes("--execute");

  console.log("=====================================================================");
  console.log("  MD ALI AZGOR — PORTFOLIO CMS ADMINISTRATOR PROVISIONING");
  console.log("=====================================================================\n");

  const adminId = process.env.ADMIN_ID || "admin";
  const adminEmail = process.env.ADMIN_EMAIL || "ali.azgor.0810@gmail.com";
  const generatedPassword = generateSecurePassword(28);

  console.log("1. Generated Administrator Credentials (Store Safely):");
  console.log(`   - Admin ID:        ${adminId}`);
  console.log(`   - Admin Email:     ${adminEmail}`);
  console.log(`   - Generated Pass:  ${generatedPassword}`);
  console.log("   - Security Policy: High entropy (28 chars), salted hash in Auth schema.");
  console.log("   - Plaintext Pass:  NEVER persisted to database or source code.\n");

  if (!isExecute) {
    console.log("---------------------------------------------------------------------");
    console.log("STATUS: [DRY RUN / PREPARATION MODE]");
    console.log("No modifications have been made to Supabase.");
    console.log("");
    console.log("To execute this provisioning against Supabase, run with the --execute flag:");
    console.log("  npm run provision:admin -- --execute");
    console.log("");
    console.log("IMPORTANT: Ensure your .env contains:");
    console.log("  SUPABASE_URL=https://your-project.supabase.co");
    console.log("  SUPABASE_SERVICE_ROLE_KEY=ey...");
    console.log("---------------------------------------------------------------------\n");
    return;
  }

  // Execute Mode
  console.log("2. Validating Supabase Administrative Connection...");
  const adminClient = createAdminClient();
  if (!adminClient) {
    console.error("   ❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.");
    process.exit(1);
  }

  console.log("3. Checking for Existing Active Administrators...");
  const alreadyHasAdmin = await hasActiveAdmin();
  if (alreadyHasAdmin) {
    console.error("   ❌ Bootstrap rejected: An active administrator profile already exists.");
    console.error("      Database single-owner policy strictly prevents multi-admin registration.");
    process.exit(1);
  }

  console.log("4. Creating Administrator Identity in Supabase Auth...");
  const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
    email: adminEmail,
    password: generatedPassword,
    email_confirm: true,
    user_metadata: {
      admin_id: adminId,
      full_name: "Md Ali Azgor",
    },
  });

  if (authErr) {
    console.error("   ❌ Failed to create Auth user:", authErr.message);
    process.exit(1);
  }

  const userId = authUser.user.id;
  console.log(`   ✓ Auth user created successfully. User ID: ${userId}`);

  console.log("5. Executing bootstrap_initial_admin() Database RPC (Advisory Locked)...");
  const { data: rpcData, error: rpcErr } = await adminClient.rpc("bootstrap_initial_admin", {
    p_target_user_id: userId,
  });

  if (rpcErr) {
    console.error("   ❌ Database bootstrap RPC failed:", rpcErr.message);
    console.error("   Cleaning up created Auth user to maintain atomicity...");
    await adminClient.auth.admin.deleteUser(userId);
    process.exit(1);
  }

  console.log(`   ✓ Initial admin profile established:`, rpcData?.message || "Success");

  console.log("\n=====================================================================");
  console.log("  ADMINISTRATOR PROVISIONING COMPLETE");
  console.log("=====================================================================");
  console.log(`  Login URL:      http://localhost:3000/admin/login`);
  console.log(`  Identifier:     ${adminId}  OR  ${adminEmail}`);
  console.log(`  Password:       ${generatedPassword}`);
  console.log("  Please copy the password into your secure password manager now.");
  console.log("=====================================================================\n");
}

main().catch((err) => {
  console.error("Provisioning caught unhandled error:", err);
  process.exit(1);
});
