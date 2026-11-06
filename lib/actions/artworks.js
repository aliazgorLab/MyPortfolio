"use server";

import { artworkSchema, artworkCategorySchema } from "@/lib/validations/artworks";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

export async function getArtworkCategoriesAction() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("artwork_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createArtworkCategoryAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = artworkCategorySchema.parse(payload);

    const { data, error } = await supabase
      .from("artwork_categories")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/artworks");
    return successResponse(data, "Artwork category created.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteArtworkCategoryAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("artwork_categories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/artworks");
    return successResponse(null, "Category deleted.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function getArtworksAction(options = {}) {
  try {
    const { supabase } = await requireAdmin();
    let query = supabase
      .from("artworks")
      .select("*, category:artwork_categories(*)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options.status) {
      query = query.eq("status", options.status);
    }
    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createArtworkAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = artworkSchema.parse(payload);

    const { data, error } = await supabase
      .from("artworks")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/artworks");
    return successResponse(data, "Artwork created successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateArtworkAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = artworkSchema.parse(payload);

    const { data, error } = await supabase
      .from("artworks")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/artworks");
    return successResponse(data, "Artwork updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteArtworkAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/artworks");
    return successResponse(null, "Artwork deleted successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

