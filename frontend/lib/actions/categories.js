"use server";

import { creativeWorldSchema, creativeCategorySchema } from "../validations/categories.js";
import { requireAdmin, requireAdminDatabase, successResponse, errorResponse } from "./helpers.js";
import { revalidatePath } from "next/cache.js";
import { FALLBACK_WORLDS, FALLBACK_CATEGORIES } from "../constants/universe.js";

/**
 * Retrieves all 4 Creative Worlds.
 */
export async function getCreativeWorldsAction() {
  try {
    const { supabase } = await requireAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("creative_worlds")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return successResponse(data);
        }
      } catch {
        // Fall back to static worlds
      }
    }
    return successResponse(FALLBACK_WORLDS);
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Updates a Creative World's details.
 */
export async function updateCreativeWorldAction(id, payload) {
  try {
    const { supabase } = await requireAdminDatabase();
    const validated = creativeWorldSchema.parse(payload);

    const { data, error } = await supabase
      .from("creative_worlds")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    return successResponse(data, "Creative World updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Retrieves Creative Categories, optionally filtered by World ID.
 */
export async function getCreativeCategoriesAction(worldId = null) {
  try {
    const { supabase } = await requireAdmin();

    if (supabase) {
      try {
        let query = supabase
          .from("creative_categories")
          .select("*, world:creative_worlds(id, slug, title)")
          .order("display_order", { ascending: true });

        if (worldId) {
          query = query.eq("world_id", worldId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return successResponse(data);
        }
      } catch {
        // Fall back to static categories
      }
    }

    const filteredFallback = worldId
      ? FALLBACK_CATEGORIES.filter((c) => c.world_id === worldId || c.world_slug === worldId)
      : FALLBACK_CATEGORIES;

    return successResponse(filteredFallback);
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Creates a new category under a specified World.
 */
export async function createCreativeCategoryAction(payload) {
  try {
    const { supabase } = await requireAdminDatabase();
    const validated = creativeCategorySchema.parse(payload);

    const { data, error } = await supabase
      .from("creative_categories")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/projects");
    return successResponse(data, "Category created successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Updates an existing category.
 */
export async function updateCreativeCategoryAction(id, payload) {
  try {
    const { supabase } = await requireAdminDatabase();
    const validated = creativeCategorySchema.parse(payload);

    const { data, error } = await supabase
      .from("creative_categories")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/projects");
    return successResponse(data, "Category updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Safely deletes a category after ensuring no project items are currently assigned to it.
 */
export async function deleteCreativeCategoryAction(id) {
  try {
    const { supabase } = await requireAdminDatabase();

    // Check reference constraint
    const { count, error: countErr } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("creative_category_id", id);

    if (count && count > 0) {
      throw new Error(
        `Cannot delete this category: It is currently assigned to ${count} active work item(s). Reassign or delete those items first.`
      );
    }

    const { error } = await supabase
      .from("creative_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/projects");
    return successResponse(null, "Category deleted successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Toggles a category's active/disabled status.
 */
export async function toggleCategoryActiveAction(id, currentStatus) {
  try {
    const { supabase } = await requireAdminDatabase();
    const nextStatus = !currentStatus;

    const { data, error } = await supabase
      .from("creative_categories")
      .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/projects");
    return successResponse(data, `Category is now ${nextStatus ? "active" : "disabled"}.`);
  } catch (err) {
    return errorResponse(err);
  }
}
