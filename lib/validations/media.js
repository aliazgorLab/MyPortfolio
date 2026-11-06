import { z } from "zod";

export const uploadIntentSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required"),
  size_bytes: z.number().int().positive("Size must be greater than 0").max(10485760, "Maximum file size is 10MB"),
  mime_type: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "application/pdf",
  ], { message: "Unsupported file type" }),
  folder: z.enum([
    "projects",
    "artworks",
    "experience",
    "education",
    "certifications",
    "general",
    "documents",
    "private_settings",
  ]),
  is_draft: z.boolean().default(true),
});

export const confirmUploadSchema = z.object({
  storage_path: z.string().trim().min(1),
  bucket: z.enum(["portfolio-media", "portfolio-private"]),
  folder: z.enum([
    "projects",
    "artworks",
    "experience",
    "education",
    "certifications",
    "general",
    "documents",
    "private_settings",
  ]),
  file_name: z.string().trim().min(1),
  size_bytes: z.number().int().positive(),
  mime_type: z.string().trim(),
  alt_text: z.string().trim().max(300).optional().or(z.literal("")),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

