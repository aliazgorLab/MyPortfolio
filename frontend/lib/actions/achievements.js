"use server";

import { achievementSchema } from "@/lib/validations/achievements";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getAchievementsAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("display_order", { ascending: true })
      .order("date", { ascending: false });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createAchievementAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = achievementSchema.parse(payload);

    const { data, error } = await supabase
      .from("achievements")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/achievements");
    return successResponse(data, "Achievement created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateAchievementAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = achievementSchema.parse(payload);

    const { data, error } = await supabase
      .from("achievements")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/achievements");
    return successResponse(data, "Achievement updated.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteAchievementAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/achievements");
    return successResponse(null, "Achievement deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

