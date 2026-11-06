import { Router } from "express";
import { getPublicWebsiteSettings } from "../services/portfolio.js";
import { settingsSchema } from "../validations/settings.js";
import { createAdminClient } from "../supabase/admin.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const settings = await getPublicWebsiteSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.put("/admin", async (req, res, next) => {
  try {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const admin = createAdminClient();
    const existing = await admin.from("website_settings").select("id").limit(1).maybeSingle();

    let result;
    if (existing.data?.id) {
      result = await admin
        .from("website_settings")
        .update(parsed.data)
        .eq("id", existing.data.id)
        .select()
        .single();
    } else {
      result = await admin
        .from("website_settings")
        .insert(parsed.data)
        .select()
        .single();
    }

    if (result.error) throw result.error;
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

export default router;

