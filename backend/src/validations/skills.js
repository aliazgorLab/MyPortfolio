import { z } from "zod";

export const skillCategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  index_label: z.string().trim().max(10).default("01"),
  display_order: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  category_id: z.string().uuid("Invalid skill category ID"),
  name: z.string().trim().min(1, "Skill name is required").max(100),
  proficiency_label: z.string().trim().max(50).optional().or(z.literal("")),
  icon: z.string().trim().max(50).optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

