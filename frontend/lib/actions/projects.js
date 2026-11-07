"use server";

import { projectSchema } from "@/lib/validations/projects";
import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { projects as fallbackProjects } from "@/data/portfolioData";
import { revalidatePath } from "next/cache";

export async function getProjectsAction(options = {}) {
  try {
    const { supabase } = await requireAdmin();

    if (supabase) {
      try {
        let query = supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (options.status) {
          query = query.eq("status", options.status);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return successResponse(data);
        }
      } catch {
        // Fall back to static portfolio data
      }
    }

    // Return static projects mapped to schema
    const mapped = (fallbackProjects || []).map((p, idx) => ({
      id: p.id,
      title: p.title,
      slug: p.id,
      number: p.number,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      status: "published",
      display_order: idx + 1,
      accent: p.accent,
      year: p.year,
      live_url: p.liveUrl,
      github_url: p.githubUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    return successResponse(mapped);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function getProjectByIdAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_media(*, media(*))")
      .eq("id", id)
      .single();

    if (error) throw error;
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function createProjectAction(payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = projectSchema.parse(payload);

    const { data, error } = await supabase
      .from("projects")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(data, "Project created successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateProjectAction(id, payload) {
  try {
    const { supabase } = await requireAdmin();
    const validated = projectSchema.parse(payload);

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath(`/work/${data.slug}`);
    revalidatePath("/admin/projects");
    return successResponse(data, "Project updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteProjectAction(id) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(null, "Project deleted successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function toggleProjectPublishAction(id, newStatus) {
  try {
    const { supabase } = await requireAdmin();
    if (!["draft", "published", "archived"].includes(newStatus)) {
      throw new Error("Invalid status specified.");
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath(`/work/${data.slug}`);
    revalidatePath("/admin/projects");
    return successResponse(data, `Project status updated to ${newStatus}.`);
  } catch (err) {
    return errorResponse(err);
  }
}

