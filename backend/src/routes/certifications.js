import { Router } from "express";
import { getPublishedCertifications } from "../services/portfolio.js";
import { certificationSchema } from "../validations/certifications.js";
import { createAdminClient } from "../supabase/admin.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await getPublishedCertifications();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.post("/admin", async (req, res, next) => {
  try {
    const parsed = certificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("certifications")
      .insert(parsed.data)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;

