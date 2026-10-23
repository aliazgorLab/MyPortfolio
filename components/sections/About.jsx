"use client";

import Image from "next/image";
import { personalInfo } from "@/data/portfolioData";
import { GraduationCap, MapPin, Compass, Terminal } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-28 md:py-36 px-6 bg-charcoal/40 relative border-t border-white/5 noise-bg">
      <div id="research" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-4">
          <span>04 //</span>
          <span>A LITTLE ABOUT ME</span>
        </div>

        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Sculpture Panel (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-surface-100 group shadow-2xl">
              <Image
                src="/images/about-sculpture.jpg"
                alt="Digital form and engineering precision abstract sculpture"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Fog & Rim Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80" />

              {/* Overlay Metadata */}
              <div className="absolute bottom-6 left-6 right-6 text-softwhite">
                <div className="font-mono text-[10px] text-lavender tracking-widest uppercase mb-1">
                  DISCIPLINE // SPEC.02
                </div>
                <div className="font-display text-xl font-bold tracking-tight">
                  CSE & Interface Architecture
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted">
                  <span>IIUC · CHITTAGONG</span>
                  <span className="text-emerald-400">● ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Core Philosophy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Headline */}
            <h2 className="font-display-heading text-softwhite mb-8 tracking-tighter">
              CURIOUS BY NATURE.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-softwhite via-mist to-lavender">
                PRECISE BY DESIGN.
              </span>
            </h2>

            {/* Narrative text */}
            <div className="flex flex-col gap-5 text-muted/90 font-sans text-base sm:text-lg leading-relaxed mb-10">
              <p>
                I&apos;m <span className="text-softwhite font-medium">Md Ali Azgor</span>, a Computer Science and Engineering student at <span className="text-softwhite font-medium">International Islamic University Chittagong</span>.
              </p>
              <p>
                My interests span interface design, frontend engineering, and the systems that make digital products useful. I enjoy turning ideas into considered interfaces and working software.
              </p>
              <p className="text-sm text-muted">
                Rather than treating visual design and backend logic as isolated disciplines, I approach development holistically: ensuring visual precision without compromising performance, data integrity, or accessibility.
              </p>
            </div>

            {/* Quick Metrics / Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="p-4 rounded-xl bg-surface-100/50 border border-white/5 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-0.5">
                    ACADEMIC FOCUS
                  </span>
                  <span className="font-display text-sm font-semibold text-softwhite">
                    B.Sc. in CSE (IIUC)
                  </span>
                  <p className="font-mono text-xs text-muted/70 mt-1">
                    Class of 2026
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-100/50 border border-white/5 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-0.5">
                    LOCATION & TIMEZONE
                  </span>
                  <span className="font-display text-sm font-semibold text-softwhite">
                    Chittagong, Bangladesh
                  </span>
                  <p className="font-mono text-xs text-muted/70 mt-1">
                    UTC+6 (BST)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-100/50 border border-white/5 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-0.5">
                    CORE SPECIALTY
                  </span>
                  <span className="font-display text-sm font-semibold text-softwhite">
                    Creative Frontend & Systems
                  </span>
                  <p className="font-mono text-xs text-muted/70 mt-1">
                    React · Next.js · Design Systems
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-100/50 border border-white/5 flex items-start gap-3">
                <Compass className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-0.5">
                    STATUS
                  </span>
                  <span className="font-display text-sm font-semibold text-emerald-400">
                    Open for Projects
                  </span>
                  <p className="font-mono text-xs text-muted/70 mt-1">
                    Internships & Collaborations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
