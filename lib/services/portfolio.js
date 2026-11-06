import { createClient } from "@/lib/supabase/server";
import {
  personalInfo as fallbackPersonalInfo,
  projects as fallbackProjects,
  experience as fallbackExperience,
  capabilities as fallbackCapabilities,
  principles as fallbackPrinciples,
} from "@/data/portfolioData";

/**
 * Retrieves all published projects.
 * Falls back to static data/portfolioData.js if database is unconfigured or empty.
 */
export async function getPublishedProjects() {
  try {
    const supabase = await createClient();
    if (!supabase) return fallbackProjects;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackProjects;
    }

    return data.map((p) => ({
      id: p.slug,
      slug: p.slug,
      number: p.number,
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      longDescription: p.long_description,
      features: p.features || [],
      tech: p.tech || [],
      year: p.year,
      image: p.cover_image_url || "/images/project-iiuc-cover.jpg",
      liveUrl: p.live_url,
      githubUrl: p.github_url,
      accent: p.accent || "#C7B8FF",
      metrics: p.metrics,
    }));
  } catch (err) {
    console.warn("Falling back to static projects data:", err.message);
    return fallbackProjects;
  }
}

/**
 * Retrieves a single published project by its slug.
 */
export async function getProjectBySlug(slug) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return fallbackProjects.find((p) => p.id === slug) || null;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      return fallbackProjects.find((p) => p.id === slug) || null;
    }

    return {
      id: data.slug,
      slug: data.slug,
      number: data.number,
      title: data.title,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      longDescription: data.long_description,
      features: data.features || [],
      tech: data.tech || [],
      year: data.year,
      image: data.cover_image_url || "/images/project-iiuc-cover.jpg",
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      accent: data.accent || "#C7B8FF",
      metrics: data.metrics,
    };
  } catch (err) {
    return fallbackProjects.find((p) => p.id === slug) || null;
  }
}

/**
 * Retrieves published work experiences.
 */
export async function getPublishedExperiences() {
  try {
    const supabase = await createClient();
    if (!supabase) return fallbackExperience;

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackExperience;
    }

    return data.map((e) => ({
      id: e.slug_id,
      role: e.role,
      company: e.company,
      period: e.period,
      current: e.is_current,
      location: e.location,
      description: e.description,
      points: e.points || [],
    }));
  } catch (err) {
    return fallbackExperience;
  }
}

/**
 * Retrieves published capabilities & skills grouped by category.
 */
export async function getPublishedCapabilities() {
  try {
    const supabase = await createClient();
    if (!supabase) return fallbackCapabilities;

    const { data, error } = await supabase
      .from("skill_categories")
      .select("name, index_label, skills(name, status)")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCapabilities;
    }

    return data.map((cat) => ({
      category: cat.name,
      index: cat.index_label,
      skills: (cat.skills || [])
        .filter((s) => s.status === "published")
        .map((s) => s.name),
    }));
  } catch (err) {
    return fallbackCapabilities;
  }
}

/**
 * Retrieves site personal info settings.
 */
export async function getPersonalInfo() {
  try {
    const supabase = await createClient();
    if (!supabase) return fallbackPersonalInfo;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "personal_info")
      .maybeSingle();

    if (error || !data || !data.value) {
      return fallbackPersonalInfo;
    }

    return {
      ...fallbackPersonalInfo,
      ...data.value,
    };
  } catch (err) {
    return fallbackPersonalInfo;
  }
}

/**
 * Retrieves site principles settings.
 */
export async function getPrinciples() {
  try {
    const supabase = await createClient();
    if (!supabase) return fallbackPrinciples;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "principles")
      .maybeSingle();

    if (error || !data || !data.value) {
      return fallbackPrinciples;
    }

    return data.value;
  } catch (err) {
    return fallbackPrinciples;
  }
}

