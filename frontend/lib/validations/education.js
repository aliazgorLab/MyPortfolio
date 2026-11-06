import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().trim().min(2, "Institution is required").max(200),
  degree: z.string().trim().min(2, "Degree is required").max(200),
  department: z.string().trim().max(150).optional().or(z.literal("")),
  start_year: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  end_year: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  current_status: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  institution_logo_id: z.string().uuid("Invalid institution logo ID").nullable().optional(),
  institution_logo_url: z.string().trim().optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

