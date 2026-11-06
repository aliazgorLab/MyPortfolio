import { z } from "zod";

export const artworkCategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  display_order: z.coerce.number().int().default(0),
});

export const artworkSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().trim().optional().or(z.literal("")),
  category_id: z.string().uuid("Invalid category ID"),
  primary_image_id: z.string().uuid("Invalid primary image media ID").nullable().optional(),
  primary_image_url: z.string().trim().optional().or(z.literal("")),
  thumbnail_image_id: z.string().uuid("Invalid thumbnail image media ID").nullable().optional(),
  thumbnail_image_url: z.string().trim().optional().or(z.literal("")),
  year: z.string().trim().max(10).optional().or(z.literal("")),
  project_context: z.string().trim().max(200).optional().or(z.literal("")),
  aspect_ratio: z.string().trim().default("1:1"),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

