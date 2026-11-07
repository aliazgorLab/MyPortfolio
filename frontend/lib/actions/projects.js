"use server";

import { projectSchema } from "../validations/projects.js";
import { parseVideoUrl } from "../validations/video.js";
import { requireAdmin, requireAdminDatabase, successResponse, errorResponse } from "./helpers.js";
import { projects as fallbackProjects } from "../../data/portfolioData.js";
import { revalidatePath } from "next/cache.js";

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

        if (options.world_slug) {
          query = query.eq("world_slug", options.world_slug);
        }

        if (typeof options.is_demo === "boolean") {
          query = query.eq("is_demo", options.is_demo);
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
      world_slug: p.category.includes("Product") || p.category.includes("Design") ? "ui-ux-design" : "web-development",
      tagline: p.tagline,
      description: p.description,
      status: "published",
      is_demo: false,
      video_url: "",
      video_provider: "none",
      aspect_ratio: "16:9",
      display_order: idx + 1,
      accent: p.accent,
      year: p.year,
      live_url: p.liveUrl,
      github_url: p.githubUrl,
      gallery_images: [],
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
    if (!supabase) {
      const found = (fallbackProjects || []).find((p) => p.id === id);
      if (found) return successResponse(found);
      throw new Error("Project not found.");
    }

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
    const { supabase } = await requireAdminDatabase();
    const validated = projectSchema.parse(payload);

    // Auto-detect & clean video metadata
    if (validated.video_url && validated.video_url.trim()) {
      const parsedVideo = parseVideoUrl(validated.video_url);
      if (parsedVideo.isValid) {
        validated.video_provider = parsedVideo.provider;
        validated.video_url = parsedVideo.cleanUrl || validated.video_url;
      }
    } else {
      validated.video_provider = "none";
    }

    const { data, error } = await supabase
      .from("projects")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(data, "Work item created successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function updateProjectAction(id, payload) {
  try {
    const { supabase } = await requireAdminDatabase();
    const validated = projectSchema.parse(payload);

    // Auto-detect & clean video metadata
    if (validated.video_url && validated.video_url.trim()) {
      const parsedVideo = parseVideoUrl(validated.video_url);
      if (parsedVideo.isValid) {
        validated.video_provider = parsedVideo.provider;
        validated.video_url = parsedVideo.cleanUrl || validated.video_url;
      }
    } else {
      validated.video_provider = "none";
    }

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
    return successResponse(data, "Work item updated successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function deleteProjectAction(id) {
  try {
    const { supabase } = await requireAdminDatabase();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(null, "Work item deleted successfully.");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function toggleProjectPublishAction(id, newStatus) {
  try {
    const { supabase } = await requireAdminDatabase();
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
    return successResponse(data, `Status updated to ${newStatus}.`);
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Safely purges ONLY items tagged with is_demo = true.
 * Requires explicit string confirmation ("DELETE DEMO CONTENT").
 * Never deletes or alters real portfolio records.
 */
export async function purgeDemoProjectsAction({ confirmationText }) {
  try {
    const { supabase } = await requireAdminDatabase();

    if (!confirmationText || confirmationText.trim() !== "DELETE DEMO CONTENT") {
      throw new Error(
        "Purge aborted: Please type 'DELETE DEMO CONTENT' exactly to confirm deletion of demonstration records."
      );
    }

    // Exclusively target demo items
    const { data: deletedRows, error } = await supabase
      .from("projects")
      .delete()
      .eq("is_demo", true)
      .select("id, title");

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(
      deletedRows,
      `Successfully purged ${deletedRows?.length || 0} demonstration work item(s). Real portfolio records remain untouched.`
    );
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Inserts high-fidelity demonstration work items across all 4 Creative Worlds.
 * Strictly tagged with is_demo = true for isolated testing.
 */
export async function seedDemoProjectsAction() {
  try {
    const { supabase } = await requireAdminDatabase();

    const demoItems = [
      // World 01: Graphic Design
      {
        slug: "demo-lumina-identity",
        number: "D1",
        title: "Lumina Brand Identity",
        world_slug: "graphic-design",
        category: "Brand Identity",
        tagline: "Minimalist Architectural Lighting Identity",
        description: "Comprehensive corporate brand system featuring dynamic responsive mark, bespoke stationery, and geometric packaging design.",
        long_description: "Crafted for a contemporary architectural lighting firm. The identity merges Swiss typographic principles with strict mathematical proportions, spanning business cards, packaging, outdoor billboards, and brand guidelines.",
        features: ["Dynamic vector logomark suite", "Custom geometric grid system", "Sustainable packaging guidelines", "Complete corporate identity program"],
        tech: ["Illustrator", "Photoshop", "InDesign", "Print Specs"],
        year: "2025",
        cover_image_url: "/images/project-iiuc-cover.jpg",
        accent: "#F46A45",
        client: "Lumina Studio",
        video_url: "",
        video_provider: "none",
        aspect_ratio: "1:1",
        is_featured: true,
        is_demo: true,
        status: "published",
        display_order: 1,
      },
      // World 02: UI/UX Design
      {
        slug: "demo-apex-fintech-app",
        number: "D2",
        title: "Apex Mobile Banking UI",
        world_slug: "ui-ux-design",
        category: "Mobile App UI Design",
        tagline: "Next-Generation Cross-Border Wealth Experience",
        description: "Zero-latency financial management app with biometric vaults, currency swap matrices, and fluid 120fps micro-animations.",
        long_description: "Designed from wireframe to interactive Figma prototype. Features an enterprise-grade dark UI mode, high-contrast accessible typography tokens (WCAG AAA), and custom haptic feedback choreography.",
        features: ["Instant biometric auth flow", "Real-time FX currency swap matrix", "Interactive spending analytics", "Variable-mode design token system"],
        tech: ["Figma", "Design Tokens", "Prototyping", "Design Systems"],
        year: "2025",
        cover_image_url: "/images/project-racdox.jpg",
        prototype_url: "https://figma.com",
        accent: "#FF8662",
        client: "Apex Global FinTech",
        video_url: "",
        video_provider: "none",
        aspect_ratio: "9:16",
        is_featured: true,
        is_demo: true,
        status: "published",
        display_order: 2,
      },
      // World 03: Web Development
      {
        slug: "demo-synapse-cloud-engine",
        number: "D3",
        title: "Synapse Cloud Engine",
        world_slug: "web-development",
        category: "Web Applications",
        tagline: "Distributed Microservice Telemetry Console",
        description: "Real-time edge metrics monitor with low-overhead WebSockets, vector topology graph, and automated anomaly isolation.",
        long_description: "Full-stack cloud console built with Next.js App Router, Tailwind CSS, and resilient WebSocket pipelines. Renders thousands of concurrent data nodes with zero frame drops.",
        features: ["Sub-50ms WebSocket telemetry feed", "WebGL node cluster visualization", "Multi-region health probes", "Automated incident runbooks"],
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "WebSockets"],
        year: "2025",
        cover_image_url: "/images/project-protocolzero.jpg",
        live_url: "https://github.com/aliazgorLab",
        github_url: "https://github.com/aliazgorLab",
        accent: "#E65A32",
        metrics: "Sub-50ms live telemetry",
        video_url: "",
        video_provider: "none",
        aspect_ratio: "16:9",
        is_featured: true,
        is_demo: true,
        status: "published",
        display_order: 3,
      },
      // World 04: Video & Motion
      {
        slug: "demo-kinetic-dimension-reel",
        number: "D4",
        title: "Kinetic Dimension Showreel",
        world_slug: "video-motion",
        category: "Motion Graphics",
        tagline: "Kinetic Typography & 3D Sequence Reel",
        description: "Energetic montage of kinetic typography, procedural visual sequences, and logo stingers choreographed to bespoke sound design.",
        long_description: "An intensive motion exploration demonstrating 3D displacement, optical typography tracking, and audio-reactive pacing built for modern brand announcements and festival openers.",
        features: ["120fps motion tracking sequences", "Custom sound design synchronization", "Procedural particle displacement", "Modular social teaser cuts (9:16)"],
        tech: ["After Effects", "Cinema 4D", "Premiere Pro", "Sound Design"],
        year: "2025",
        cover_image_url: "/images/project-osmentor.jpg",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        video_provider: "youtube",
        aspect_ratio: "16:9",
        accent: "#9B3825",
        is_featured: true,
        is_demo: true,
        status: "published",
        display_order: 4,
      },
    ];

    const results = [];
    for (const item of demoItems) {
      const { data, error } = await supabase
        .from("projects")
        .upsert(item, { onConflict: "slug" })
        .select()
        .single();
      if (!error && data) results.push(data);
    }

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return successResponse(
      results,
      `Successfully generated ${results.length} isolated demonstration items across all 4 Creative Worlds.`
    );
  } catch (err) {
    return errorResponse(err);
  }
}


