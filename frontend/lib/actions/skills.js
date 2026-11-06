"use server";

import { skillSchema, skillCategorySchema } from "@/lib/validations/skills";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getSkillCategoriesWithSkillsAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*, skills(*)")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createSkillCategoryAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = skillCategorySchema.parse(payload);

    const { data, error } = await supabase
      .from("skill_categories")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return successResponse(data, "Skill category created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteSkillCategoryAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("skill_categories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return successResponse(null, "Skill category deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createSkillAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = skillSchema.parse(payload);

    const { data, error } = await supabase
      .from("skills")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return successResponse(data, "Skill created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateSkillAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = skillSchema.parse(payload);

    const { data, error } = await supabase
      .from("skills")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return successResponse(data, "Skill updated.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteSkillAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return successResponse(null, "Skill deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

