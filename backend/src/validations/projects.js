import { z } from "zod";

export const projectSchema = z.object({
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
  accent: z.string().trim().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Accent must be a valid hex color").default("#C7B8FF"),
  metrics: z.string().trim().max(100).optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

