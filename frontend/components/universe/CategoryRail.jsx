"use client";

import { useRef, useEffect } from "react";
import { Flag, ChevronRight } from "lucide-react";

export default function CategoryRail({
  categories = [],
  activeCategoryIndex = 0,
  onSelectCategory,
  accentColor = "#F46A45",
}) {
  const scrollContainerRef = useRef(null);

  // Auto-scroll active pill into view when changed
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeBtn = scrollContainerRef.current.querySelector(
      `[data-checkpoint-index="${activeCategoryIndex}"]`
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategoryIndex]);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full border-b border-white/10 bg-charcoal/60 backdrop-blur-sm sticky top-16 md:top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted">
            <Flag className="w-3.5 h-3.5 text-orange" />
            <span>DISCIPLINE CHECKPOINTS</span>
            <span className="text-white/20">//</span>
            <span className="text-softwhite">
              {String(activeCategoryIndex + 1).padStart(2, "0")} OF{" "}
              {String(categories.length).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-muted/70">
            <span>TIP: Click any checkpoint to switch gallery</span>
            <ChevronRight className="w-3 h-3 text-orange" />
          </div>
        </div>

        {/* Checkpoint Timeline Buttons */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth"
          role="tablist"
          aria-label="Category Checkpoints"
        >
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            const code = String(idx + 1).padStart(2, "0");
            const workCount = cat.count || (cat.works ? cat.works.length : 0);

            return (
              <button
                key={cat.id || cat.slug || idx}
                data-checkpoint-index={idx}
                onClick={() => onSelectCategory(idx)}
                role="tab"
                aria-selected={isActive}
                className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-xs font-mono transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange/50 ${
                  isActive
                    ? "bg-surface-elevated border-orange text-softwhite shadow-md shadow-orange/10"
                    : "bg-surface-50/70 border-white/5 text-mist hover:text-white hover:border-white/20 hover:bg-surface-100"
                }`}
              >
                {/* Node indicator */}
                <span
                  className={`w-2 h-2 rounded-full transition-transform ${
                    isActive
                      ? "bg-orange scale-125 shadow-[0_0_8px_#F46A45]"
                      : "bg-white/30 group-hover:bg-white/60"
                  }`}
                />

                <span
                  className={`font-semibold ${
                    isActive ? "text-orange" : "text-mist/70"
                  }`}
                >
                  {code}
                </span>

                <span className="font-sans font-medium text-xs tracking-wide">
                  {cat.name}
                </span>

                {/* Work count badge */}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-orange/20 text-orange font-bold"
                      : "bg-white/5 text-muted group-hover:text-mist"
                  }`}
                >
                  {workCount}
                </span>

                {/* Active Underline Beam */}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-2 right-2 h-[2px] bg-orange rounded-full"
                    layoutId="checkpointBeam"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
