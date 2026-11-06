"use server";

import { experienceSchema } from "@/lib/validations/experiences";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getExperiencesAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createExperienceAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = experienceSchema.parse(payload);

    const { data, error } = await supabase
      .from("experiences")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successResponse(data, "Experience entry created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateExperienceAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = experienceSchema.parse(payload);

    const { data, error } = await supabase
      .from("experiences")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successResponse(data, "Experience entry updated.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteExperienceAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    return successResponse(null, "Experience entry deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

