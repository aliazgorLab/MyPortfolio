import {
  getPublicCreativeWorlds,
  getPublicCreativeCategories,
  getPublicCreativeWorks,
} from "./portfolio.js";
import {
  FALLBACK_WORLDS,
  FALLBACK_CATEGORIES,
} from "../constants/universe.js";
import {
  ALL_DEMO_WORKS,
  DEMO_GRAPHIC_DESIGN_WORKS,
  DEMO_UIUX_DESIGN_WORKS,
  DEMO_WEB_DEV_WORKS,
  DEMO_VIDEO_MOTION_WORKS,
} from "../constants/universeDemoData.js";

/**
 * Normalizes any work item into standard format expected by the Creative Universe UI.
 */
export function normalizeUniverseWork(work) {
  if (!work) return null;

  // Extract gallery images safely
  let gallery = [];
  if (Array.isArray(work.gallery) && work.gallery.length > 0) {
    gallery = work.gallery;
  } else if (Array.isArray(work.gallery_images) && work.gallery_images.length > 0) {
    gallery = work.gallery_images.map((img) =>
      typeof img === "string" ? { url: img, caption: work.title } : img
    );
  } else if (Array.isArray(work.media) && work.media.length > 0) {
    gallery = work.media.map((m) => ({
      url: m.file_path || m.url,
      caption: m.caption || m.alt_text || work.title,
    }));
  }

  // If gallery is still empty, include the cover image
  const coverUrl =
    work.cover_image_url ||
    work.image ||
    "/images/project-protocolzero.jpg";

  if (gallery.length === 0) {
    gallery = [{ url: coverUrl, caption: work.title }];
  }

  // Tags normalization
  let tags = [];
  if (Array.isArray(work.tags)) {
    tags = work.tags;
  } else if (Array.isArray(work.tech)) {
    tags = work.tech;
  } else if (typeof work.tech === "string") {
    tags = work.tech.split(",").map((t) => t.trim());
  }

  // Category normalization
  const categoryName =
    work.category_name ||
    work.category ||
    "Curated Collection";
  const categorySlug =
    work.category_slug ||
    work.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    "general";

  return {
    id: work.id || work.slug,
    slug: work.slug || work.id,
    world_slug: work.world_slug || "graphic-design",
    category_slug: categorySlug,
    category_name: categoryName,
    title: work.title,
    short_description: work.short_description || work.description || "",
    long_description: work.long_description || work.longDescription || work.description || "",
    client: work.client || "Studio Project",
    year: work.year || "2024",
    cover_image_url: coverUrl,
    aspect_ratio: work.aspect_ratio || "16:9",
    tags,
    display_order: work.display_order ?? 0,
    is_featured: Boolean(work.is_featured),
    is_demo: Boolean(work.is_demo),
    video_provider: work.video_provider || "none",
    video_url: work.video_url || null,
    case_study_slug: work.case_study_slug || (work.id && !work.id.startsWith("demo-") ? work.id : null),
    external_links: work.external_links || (work.liveUrl ? [{ label: "Live Project", url: work.liveUrl }] : []),
    gallery,
  };
}

/**
 * Fetches data for a specific creative world with real DB items prioritized,
 * and high-fidelity demo items seamlessly filling any empty categories.
 */
export async function getCreativeWorldData(worldSlug) {
  // 1. Fetch World info
  const worlds = await getPublicCreativeWorlds();
  const world =
    worlds.find((w) => w.slug === worldSlug) ||
    FALLBACK_WORLDS.find((w) => w.slug === worldSlug) ||
    FALLBACK_WORLDS[0];

  // 2. Fetch Categories for this world
  let categories = await getPublicCreativeCategories(worldSlug);
  if (!categories || categories.length === 0) {
    categories = FALLBACK_CATEGORIES.filter((c) => c.world_slug === worldSlug);
  }

  // 3. Fetch Real Works from DB
  let realWorks = [];
  try {
    const rawWorks = await getPublicCreativeWorks({ world_slug: worldSlug });
    if (Array.isArray(rawWorks)) {
      realWorks = rawWorks.map(normalizeUniverseWork);
    }
  } catch {
    realWorks = [];
  }

  // 4. Retrieve Fallback Demo Works for this world
  let demoWorksForWorld = [];
  if (worldSlug === "graphic-design") {
    demoWorksForWorld = DEMO_GRAPHIC_DESIGN_WORKS;
  } else if (worldSlug === "ui-ux-design") {
    demoWorksForWorld = DEMO_UIUX_DESIGN_WORKS;
  } else if (worldSlug === "web-development") {
    demoWorksForWorld = DEMO_WEB_DEV_WORKS;
  } else if (worldSlug === "video-motion") {
    demoWorksForWorld = DEMO_VIDEO_MOTION_WORKS;
  } else {
    demoWorksForWorld = ALL_DEMO_WORKS;
  }

  // 5. Combine: Real DB works come first! If real works are few or empty, supplement with demo items
  const combinedWorks = [...realWorks];
  const existingSlugs = new Set(realWorks.map((w) => w.slug));

  for (const demoItem of demoWorksForWorld) {
    if (!existingSlugs.has(demoItem.slug)) {
      combinedWorks.push(normalizeUniverseWork(demoItem));
    }
  }

  // Sort by display order
  combinedWorks.sort((a, b) => a.display_order - b.display_order);

  // Group works by category
  const categoriesWithWorks = categories.map((cat) => {
    const catWorks = combinedWorks.filter(
      (w) =>
        w.category_slug === cat.slug ||
        w.creative_category_id === cat.id ||
        (cat.name && w.category_name && w.category_name.toLowerCase() === cat.name.toLowerCase())
    );

    return {
      ...cat,
      works: catWorks,
      count: catWorks.length,
    };
  });

  return {
    world,
    categories: categoriesWithWorks,
    allWorks: combinedWorks,
    totalWorksCount: combinedWorks.length,
    allWorlds: worlds.length > 0 ? worlds : FALLBACK_WORLDS,
  };
}
