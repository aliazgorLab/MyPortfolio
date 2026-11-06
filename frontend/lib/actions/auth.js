"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, updateProfileSchema } from "@/lib/validations/auth";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function loginAction(credentials) {
  try {
    const validated = loginSchema.parse(credentials);
    const supabase = await createClient();
    if (!supabase) {
      return errorResponse("Supabase is not configured. Please check .env.local.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return errorResponse(error.message);
    }

    // Verify admin role and pending deletion state
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_pending_deletion")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return errorResponse("Administrator profile not found.");
    }

    if (profile.is_pending_deletion) {
      await supabase.auth.signOut();
      return errorResponse("Account is scheduled for deletion.");
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      return errorResponse("Access denied: only administrators may sign in.");
    }

    return successResponse({ user: data.user, profile }, "Login successful.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function logoutAction() {
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    return successResponse(null, "Signed out successfully.");
  } catch (err) {
    return errorResponse(err);
  }
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

