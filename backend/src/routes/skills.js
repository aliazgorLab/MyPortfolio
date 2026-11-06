import { Router } from "express";
import { getPublishedSkills } from "../services/portfolio.js";
import { skillSchema } from "../validations/skills.js";
import { createAdminClient } from "../supabase/admin.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await getPublishedSkills();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.post("/admin", async (req, res, next) => {
  try {
    const parsed = skillSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("skills")
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
