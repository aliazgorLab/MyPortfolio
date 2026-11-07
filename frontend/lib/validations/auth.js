import { z } from "zod";

export const loginSchema = z
  .object({
    identifier: z.string().trim().min(3, "Admin ID or Email must be at least 3 characters").optional(),
    email: z.string().trim().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => Boolean(data.identifier || data.email), {
    message: "Admin ID or Email is required",
    path: ["identifier"],
  });

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  avatar_url: z.string().trim().url("Invalid avatar URL").optional().or(z.literal("")),
});
