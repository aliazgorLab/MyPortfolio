import { z } from "zod";

export const siteSettingSchema = z.object({
  key: z.string().trim().min(2).max(100),
  value: z.any(),
  description: z.string().trim().optional().or(z.literal("")),
  is_public: z.boolean().default(true),
  media_id: z.string().uuid("Invalid media ID").nullable().optional(),
});

// Alias for backwards/route compatibility
export const settingsSchema = siteSettingSchema;

export const personalInfoSettingSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  title: z.string().trim().min(2, "Title is required"),
  bio: z.string().trim().min(10, "Bio is required"),
  aboutParagraphs: z.array(z.string().trim()).default([]),
  location: z.string().trim().default("CHITTAGONG, BANGLADESH"),
  coordinates: z.string().trim().default("22.3569° N, 91.7832° E"),
  status: z.string().trim().default("OPEN FOR COLLABORATION"),
  email: z.string().trim().email("Invalid email"),
  linkedin: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")),
});
