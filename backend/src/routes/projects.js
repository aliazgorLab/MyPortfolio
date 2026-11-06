import { Router } from "express";
import { getPublishedProjects, getProjectBySlug } from "../services/portfolio.js";
import { projectSchema } from "../validations/projects.js";
import { createAdminClient } from "../supabase/admin.js";

const router = Router();

// Public: Get all published projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await getPublishedProjects();
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

// Public: Get published project by slug
router.get("/:slug", async (req, res, next) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// Admin: Get all projects (including drafts/archived)
router.get("/admin/all", async (req, res, next) => {
  try {
    const admin = createAdminClient();
    if (!admin) return res.status(500).json({ success: false, error: "Database unconfigured" });

    const { data, error } = await admin
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// Admin: Create project
router.post("/admin", async (req, res, next) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
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

