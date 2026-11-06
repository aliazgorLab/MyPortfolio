import { Router } from "express";
import { getAdminStats } from "../services/portfolio.js";

const router = Router();

router.get("/admin", async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

export default router;
