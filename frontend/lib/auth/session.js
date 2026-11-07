/**
 * Cryptographic Admin Session Handler
 * Works across both Next.js Server Actions and Edge Middleware.
 */

export const ADMIN_COOKIE_NAME = "portfolio_admin_session";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "portfolio-cms-secure-session-key-2026-ali-azgor";

export const DEFAULT_ADMIN = {
  id: "10000000-0000-4000-8000-000000000001",
  adminId: "admin",
  email: "ali.azgor.0810@gmail.com",
  fullName: "Md Ali Azgor",
};

export function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    // In production, strictly reject static fallback secret
    return null;
  }
  return "portfolio-cms-secure-session-key-2026-ali-azgor";
}

export function getAdminCredentials() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    adminId: (process.env.ADMIN_ID || DEFAULT_ADMIN.adminId).toLowerCase().trim(),
    adminEmail: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email).toLowerCase().trim(),
    // In production, strictly reject hardcoded default password if env var is missing
    adminPassword: process.env.ADMIN_PASSWORD || (isProd ? null : "aliazgor@zgOR"),
  };
}

export function verifyAdminCredentials(rawIdentifier, rawPassword) {
  const { adminId, adminEmail, adminPassword } = getAdminCredentials();
  if (!adminPassword) return false;

  const inputIdentifier = (rawIdentifier || "").toLowerCase().trim();
  const inputPassword = (rawPassword || "").trim();

  const idMatches = inputIdentifier === adminId || inputIdentifier === adminEmail;
  const passMatches = inputPassword === adminPassword;

  return idMatches && passMatches;
}

export async function createAdminSessionToken(customPayload = {}) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error(
      "Admin session token generation aborted: ADMIN_SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY must be configured in production."
    );
  }

  const { adminId, adminEmail } = getAdminCredentials();
  const payload = {
    sub: DEFAULT_ADMIN.id,
    adminId,
    email: adminEmail,
    role: "admin",
    fullName: DEFAULT_ADMIN.fullName,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    ...customPayload,
  };

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const dataStr = JSON.stringify(payload);
  const b64Data = Buffer.from(dataStr).toString("base64url");
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(b64Data));
  const b64Sig = Buffer.from(signature).toString("base64url");

  return `${b64Data}.${b64Sig}`;
}

export async function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const secret = getSessionSecret();
  if (!secret) return null;

  const [b64Data, b64Sig] = token.split(".");
  if (!b64Data || !b64Sig) return null;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(b64Sig, "base64url"),
      enc.encode(b64Data)
    );

    if (!isValid) return null;

    const payload = JSON.parse(Buffer.from(b64Data, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildAdminSessionObjects(sessionPayload) {
  const { adminId, adminEmail } = getAdminCredentials();
  const email = sessionPayload?.email || adminEmail;
  const id = sessionPayload?.sub || DEFAULT_ADMIN.id;

  const user = {
    id,
    email,
    role: "authenticated",
    aud: "authenticated",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {
      admin_id: sessionPayload?.adminId || adminId,
      full_name: sessionPayload?.fullName || DEFAULT_ADMIN.fullName,
    },
    created_at: new Date(sessionPayload?.iat || Date.now()).toISOString(),
  };

  const profile = {
    id,
    role: "admin",
    full_name: sessionPayload?.fullName || DEFAULT_ADMIN.fullName,
    is_pending_deletion: false,
    created_at: new Date(sessionPayload?.iat || Date.now()).toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { user, profile };
}
