import { Router } from "express";
import { hasActiveAdmin } from "../supabase/admin.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const adminConfigured = await hasActiveAdmin();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      adminConfigured,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

export default router;

