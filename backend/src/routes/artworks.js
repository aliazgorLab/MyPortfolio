import { Router } from "express";
import { getPublishedArtworks } from "../services/portfolio.js";
import { artworkSchema } from "../validations/artworks.js";
import { createAdminClient } from "../supabase/admin.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const artworks = await getPublishedArtworks();
    res.json({ success: true, data: artworks });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/all", async (req, res, next) => {
  try {
    const admin = createAdminClient();
    if (!admin) return res.status(500).json({ success: false, error: "Database unconfigured" });

    const { data, error } = await admin
      .from("artworks")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post("/admin", async (req, res, next) => {
  try {
    const parsed = artworkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("artworks")
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

