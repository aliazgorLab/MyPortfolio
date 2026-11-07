"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Compass, Maximize2, Sparkles, ArrowUpRight } from "lucide-react";

// Dynamically import 3D Universe Hub (WebGL Client-Only)
const UniverseHub3D = dynamic(
  () => import("@/components/universe/three/UniverseHub3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[580px] bg-charcoal rounded-2xl border border-white/10 flex flex-col items-center justify-center text-orange font-mono">
        <div className="w-10 h-10 rounded-full border-2 border-orange border-t-transparent animate-spin mb-3" />
        <span className="text-xs uppercase tracking-widest">
          LOADING 3D UNIVERSE ATRIUM...
        </span>
      </div>
    ),
  }
);

const WORLDS = [
  {
    code: "01",
    slug: "graphic-design",
    title: "GRAPHIC DESIGN",
    subtitle: "Brand Identity, Typography & Print",
    accent: "#F46A45",
    href: "/universe/graphic-design",
  },
  {
    code: "02",
    slug: "ui-ux-design",
    title: "UI/UX DESIGN",
    subtitle: "Interfaces, Systems & Prototypes",
    accent: "#FF8662",
    href: "/universe/ui-ux-design",
  },
  {
    code: "03",
    slug: "web-development",
    title: "WEB DEVELOPMENT",
    subtitle: "Software Systems & Full-Stack",
    accent: "#E65A32",
    href: "/universe/web-development",
  },
  {
    code: "04",
    slug: "video-motion",
    title: "VIDEO & MOTION",
    subtitle: "Motion Graphics & Showreels",
    accent: "#9B3825",
    href: "/universe/video-motion",
  },
];

export default function CreativeUniverseSection() {
  return (
    <section
      id="work"
      className="py-24 md:py-32 px-4 sm:px-6 bg-obsidian relative noise-bg overflow-hidden"
    >
      {/* Anchor preserves #projects and #work */}
      <div id="projects" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
              <span>03 // 3D CREATIVE UNIVERSE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-softwhite uppercase tracking-tight">
              EXPLORE MY <span className="text-orange">UNIVERSE</span>
            </h2>
            <p className="font-sans text-mist text-base md:text-lg mt-3 max-w-xl leading-relaxed">
              Four disciplines. One creative journey. Navigate the interactive 3D atrium below or click any portal to enter the virtual exhibition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/universe"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-orange/40 bg-orange/10 hover:bg-orange hover:text-obsidian text-orange font-mono text-xs font-semibold tracking-wider transition-all shadow-lg shadow-orange/10"
            >
              <Maximize2 className="w-4 h-4 text-orange group-hover:text-obsidian transition-colors" />
              <span>ENTER FULLSCREEN 3D HUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Real 3D Universe Viewport */}
        <div className="relative w-full h-[600px] md:h-[680px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
          <UniverseHub3D isCompactSection={true} />
        </div>

        {/* Fast Discipline Navigation Strip Below Viewport */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {WORLDS.map((w) => (
            <Link
              key={w.slug}
              href={w.href}
              className="group p-4 rounded-xl border border-white/10 bg-charcoal/80 hover:border-orange/60 hover:bg-surface-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-orange uppercase tracking-wider block">
                  WORLD {w.code}
                </span>
                <span className="text-sm font-display font-bold text-softwhite group-hover:text-orange transition-colors">
                  {w.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-mist/70 mt-3 pt-2 border-t border-white/5">
                <span>ENTER WORLD</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Direct Access Shelf to Existing Case Studies */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="text-orange">DIRECT CASE STUDIES:</span>
            <span>Archived in depth —</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/work/iiuc-cover-generator"
              className="text-mist hover:text-white hover:underline flex items-center gap-1"
            >
              <span>IIUC Cover Generator</span>
              <ArrowUpRight className="w-3 h-3 text-orange" />
            </Link>
            <span>•</span>
            <Link
              href="/work/osmentor-ai"
              className="text-mist hover:text-white hover:underline flex items-center gap-1"
            >
              <span>OsMentor AI</span>
              <ArrowUpRight className="w-3 h-3 text-orange" />
            </Link>
            <span>•</span>
            <Link
              href="/work/protocolzero"
              className="text-mist hover:text-white hover:underline flex items-center gap-1"
            >
              <span>ProtocolZero</span>
              <ArrowUpRight className="w-3 h-3 text-orange" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
