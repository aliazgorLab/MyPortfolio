import { z } from "zod";

export const experienceSchema = z.object({
  slug_id: z
    .string()
    .trim()
    .min(2, "Slug ID is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug ID must be lowercase alphanumeric with hyphens"),
  role: z.string().trim().min(2, "Role is required").max(150),
  company: z.string().trim().min(2, "Company is required").max(150),
  employment_type: z.string().trim().default("Full-time"),
  period: z.string().trim().min(2, "Period is required (e.g. 2026 — PRESENT)"),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  points: z.array(z.string().trim()).default([]),
  skills: z.array(z.string().trim()).default([]),
  organization_logo_id: z.string().uuid("Invalid organization logo ID").nullable().optional(),
  organization_logo_url: z.string().trim().optional().or(z.literal("")),
  note: z.string().trim().max(200).optional().or(z.literal("")),
  is_current: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

