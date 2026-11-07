import { z } from "zod";

export const creativeWorldSchema = z.object({
  title: z.string().trim().min(2, "World title is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  subtitle: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  accent_color: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Accent must be a valid hex color")
    .default("#F46A45"),
  display_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const creativeCategorySchema = z.object({
  world_id: z.string().uuid("A valid parent World ID is required"),
  name: z.string().trim().min(2, "Category name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

