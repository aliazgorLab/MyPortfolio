import { z } from "zod";
import { parseVideoUrl, ALLOWED_ASPECT_RATIOS } from "./video.js";

export const galleryItemSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, "Gallery image URL is required"),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
  alt_text: z.string().trim().max(200).optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
});

export const projectSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters")
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
    number: z.string().trim().default("01"),
    title: z.string().trim().min(2, "Title is required").max(200),
    category: z.string().trim().min(2, "Category is required").max(100),
    tagline: z.string().trim().max(300).optional().or(z.literal("")),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    long_description: z.string().trim().optional().or(z.literal("")),
    features: z.array(z.string().trim()).default([]),
    tech: z.array(z.string().trim()).default([]),
    year: z.string().trim().regex(/^\d{4}$/, "Year must be a 4-digit number (e.g. 2024)"),
    cover_image_id: z.string().uuid("Invalid cover image media ID").nullable().optional(),
    cover_image_url: z.string().trim().optional().or(z.literal("")),
    live_url: z.string().trim().url("Invalid live URL").optional().or(z.literal("")),
    github_url: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")),
    prototype_url: z.string().trim().url("Invalid prototype URL").optional().or(z.literal("")),
    accent: z
      .string()
      .trim()
      .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Accent must be a valid hex color")
      .default("#F46A45"),
    metrics: z.string().trim().max(100).optional().or(z.literal("")),
    client: z.string().trim().max(150).optional().or(z.literal("")),
    world_id: z.string().uuid("Invalid world UUID").nullable().optional(),
    world_slug: z
      .enum(["graphic-design", "ui-ux-design", "web-development", "video-motion"])
      .nullable()
      .optional(),
    creative_category_id: z.string().uuid("Invalid category UUID").nullable().optional(),
    video_url: z.string().trim().optional().or(z.literal("")),
    video_provider: z.enum(["youtube", "vimeo", "direct", "none"]).default("none"),
    aspect_ratio: z.enum(["16:9", "9:16", "1:1", "4:5", "21:9", "4:3"]).default("16:9"),
    is_featured: z.boolean().default(false),
    is_demo: z.boolean().default(false),
    display_order: z.coerce.number().int().default(0),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    gallery_images: z.array(galleryItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.video_url && data.video_url.trim()) {
      const parsed = parseVideoUrl(data.video_url);
      if (!parsed.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: parsed.error || "Invalid video URL",
          path: ["video_url"],
        });
      }
    }
  });

