import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routes/health.js";
import projectsRouter from "./routes/projects.js";
import artworksRouter from "./routes/artworks.js";
import experiencesRouter from "./routes/experiences.js";
import educationRouter from "./routes/education.js";
import skillsRouter from "./routes/skills.js";
import certificationsRouter from "./routes/certifications.js";
import achievementsRouter from "./routes/achievements.js";
import settingsRouter from "./routes/settings.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/health", healthRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/artworks", artworksRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/education", educationRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/certifications", certificationsRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/stats", statsRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "Portfolio CMS Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      projects: "/api/projects",
      artworks: "/api/artworks",
      experiences: "/api/experiences",
      education: "/api/education",
      skills: "/api/skills",
      certifications: "/api/certifications",
      achievements: "/api/achievements",
      settings: "/api/settings",
      stats: "/api/stats/admin",
    },
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Portfolio Backend running on http://localhost:${port}`);
  });
}

export default app;
