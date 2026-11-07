"use server";

import { creativeWorldSchema, creativeCategorySchema } from "@/lib/validations/categories";
import { requireAdmin, requireAdminDatabase, successResponse, errorResponse } from "./helpers";
import { revalidatePath } from "next/cache";

// Static fallback data when Supabase is offline or not yet migrated
export const FALLBACK_WORLDS = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "graphic-design",
    title: "Graphic Design",
    subtitle: "Brand Identity, Visual Communications & Editorial",
    description: "Exploration of logo design, brand identities, posters, banners, and print publication craft.",
    accent_color: "#F46A45",
    display_order: 1,
    is_active: true,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    subtitle: "Digital Interfaces, Prototypes & Design Systems",
    description: "User-centered interfaces, accessible design token architectures, mobile applications, and high-fidelity Figma prototypes.",
    accent_color: "#FF8662",
    display_order: 2,
    is_active: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    slug: "web-development",
    title: "Web Development",
    subtitle: "Interactive Applications, Full-Stack Architecture & Tools",
    description: "Engineering fast, scalable web software with Next.js, React, Node.js, and intelligent API integrations.",
    accent_color: "#E65A32",
    display_order: 3,
    is_active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    slug: "video-motion",
    title: "Video & Motion",
    subtitle: "Motion Graphics, Visual Sequences & Showreels",
    description: "Dynamic motion typography, promotional video edits, social media reels, and visual storytelling.",
    accent_color: "#9B3825",
    display_order: 4,
    is_active: true,
  },
];

export const FALLBACK_CATEGORIES = [
  // Graphic Design
  { id: "10000000-0001-4000-8000-000000000001", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Logo Design", slug: "logo-design", display_order: 1, is_active: true },
  { id: "10000000-0001-4000-8000-000000000002", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Brand Identity", slug: "brand-identity", display_order: 2, is_active: true },
  { id: "10000000-0001-4000-8000-000000000003", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Poster Design", slug: "poster-design", display_order: 3, is_active: true },
  { id: "10000000-0001-4000-8000-000000000004", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Banner Design", slug: "banner-design", display_order: 4, is_active: true },
  { id: "10000000-0001-4000-8000-000000000005", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Social Media Design", slug: "social-media-design", display_order: 5, is_active: true },
  { id: "10000000-0001-4000-8000-000000000006", world_id: "10000000-0000-4000-8000-000000000001", world_slug: "graphic-design", name: "Brochure & Print Design", slug: "brochure-print-design", display_order: 6, is_active: true },

  // UI/UX Design
  { id: "20000000-0002-4000-8000-000000000001", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Website UI Design", slug: "website-ui-design", display_order: 1, is_active: true },
  { id: "20000000-0002-4000-8000-000000000002", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Mobile App UI Design", slug: "mobile-app-ui-design", display_order: 2, is_active: true },
  { id: "20000000-0002-4000-8000-000000000003", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Dashboard Design", slug: "dashboard-design", display_order: 3, is_active: true },
  { id: "20000000-0002-4000-8000-000000000004", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Design Systems", slug: "design-systems", display_order: 4, is_active: true },
  { id: "20000000-0002-4000-8000-000000000005", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "Wireframes & Prototypes", slug: "wireframes-prototypes", display_order: 5, is_active: true },
  { id: "20000000-0002-4000-8000-000000000006", world_id: "20000000-0000-4000-8000-000000000002", world_slug: "ui-ux-design", name: "UX Case Studies", slug: "ux-case-studies", display_order: 6, is_active: true },

  // Web Development
  { id: "30000000-0003-4000-8000-000000000001", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Web Applications", slug: "web-applications", display_order: 1, is_active: true },
  { id: "30000000-0003-4000-8000-000000000002", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Full-Stack Projects", slug: "full-stack-projects", display_order: 2, is_active: true },
  { id: "30000000-0003-4000-8000-000000000003", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Frontend Development", slug: "frontend-development", display_order: 3, is_active: true },
  { id: "30000000-0003-4000-8000-000000000004", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Tools & Utilities", slug: "tools-utilities", display_order: 4, is_active: true },
  { id: "30000000-0003-4000-8000-000000000005", world_id: "30000000-0000-4000-8000-000000000003", world_slug: "web-development", name: "Interactive Websites", slug: "interactive-websites", display_order: 5, is_active: true },

  // Video & Motion
  { id: "40000000-0004-4000-8000-000000000001", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Promotional Videos", slug: "promotional-videos", display_order: 1, is_active: true },
  { id: "40000000-0004-4000-8000-000000000002", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Motion Graphics", slug: "motion-graphics", display_order: 2, is_active: true },
  { id: "40000000-0004-4000-8000-000000000003", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Video Editing", slug: "video-editing", display_order: 3, is_active: true },
  { id: "40000000-0004-4000-8000-000000000004", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Social Media Reels", slug: "social-media-reels", display_order: 4, is_active: true },
  { id: "40000000-0004-4000-8000-000000000005", world_id: "40000000-0000-4000-8000-000000000004", world_slug: "video-motion", name: "Event Videos", slug: "event-videos", display_order: 5, is_active: true },
];

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
