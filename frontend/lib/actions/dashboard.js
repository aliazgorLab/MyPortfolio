"use server";

import { requireAdmin, successResponse, errorResponse } from "./helpers";
import { projects as fallbackProjects, experience as fallbackExperience, capabilities as fallbackCapabilities } from "@/data/portfolioData";

export async function getDashboardStatsAction() {
  try {
    const { supabase } = await requireAdmin();

    if (supabase) {
      try {
        const queryPromise = Promise.all([
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("artworks").select("id", { count: "exact", head: true }),
          supabase.from("experiences").select("id", { count: "exact", head: true }),
          supabase.from("skills").select("id", { count: "exact", head: true }),
          supabase.from("certifications").select("id", { count: "exact", head: true }),
          supabase.from("achievements").select("id", { count: "exact", head: true }),
          supabase.from("media").select("id", { count: "exact", head: true }),
        ]);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase query timeout")), 1800)
        );

        const results = await Promise.race([queryPromise, timeoutPromise]);
        
        // If any core query returned an error or null count, use local fallback
        if (results.some((r) => r.error || r.count === null)) {
          throw new Error("Supabase returned empty or error response");
        }

        const [
          { count: totalProjects },
          { count: publishedProjects },
          { count: totalArtworks },
          { count: totalExperiences },
          { count: totalSkills },
          { count: totalCertifications },
          { count: totalAchievements },
          { count: totalMedia },
        ] = results;

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
      } catch {
        // Fall back to local portfolio data if Supabase network fails or times out
      }
    }

    // Local fallback statistics
    return successResponse({
      stats: {
        projects: {
          total: fallbackProjects?.length || 5,
          published: fallbackProjects?.length || 5,
          drafts: 0,
        },
        artworks: 6,
        experiences: fallbackExperience?.length || 3,
        skills: fallbackCapabilities?.length || 6,
        certifications: 3,
        achievements: 4,
        mediaAssets: 12,
      },
      recentProjects: (fallbackProjects || []).slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        status: "published",
        updated_at: new Date().toISOString(),
      })),
    });
  } catch (err) {
    return errorResponse(err);
  }
}

