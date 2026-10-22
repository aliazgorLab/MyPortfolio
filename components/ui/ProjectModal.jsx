"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-obsidian/90 backdrop-blur-2xl overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-surface-100 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-200/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-lavender font-semibold">
              PROJECT // {project.number}
            </span>
            <span className="font-mono text-xs text-muted uppercase">
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-softwhite transition-colors rounded-lg hover:bg-white/5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {/* Main Visual */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border border-white/10 bg-surface-200">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-softwhite">
              <div>
                <span className="font-mono text-[11px] text-lavender tracking-widest uppercase">
                  {project.tagline}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                  {project.title}
                </h3>
              </div>
              <span className="font-mono text-xs text-muted/80 bg-black/60 px-3 py-1 rounded backdrop-blur-md">
                YEAR: {project.year}
              </span>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Overview & Features (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div>
                <h4 className="font-mono text-xs text-lavender tracking-widest uppercase mb-3">
                  // PROJECT OVERVIEW
                </h4>
                <p className="font-sans text-muted/90 text-base leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {project.features && (
                <div>
                  <h4 className="font-mono text-xs text-lavender tracking-widest uppercase mb-3">
                    // KEY IMPLEMENTATIONS & ARCHITECTURE
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {project.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 font-sans text-sm text-softwhite/90"
                      >
                        <CheckCircle2 className="w-4 h-4 text-lavender shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar Specifications (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 p-6 rounded-xl bg-surface-200/60 border border-white/5">
              <div>
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-1">
                  METRIC HIGHLIGHT
                </span>
                <span className="font-mono text-sm text-softwhite font-medium">
                  {project.metrics || "Active Project"}
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                  TECHNOLOGIES USED
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-surface-300 text-softwhite border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-colors"
                  >
                    <span>VISIT REPOSITORY / APP</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== project.liveUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-white/10 bg-surface-100 text-softwhite font-mono text-xs font-medium tracking-wider uppercase hover:border-lavender hover:text-lavender transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>VIEW SOURCE</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
