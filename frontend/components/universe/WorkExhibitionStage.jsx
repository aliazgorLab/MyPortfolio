"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  BookOpen,
  Calendar,
  Building,
  Layers,
  Sparkles,
  Play,
  CheckCircle2,
} from "lucide-react";

export default function WorkExhibitionStage({
  works = [],
  currentWorkIndex = 0,
  onNavigateWork,
  onOpenSpotlight,
  categoryName = "",
  worldSlug = "graphic-design",
  onNextCategory = null,
  hasNextCategory = false,
}) {
  const [direction, setDirection] = useState(1);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const activeWork = works[currentWorkIndex] || null;
  const totalWorks = works.length;

  const handlePrev = useCallback(() => {
    if (currentWorkIndex > 0) {
      setDirection(-1);
      onNavigateWork(currentWorkIndex - 1);
    }
  }, [currentWorkIndex, onNavigateWork]);

  const handleNext = useCallback(() => {
    if (currentWorkIndex < totalWorks - 1) {
      setDirection(1);
      onNavigateWork(currentWorkIndex + 1);
    } else if (hasNextCategory && onNextCategory) {
      onNextCategory();
    }
  }, [currentWorkIndex, totalWorks, hasNextCategory, onNextCategory, onNavigateWork]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if an input or modal is active
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Only swipe if horizontal movement is greater than vertical (to prevent breaking scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        // Swiped Left -> Go Next
        handleNext();
      } else {
        // Swiped Right -> Go Prev
        handlePrev();
      }
    }
  };

  if (!activeWork) {
    return (
      <div className="py-24 text-center px-6 text-mist font-mono">
        <Layers className="w-10 h-10 text-orange/50 mx-auto mb-4 animate-bounce" />
        <p>No works currently cataloged in this checkpoint.</p>
        {hasNextCategory && (
          <button
            onClick={onNextCategory}
            className="mt-4 px-4 py-2 rounded-lg bg-orange text-obsidian font-semibold text-xs uppercase"
          >
            Advance to Next Checkpoint →
          </button>
        )}
      </div>
    );
  }

  // Animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const isVideo = activeWork.video_provider && activeWork.video_provider !== "none";
  const hasGallery = activeWork.gallery && activeWork.gallery.length > 1;

  return (
    <section
      className="relative w-full py-8 md:py-14 px-4 sm:px-6 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Exhibition Stage"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeWork.id || activeWork.slug}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* LEFT COLUMN: Metadata & Guided Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-1">
              <div>
                {/* Discipline Tag & Checkpoint Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-orange/15 border border-orange/30 text-orange text-[11px] font-mono font-semibold tracking-wider uppercase">
                    {categoryName || activeWork.category_name}
                  </span>
                  {activeWork.is_demo && (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-mist text-[10px] font-mono tracking-wider">
                      EXHIBITION PREVIEW
                    </span>
                  )}
                </div>

                {/* Main Work Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-softwhite leading-tight tracking-tight mb-4">
                  {activeWork.title}
                </h1>

                {/* Client & Metadata Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-mist/80 mb-5 pb-5 border-b border-white/10">
                  {activeWork.client && (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-orange" />
                      <span>{activeWork.client}</span>
                    </div>
                  )}
                  {activeWork.year && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange" />
                      <span>{activeWork.year}</span>
                    </div>
                  )}
                  {activeWork.aspect_ratio && (
                    <div className="flex items-center gap-1.5 text-mist/60">
                      <span>RATIO: {activeWork.aspect_ratio}</span>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-mist text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  {activeWork.short_description}
                </p>

                {/* Tags */}
                {activeWork.tags && activeWork.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {activeWork.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-surface-100 border border-white/5 text-mist/90"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons & Navigation Bar */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {/* Primary: Inspect Artwork */}
                  <button
                    onClick={() => onOpenSpotlight(activeWork)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-orange text-obsidian font-semibold text-xs font-mono tracking-wider hover:bg-orange-light transition-all shadow-lg shadow-orange/20 focus:outline-none focus:ring-2 focus:ring-orange/50 active:scale-95"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>INSPECT ARTWORK & GALLERY</span>
                    {hasGallery && (
                      <span className="px-1.5 py-0.5 rounded bg-obsidian/20 text-obsidian text-[10px] font-bold">
                        {activeWork.gallery.length} IMAGES
                      </span>
                    )}
                  </button>

                  {/* Secondary: Case Study or External Link */}
                  {activeWork.case_study_slug && (
                    <Link
                      href={`/work/${activeWork.case_study_slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-softwhite text-xs font-mono tracking-wider transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-orange" />
                      <span>CASE STUDY</span>
                    </Link>
                  )}

                  {activeWork.external_links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-mist hover:text-white text-xs font-mono tracking-wider transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>

                {/* Stage Navigation HUD Controls */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  {/* Prev Button */}
                  <button
                    onClick={handlePrev}
                    disabled={currentWorkIndex === 0}
                    aria-label="Previous work in checkpoint"
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-mono transition-all ${
                      currentWorkIndex === 0
                        ? "opacity-30 cursor-not-allowed border-white/5 text-muted"
                        : "border-white/10 bg-surface-100 hover:border-orange hover:text-orange text-mist"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">PREVIOUS</span>
                  </button>

                  {/* Counter & Keyboard hint */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold tracking-widest text-softwhite">
                      {String(currentWorkIndex + 1).padStart(2, "0")} /{" "}
                      {String(totalWorks).padStart(2, "0")}
                    </span>
                    <span className="hidden md:inline text-[10px] font-mono text-muted/60">
                      USE [ ← ] [ → ] KEYS
                    </span>
                  </div>

                  {/* Next Button / Next Checkpoint Button */}
                  {currentWorkIndex < totalWorks - 1 ? (
                    <button
                      onClick={handleNext}
                      aria-label="Next work in checkpoint"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-surface-100 hover:border-orange hover:text-orange text-mist text-xs font-mono transition-all"
                    >
                      <span className="hidden sm:inline">NEXT</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : hasNextCategory ? (
                    <button
                      onClick={onNextCategory}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange/20 border border-orange text-orange hover:bg-orange hover:text-obsidian text-xs font-mono font-semibold transition-all"
                    >
                      <span>NEXT CHECKPOINT</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-orange/80">
                      <CheckCircle2 className="w-4 h-4 text-orange" />
                      <span>EXHIBITION END</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Exhibition Artwork Display Canvas (7 cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div
                onClick={() => onOpenSpotlight(activeWork)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-charcoal shadow-2xl transition-all duration-300 hover:border-orange/60 hover:shadow-orange/10 cursor-pointer"
              >
                {/* Top Discipline Visual Frame Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-graphite/90 border-b border-white/10 text-[11px] font-mono text-mist/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
                    <span className="ml-2 text-white/40">//</span>
                    <span className="text-orange uppercase">
                      {worldSlug.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{activeWork.slug}</span>
                    <Maximize2 className="w-3.5 h-3.5 text-mist group-hover:text-orange transition-colors" />
                  </div>
                </div>

                {/* Main Artwork Container */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-obsidian flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(244, 106, 69, 0.15) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Artwork Image */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black/40">
                    <Image
                      src={activeWork.cover_image_url}
                      alt={activeWork.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Video Play Overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <div className="w-16 h-16 rounded-full bg-orange/90 text-obsidian flex items-center justify-center shadow-xl shadow-orange/40 group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Hover Inspect Pill */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-obsidian/90 backdrop-blur-md border border-orange/40 text-orange px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>CLICK TO INSPECT</span>
                    </div>

                    {/* Multi-image indicator badge */}
                    {hasGallery && (
                      <div className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md border border-white/10 text-mist px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-orange" />
                        <span>{activeWork.gallery.length} SLIDES</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="px-4 py-2 bg-graphite/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted">
                  <div className="truncate max-w-[80%]">
                    <span className="text-orange">STAGE // </span>
                    <span>{activeWork.title}</span>
                  </div>
                  <span className="text-white/40">{activeWork.year}</span>
                </div>
              </div>

              {/* Mobile Swipe Navigation Hint */}
              <p className="mt-3 text-center lg:hidden text-[11px] font-mono text-muted/70">
                ← Swipe left or right to navigate artworks →
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
