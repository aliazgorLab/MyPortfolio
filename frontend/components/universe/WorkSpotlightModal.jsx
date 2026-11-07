"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  BookOpen,
  Calendar,
  Building,
  Tag,
  Layers,
  Play,
  Film,
} from "lucide-react";

/**
 * Extracts YouTube video ID safely from various URL formats.
 */
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo video ID safely.
 */
function getVimeoId(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/);
  return match ? match[2] : null;
}

export default function WorkSpotlightModal({ work, isOpen, onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Reset slide index when opening a new work
  useEffect(() => {
    setActiveSlide(0);
  }, [work]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const gallery = work?.gallery || (work?.cover_image_url ? [{ url: work.cover_image_url, caption: work.title }] : []);
  const totalSlides = gallery.length;

  const handlePrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrevSlide, handleNextSlide]);

  if (!isOpen || !work) return null;

  const currentMedia = gallery[activeSlide] || { url: work.cover_image_url, caption: work.title };
  const ytId = work.video_provider === "youtube" ? getYouTubeId(work.video_url) : null;
  const vimeoId = work.video_provider === "vimeo" ? getVimeoId(work.video_url) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian/95 backdrop-blur-xl transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-charcoal border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spotlight-title"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-graphite">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-orange/20 border border-orange/40 text-orange text-xs font-mono font-semibold uppercase">
                {work.category_name}
              </span>
              <span className="hidden sm:inline text-xs font-mono text-mist/60">//</span>
              <span className="text-xs font-mono text-softwhite/80 hidden sm:inline">
                SPOTLIGHT INSPECTION
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-mist hidden sm:inline">
                SLIDE {String(activeSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/10 text-mist hover:text-white hover:bg-surface-elevated hover:border-orange transition-all focus:outline-none focus:ring-2 focus:ring-orange/50"
                aria-label="Close spotlight modal (Escape)"
              >
                <X className="w-5 h-5 text-softwhite" />
              </button>
            </div>
          </div>

          {/* Modal Body: Two column on desktop, scrollable */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
            {/* Visual Canvas (7 cols) */}
            <div className="lg:col-span-7 bg-obsidian flex flex-col justify-between p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Media Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black/60 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                {/* Safe Video Embed if provider is youtube or vimeo */}
                {ytId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&rel=0`}
                    title={work.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : vimeoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
                    title={work.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <Image
                    src={currentMedia.url}
                    alt={currentMedia.caption || work.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                  />
                )}

                {/* Left/Right Arrows for gallery */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-obsidian/80 hover:bg-orange hover:text-obsidian text-softwhite border border-white/10 transition-all shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-obsidian/80 hover:bg-orange hover:text-obsidian text-softwhite border border-white/10 transition-all shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Slide Caption and thumbnail strip */}
              <div className="mt-4">
                {currentMedia.caption && (
                  <p className="text-xs font-mono text-mist/80 italic mb-3">
                    <span className="text-orange not-italic">CAPTION // </span>
                    {currentMedia.caption}
                  </p>
                )}

                {/* Thumbnail Strip */}
                {totalSlides > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`relative w-16 h-12 rounded-md overflow-hidden border flex-shrink-0 transition-all ${
                          idx === activeSlide
                            ? "border-orange ring-2 ring-orange/30 scale-105"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.caption || `Slide ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Information & Context Details (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-charcoal overflow-y-auto">
              <div>
                <h2
                  id="spotlight-title"
                  className="text-2xl sm:text-3xl font-display font-bold text-softwhite mb-3"
                >
                  {work.title}
                </h2>

                {/* Client & Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 py-4 my-4 border-y border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">CLIENT / CONTEXT</span>
                    <span className="text-softwhite font-medium flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-orange" />
                      {work.client || "Self-Initiated Studio Project"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">TIMELINE</span>
                    <span className="text-softwhite font-medium flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-orange" />
                      {work.year || "2024"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">ASPECT RATIO</span>
                    <span className="text-mist font-medium mt-0.5 block">
                      {work.aspect_ratio || "16:9 Standard"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">MEDIA TYPE</span>
                    <span className="text-mist font-medium mt-0.5 block">
                      {ytId || vimeoId ? "Embedded Video" : "Vector / High-Res Image"}
                    </span>
                  </div>
                </div>

                {/* Long Project Story / Detailed Description */}
                <div className="prose prose-invert max-w-none mb-6">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-orange mb-2">
                    PROJECT ARCHITECTURE & STORY
                  </h3>
                  <p className="text-mist text-sm leading-relaxed whitespace-pre-line font-sans">
                    {work.long_description || work.short_description}
                  </p>
                </div>

                {/* Tags */}
                {work.tags && work.tags.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[10px] font-mono text-muted uppercase block mb-2">
                      DISCIPLINE TAGS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {work.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-surface-100 border border-white/10 text-mist text-xs font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                {work.case_study_slug && (
                  <Link
                    href={`/work/${work.case_study_slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange text-obsidian font-mono font-semibold text-xs hover:bg-orange-light transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>READ CASE STUDY</span>
                  </Link>
                )}

                {work.external_links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-mist hover:text-white font-mono text-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange" />
                    <span>{link.label}</span>
                  </a>
                ))}

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-mist font-mono text-xs transition-all ml-auto"
                >
                  <span>CLOSE [ESC]</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
