"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, updateProfileSchema } from "@/lib/validations/auth";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminCredentials,
  buildAdminSessionObjects,
} from "@/lib/auth/session";
import { cookies } from "next/headers.js";
import { revalidatePath } from "next/cache.js";
import { redirect } from "next/navigation.js";

export async function loginAction(credentials) {
  try {
    const validated = loginSchema.parse(credentials);
    const rawIdentifier = (validated.identifier || validated.email || "").trim();
    const rawPassword = validated.password;
    const cookieStore = await cookies();

    const isSecureCookie =
      process.env.NODE_ENV === "production" &&
      (Boolean(process.env.VERCEL) || process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://"));

    // 1. Check verified Administrator credentials (admin / aliazgor@zgOR)
    const isLocalAdminValid = verifyAdminCredentials(rawIdentifier, rawPassword);

    if (isLocalAdminValid) {
      const sessionToken = await createAdminSessionToken();
      const { user, profile } = buildAdminSessionObjects();

      cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Best-effort non-blocking sync with Supabase Auth if online
      try {
        const supabase = await createClient();
        if (supabase) {
          const targetEmail = process.env.ADMIN_EMAIL || "ali.azgor.0810@gmail.com";
          // Fast-fail after 1500ms so an offline Supabase never slows down login
          await Promise.race([
            supabase.auth.signInWithPassword({
              email: targetEmail,
              password: rawPassword,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Auth sync timeout")), 1500)),
          ]).catch(() => {
            // Silently tolerate offline / paused Supabase connection
          });
        }
      } catch {
        // Silently tolerate offline / paused Supabase connection
      }

      revalidatePath("/admin");
      return successResponse({ user, profile }, "Login successful.");
    }

    // 2. Fallback to Supabase Auth if credentials differ
    const supabase = await createClient();
    if (!supabase) {
      return errorResponse("Invalid Admin ID/Email or password.");
    }

    let targetEmail = rawIdentifier;
    if (!targetEmail.includes("@")) {
      const configuredAdminId = (process.env.ADMIN_ID || "admin").toLowerCase();
      const configuredAdminEmail = process.env.ADMIN_EMAIL || "ali.azgor.0810@gmail.com";

      if (rawIdentifier.toLowerCase() === configuredAdminId) {
        targetEmail = configuredAdminEmail;
      } else {
        return errorResponse("Invalid Admin ID or credentials.");
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: rawPassword,
      });

      if (error) {
        return errorResponse("Invalid Admin ID/Email or password.");
      }

      // Verify admin role and pending deletion state
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_pending_deletion")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        return errorResponse("Administrator profile record not found.");
      }

      if (profile.is_pending_deletion) {
        await supabase.auth.signOut();
        return errorResponse("Access denied: Account is scheduled for deletion.");
      }

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        return errorResponse("Access denied: only administrators may access this portal.");
      }

      // Also set verified session cookie
      const sessionToken = await createAdminSessionToken({
        sub: data.user.id,
        email: data.user.email,
      });

      cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      revalidatePath("/admin");
      return successResponse({ user: data.user, profile }, "Login successful.");
    } catch {
      return errorResponse("Invalid Admin ID/Email or password.");
    }
  } catch (err) {
    return errorResponse(err);
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);

    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn("Sign out cleanup notice:", err.message);
  }

  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function getCurrentUserAction() {
  try {
    const { user, profile } = await requireAdmin();
    return successResponse({ user, profile });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateProfileAction(payload) {
  try {
    const { supabase, user } = await requireAdmin();
    const validated = updateProfileSchema.parse(payload);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: validated.full_name,
        avatar_url: validated.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin");
    return successResponse(data, "Profile updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}
