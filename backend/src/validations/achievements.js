import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  organization: z.string().trim().max(150).optional().or(z.literal("")),
  date: z.string().nullable().optional(),
  description: z.string().trim().optional().or(z.literal("")),
  url: z.string().trim().url("Invalid achievement URL").optional().or(z.literal("")),
  badge_image_id: z.string().uuid("Invalid badge image ID").nullable().optional(),
  badge_image_url: z.string().trim().optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

