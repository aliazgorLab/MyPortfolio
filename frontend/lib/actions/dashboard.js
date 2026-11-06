"use server";

import { requireAdmin, successResponse, errorResponse } from "./helpers";

export async function getDashboardStatsAction() {
  try {
    const { supabase } = await requireAdmin();

    const [
      { count: totalProjects },
      { count: publishedProjects },
      { count: totalArtworks },
      { count: totalExperiences },
      { count: totalSkills },
      { count: totalCertifications },
      { count: totalAchievements },
      { count: totalMedia },
    ] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("artworks").select("id", { count: "exact", head: true }),
      supabase.from("experiences").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("certifications").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("media").select("id", { count: "exact", head: true }),
    ]);

    // Fetch recent 5 items across projects
    const { data: recentProjects } = await supabase
      .from("projects")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5);

    return successResponse({
      stats: {
        projects: {
          total: totalProjects ?? 0,
          published: publishedProjects ?? 0,
          drafts: (totalProjects ?? 0) - (publishedProjects ?? 0),
        },
        artworks: totalArtworks ?? 0,
        experiences: totalExperiences ?? 0,
        skills: totalSkills ?? 0,
        certifications: totalCertifications ?? 0,
        achievements: totalAchievements ?? 0,
        mediaAssets: totalMedia ?? 0,
      },
      recentProjects: recentProjects || [],
    });
  } catch (err) {
    return errorResponse(err);
  }
}

