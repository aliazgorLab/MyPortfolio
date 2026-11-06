"use server";

import { educationSchema } from "@/lib/validations/education";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getEducationAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true })
      .order("start_year", { ascending: false });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createEducationAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = educationSchema.parse(payload);

    const { data, error } = await supabase
      .from("education")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/education");
    return successResponse(data, "Education entry created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateEducationAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = educationSchema.parse(payload);

    const { data, error } = await supabase
      .from("education")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/education");
    return successResponse(data, "Education entry updated.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteEducationAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/education");
    return successResponse(null, "Education entry deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

