"use client";

import { useState } from "react";
import UniverseHUD from "./UniverseHUD";
import CategoryRail from "./CategoryRail";
import WorkExhibitionStage from "./WorkExhibitionStage";
import WorkSpotlightModal from "./WorkSpotlightModal";
import Link from "next/link";
import { ArrowLeft, Sparkles, Compass, Layers } from "lucide-react";

export default function UniverseWorldLayout({
  world,
  categories = [],
  allWorlds = [],
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [spotlightWork, setSpotlightWork] = useState(null);

  const activeCategory = categories[activeCategoryIndex] || null;
  const currentCategoryWorks = activeCategory?.works || [];

  const handleSelectCategory = (idx) => {
    setActiveCategoryIndex(idx);
    setActiveWorkIndex(0); // Reset to first work of selected checkpoint
  };

  const handleNextCategory = () => {
    if (activeCategoryIndex < categories.length - 1) {
      setActiveCategoryIndex((prev) => prev + 1);
      setActiveWorkIndex(0);
    }
  };

  const hasNextCategory = activeCategoryIndex < categories.length - 1;

  return (
    <main className="min-h-screen bg-obsidian text-softwhite flex flex-col noise-bg selection:bg-orange selection:text-obsidian">
      {/* 1. TOP HUD BAR */}
      <UniverseHUD
        currentWorldSlug={world.slug}
        worlds={allWorlds}
        activeCategoryName={activeCategory?.name || world.title}
      />

      {/* 2. CINEMATIC DISCIPLINE HEADER */}
      <header className="relative py-8 md:py-12 px-4 sm:px-6 border-b border-white/5 bg-gradient-to-b from-graphite/40 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
              <span>DISCIPLINE // {world.slug.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-softwhite tracking-tight">
              {world.title}
            </h1>
            <p className="text-mist text-sm sm:text-base max-w-2xl mt-2 font-sans">
              {world.description || world.subtitle}
            </p>
          </div>

          {/* Quick telemetry & hint */}
          <div className="flex items-center gap-4 text-xs font-mono text-muted/80">
            <div className="border border-white/10 rounded-lg px-3 py-2 bg-charcoal/60">
              <span className="text-orange font-bold">
                {categories.length}
              </span>{" "}
              <span>CHECKPOINTS</span>
            </div>
            <div className="border border-white/10 rounded-lg px-3 py-2 bg-charcoal/60">
              <span className="text-orange font-bold">
                {currentCategoryWorks.length}
              </span>{" "}
              <span>WORKS IN CHECKPOINT</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HORIZONTAL CHECKPOINT TIMELINE RAIL */}
      <CategoryRail
        categories={categories}
        activeCategoryIndex={activeCategoryIndex}
        onSelectCategory={handleSelectCategory}
        accentColor={world.accent_color || "#F46A45"}
      />

      {/* 4. WORK-BY-WORK EXHIBITION STAGE */}
      <div className="flex-1 flex flex-col justify-center">
        <WorkExhibitionStage
          works={currentCategoryWorks}
          currentWorkIndex={activeWorkIndex}
          onNavigateWork={setActiveWorkIndex}
          onOpenSpotlight={(work) => setSpotlightWork(work)}
          categoryName={activeCategory?.name}
          worldSlug={world.slug}
          onNextCategory={handleNextCategory}
          hasNextCategory={hasNextCategory}
        />
      </div>

      {/* 5. BOTTOM NAVIGATION DOCK */}
      <footer className="border-t border-white/10 bg-charcoal/40 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="text-orange">CREATIVE UNIVERSE</span>
            <span>//</span>
            <span>EXPLORATION PROTOCOL</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/universe"
              className="text-mist hover:text-orange transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-orange" />
              <span>UNIVERSE OVERVIEW</span>
            </Link>
            <span>•</span>
            <Link
              href="/#work"
              className="text-mist hover:text-orange transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange" />
              <span>BACK TO PORTFOLIO</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* 6. IMMERSIVE SPOTLIGHT LIGHTBOX MODAL */}
      <WorkSpotlightModal
        work={spotlightWork}
        isOpen={Boolean(spotlightWork)}
        onClose={() => setSpotlightWork(null)}
      />
    </main>
  );
}
