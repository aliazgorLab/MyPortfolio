import { z } from "zod";

export const certificationSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  issuing_organization: z.string().trim().min(2, "Issuing organization is required").max(150),
  issue_date: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  credential_url: z.string().trim().url("Invalid credential URL").optional().or(z.literal("")),
  credential_id: z.string().trim().max(100).optional().or(z.literal("")),
  certificate_image_id: z.string().uuid("Invalid certificate image ID").nullable().optional(),
  certificate_image_url: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  display_order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

