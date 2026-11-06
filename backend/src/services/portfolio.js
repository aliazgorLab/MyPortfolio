import { getSupabaseClient } from "../supabase/client.js";
import { createAdminClient } from "../supabase/admin.js";

/**
 * Backend Portfolio Service
 * Provides data access functions for published content and admin management.
 */

export async function getPublishedProjects() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getProjectBySlug(slug) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublishedArtworks() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublishedExperiences() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublishedEducation() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublishedSkills() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublishedCertifications() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublishedAchievements() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPublicWebsiteSettings() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("website_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Admin Statistics Overview
 */
export async function getAdminStats() {
  const admin = createAdminClient();
  if (!admin) throw new Error("Admin client unavailable");

  const [
    projectsRes,
    artworksRes,
    experiencesRes,
    skillsRes,
    mediaRes,
  ] = await Promise.all([
    admin.from("projects").select("id, status", { count: "exact" }),
    admin.from("artworks").select("id, status", { count: "exact" }),
    admin.from("experiences").select("id", { count: "exact" }),
    admin.from("skills").select("id", { count: "exact" }),
    admin.from("media").select("id, bucket, size_bytes", { count: "exact" }),
  ]);

  return {
    totalProjects: projectsRes.count || 0,
    publishedProjects: (projectsRes.data || []).filter((p) => p.status === "published").length,
    totalArtworks: artworksRes.count || 0,
    publishedArtworks: (artworksRes.data || []).filter((a) => a.status === "published").length,
    totalExperiences: experiencesRes.count || 0,
    totalSkills: skillsRes.count || 0,
    totalMediaAssets: mediaRes.count || 0,
    totalMediaBytes: (mediaRes.data || []).reduce((acc, m) => acc + (m.size_bytes || 0), 0),
  };
}
