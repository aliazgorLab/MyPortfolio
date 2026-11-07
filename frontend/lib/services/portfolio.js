import { createClient } from "../supabase/server.js";
import {
  personalInfo as fallbackPersonalInfo,
  projects as fallbackProjects,
  experience as fallbackExperience,
  capabilities as fallbackCapabilities,
  principles as fallbackPrinciples,
} from "../../data/portfolioData.js";
import {
  FALLBACK_WORLDS,
  FALLBACK_CATEGORIES,
} from "../constants/universe.js";

function mapFallbackProject(p) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.id,
    number: p.number,
    title: p.title,
    category: p.category,
    world_slug:
      p.world_slug ||
      (p.category?.includes("Product") || p.category?.includes("Design")
        ? "ui-ux-design"
        : "web-development"),
    world_id: p.world_id || null,
    creative_category_id: p.creative_category_id || null,
    client: p.client || null,
    tagline: p.tagline,
    description: p.description,
    longDescription: p.longDescription || p.long_description,
    features: p.features || [],
    tech: p.tech || [],
    year: p.year,
    image: p.image || p.cover_image_url || "/images/project-iiuc-cover.jpg",
    cover_image_url: p.image || p.cover_image_url || "/images/project-iiuc-cover.jpg",
    liveUrl: p.liveUrl || p.live_url,
    githubUrl: p.githubUrl || p.github_url,
    prototype_url: p.prototype_url || null,
    video_url: p.video_url || null,
    video_provider: p.video_provider || "none",
    aspect_ratio: p.aspect_ratio || "16:9",
    accent: p.accent || "#F46A45",
    metrics: p.metrics,
    is_featured: Boolean(p.is_featured),
    is_demo: Boolean(p.is_demo),
    gallery_images: p.gallery_images || [],
  };
}

/**
 * Retrieves all published projects.
 * Falls back to static data/portfolioData.js if database is unconfigured or empty.
 */
export async function getPublishedProjects() {
  try {
    const supabase = await createClient();
    if (!supabase) return (fallbackProjects || []).map(mapFallbackProject);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return (fallbackProjects || []).map(mapFallbackProject);
    }

    return data.map((p) => ({
      id: p.slug,
      slug: p.slug,
      number: p.number,
      title: p.title,
      category: p.category,
      world_slug: p.world_slug || null,
      world_id: p.world_id || null,
      creative_category_id: p.creative_category_id || null,
      client: p.client || null,
      tagline: p.tagline,
      description: p.description,
      longDescription: p.long_description,
      features: p.features || [],
      tech: p.tech || [],
      year: p.year,
      image: p.cover_image_url || "/images/project-iiuc-cover.jpg",
      cover_image_url: p.cover_image_url || "/images/project-iiuc-cover.jpg",
      liveUrl: p.live_url,
      githubUrl: p.github_url,
      prototype_url: p.prototype_url || null,
      video_url: p.video_url || null,
      video_provider: p.video_provider || "none",
      aspect_ratio: p.aspect_ratio || "16:9",
      accent: p.accent || "#F46A45",
      metrics: p.metrics,
      is_featured: Boolean(p.is_featured),
      is_demo: Boolean(p.is_demo),
      gallery_images: p.gallery_images || [],
    }));
  } catch (err) {
    console.warn("Falling back to static projects data:", err.message);
    return (fallbackProjects || []).map(mapFallbackProject);
  }
}

/**
 * Retrieves a single published project by its slug.
 */
export async function getProjectBySlug(slug) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      const match = (fallbackProjects || []).find((p) => p.id === slug || p.slug === slug);
      return mapFallbackProject(match);
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      const match = (fallbackProjects || []).find((p) => p.id === slug || p.slug === slug);
      return mapFallbackProject(match);
    }

    return {
      id: data.slug,
      slug: data.slug,
      number: data.number,
      title: data.title,
      category: data.category,
      world_slug: data.world_slug || null,
      world_id: data.world_id || null,
      creative_category_id: data.creative_category_id || null,
      client: data.client || null,
      tagline: data.tagline,
      description: data.description,
      longDescription: data.long_description,
      features: data.features || [],
      tech: data.tech || [],
      year: data.year,
      image: data.cover_image_url || "/images/project-iiuc-cover.jpg",
      cover_image_url: data.cover_image_url || "/images/project-iiuc-cover.jpg",
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      prototype_url: data.prototype_url || null,
      video_url: data.video_url || null,
      video_provider: data.video_provider || "none",
      aspect_ratio: data.aspect_ratio || "16:9",
      accent: data.accent || "#F46A45",
      metrics: data.metrics,
      is_featured: Boolean(data.is_featured),
      is_demo: Boolean(data.is_demo),
      gallery_images: data.gallery_images || [],
    };
  } catch (err) {
    const match = (fallbackProjects || []).find((p) => p.id === slug || p.slug === slug);
    return mapFallbackProject(match);
  }
}

/**
 * CREATIVE UNIVERSE PUBLIC READ-SERVICE CONTRACT
 * Provides clean, safe read endpoints for the future frontend.
 * Strictly enforces is_active = true and status = 'published'.
 */

/**
 * Retrieves active Creative Worlds.
 */
export async function getPublicCreativeWorlds() {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("creative_worlds")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return FALLBACK_WORLDS.filter((w) => w.is_active);
  } catch {
    return FALLBACK_WORLDS.filter((w) => w.is_active);
  }
}

/**
 * Retrieves active Creative Categories, optionally filtered by World slug.
 */
export async function getPublicCreativeCategories(worldSlug = null) {
  try {
    const supabase = await createClient();
    if (supabase) {
      let query = supabase
        .from("creative_categories")
        .select("*, world:creative_worlds(id, slug, title)")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (worldSlug) {
        query = query.eq("world.slug", worldSlug);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    }
    return worldSlug
      ? FALLBACK_CATEGORIES.filter(
          (c) => (c.world_slug === worldSlug || c.world_id === worldSlug) && c.is_active
        )
      : FALLBACK_CATEGORIES.filter((c) => c.is_active);
  } catch {
    return worldSlug
      ? FALLBACK_CATEGORIES.filter(
          (c) => (c.world_slug === worldSlug || c.world_id === worldSlug) && c.is_active
        )
      : FALLBACK_CATEGORIES.filter((c) => c.is_active);
  }
}

/**
 * Retrieves published Creative Works with universe and category metadata.
 * Never exposes drafts or archived items to the public.
 */
export async function getPublicCreativeWorks(options = {}) {
  try {
    const supabase = await createClient();
    if (supabase) {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options.world_slug) {
        query = query.eq("world_slug", options.world_slug);
      }

      if (options.is_featured) {
        query = query.eq("is_featured", true);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          ...p,
          image: p.cover_image_url || "/images/project-iiuc-cover.jpg",
          liveUrl: p.live_url,
          githubUrl: p.github_url,
          longDescription: p.long_description,
        }));
      }
    }

    // Static fallback
    let filtered = (fallbackProjects || []).map((p) => ({
      ...p,
      world_slug:
        p.category?.includes("Product") || p.category?.includes("Design")
          ? "ui-ux-design"
          : "web-development",
      aspect_ratio: "16:9",
      video_provider: "none",
      gallery_images: [],
    }));

    if (options.world_slug) {
      filtered = filtered.filter((p) => p.world_slug === options.world_slug);
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  } catch {
    return fallbackProjects;
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

