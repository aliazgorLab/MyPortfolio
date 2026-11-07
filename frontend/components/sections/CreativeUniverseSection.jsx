"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  Layout,
  Terminal,
  Film,
  ArrowUpRight,
  Sparkles,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const WORLDS = [
  {
    code: "WORLD 01",
    slug: "graphic-design",
    title: "GRAPHIC DESIGN",
    subtitle: "Brand Identity, Typography & Print",
    description:
      "Precision-crafted logos, cohesive brand identity manuals, exhibition posters, multi-platform banner suites, and publication print design.",
    accent: "#F46A45",
    accentLight: "#FF8662",
    icon: Palette,
    href: "/universe/graphic-design",
    cta: "ENTER EXHIBITION",
    previewImage: "/images/about-sculpture.jpg",
    aspectPreview: "Poster & Brandmark Gallery",
    categories: [
      "Logo Design",
      "Brand Identity",
      "Poster Design",
      "Banner Design",
      "Social Media Design",
      "Print Design",
    ],
    stats: "6 Checkpoints · Curated Works",
    borderHighlight: "hover:border-[#F46A45]",
    glowColor: "rgba(244, 106, 69, 0.25)",
  },
  {
    code: "WORLD 02",
    slug: "ui-ux-design",
    title: "UI/UX DESIGN",
    subtitle: "Digital Interfaces, Prototypes & Design Systems",
    description:
      "Human-centered digital products, responsive web interfaces, mobile app wireframes, accessible design token architectures, and Figma prototypes.",
    accent: "#FF8662",
    accentLight: "#FFA385",
    icon: Layout,
    href: "/universe/ui-ux-design",
    cta: "ENTER INTERFACE LAB",
    previewImage: "/images/project-iiuc-cover.jpg",
    aspectPreview: "Device Viewports & Systems",
    categories: [
      "Website UI",
      "Mobile App UI",
      "Dashboard Design",
      "Design Systems",
      "Prototypes",
      "UX Case Studies",
    ],
    stats: "6 Checkpoints · High-Fidelity Labs",
    borderHighlight: "hover:border-[#FF8662]",
    glowColor: "rgba(255, 134, 98, 0.25)",
  },
  {
    code: "WORLD 03",
    slug: "web-development",
    title: "WEB DEVELOPMENT",
    subtitle: "Full-Stack Software, Interactive Systems & Tools",
    description:
      "High-throughput web applications, AI-integrated RAG platforms, interactive Canvas graphics, full-stack APIs, and cryptographic simulations.",
    accent: "#E65A32",
    accentLight: "#F07753",
    icon: Terminal,
    href: "/universe/web-development",
    cta: "ENTER DIGITAL SYSTEMS",
    previewImage: "/images/project-osmentor.jpg",
    aspectPreview: "Full-Stack Software & Tools",
    categories: [
      "Web Applications",
      "Full-Stack",
      "Frontend Engineering",
      "Tools & Utilities",
      "Interactive Web",
    ],
    stats: "5 Checkpoints · Live Deployed Apps",
    borderHighlight: "hover:border-[#E65A32]",
    glowColor: "rgba(230, 90, 50, 0.25)",
  },
  {
    code: "WORLD 04",
    slug: "video-motion",
    title: "VIDEO & MOTION",
    subtitle: "Motion Graphics, Visual Sequences & Showreels",
    description:
      "Dynamic kinetic typography, promotional video edits, rhythmic showreels, social media vertical reels, and cinematic event teasers.",
    accent: "#9B3825",
    accentLight: "#B84832",
    icon: Film,
    href: "/universe/video-motion",
    cta: "ENTER SCREENING ROOM",
    previewImage: "/images/project-deadlock.jpg",
    aspectPreview: "16:9 & 9:16 Video Screening",
    categories: [
      "Promotional Videos",
      "Motion Graphics",
      "Video Editing",
      "Social Media Reels",
      "Event Videos",
      "Showreels",
    ],
    stats: "6 Checkpoints · Motion Sequences",
    borderHighlight: "hover:border-[#9B3825]",
    glowColor: "rgba(155, 56, 37, 0.25)",
  },
];

export default function CreativeUniverseSection() {
  const [hoveredWorld, setHoveredWorld] = useState(null);

  return (
    <section
      id="work"
      className="py-24 md:py-36 px-4 sm:px-6 bg-obsidian relative noise-bg overflow-hidden"
    >
      {/* Anchor preserves #projects and #work */}
      <div id="projects" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-8 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
              <span>03 // CREATIVE UNIVERSE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-softwhite uppercase tracking-tight">
              EXPLORE MY <span className="text-orange">UNIVERSE</span>
            </h2>
            <p className="font-sans text-mist text-base md:text-lg mt-3 max-w-xl leading-relaxed">
              Four disciplines. One creative journey. Step through a portal to enter an interactive exhibition of my work.
            </p>
          </div>

          {/* Quick Hub Link Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/universe"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-orange/40 bg-orange/10 hover:bg-orange hover:text-obsidian text-orange font-mono text-xs font-semibold tracking-wider transition-all shadow-lg shadow-orange/10"
            >
              <Compass className="w-4 h-4 text-orange group-hover:text-obsidian transition-colors" />
              <span>VIEW UNIVERSE MAP</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Creative World Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORLDS.map((world, index) => {
            const Icon = world.icon;
            const isHovered = hoveredWorld === world.slug;

            return (
              <Link
                key={world.slug}
                href={world.href}
                onMouseEnter={() => setHoveredWorld(world.slug)}
                onMouseLeave={() => setHoveredWorld(null)}
                className={`group relative rounded-2xl border border-white/10 bg-charcoal p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${world.borderHighlight}`}
                style={{
                  boxShadow: isHovered
                    ? `0 20px 40px ${world.glowColor}`
                    : "none",
                }}
              >
                {/* Background Ambient Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 20%, ${world.accent}, transparent 70%)`,
                  }}
                />

                {/* Top Discipline Tag */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-orange uppercase">
                      {world.code}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-graphite border border-white/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-obsidian transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-softwhite group-hover:text-orange transition-colors tracking-tight mb-1">
                    {world.title}
                  </h3>
                  <p className="text-[11px] font-mono text-mist/70 uppercase tracking-wider mb-3">
                    {world.subtitle}
                  </p>
                  <p className="text-mist text-xs sm:text-sm font-sans line-clamp-3 leading-relaxed">
                    {world.description}
                  </p>
                </div>

                {/* Middle Visual Preview Box */}
                <div className="relative z-10 my-4 rounded-xl overflow-hidden border border-white/10 bg-obsidian aspect-[16/10] relative group/img">
                  <Image
                    src={world.previewImage}
                    alt={world.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

                  {/* Preview Tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-softwhite/90">
                    <span className="truncate">{world.aspectPreview}</span>
                    <span className="text-orange font-semibold">EXPLORE →</span>
                  </div>
                </div>

                {/* Categories Checkpoint Badges */}
                <div className="relative z-10 my-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
                    CATEGORIES:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {world.categories.slice(0, 3).map((cat, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-100 text-mist"
                      >
                        {cat}
                      </span>
                    ))}
                    {world.categories.length > 3 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-100 text-orange font-semibold">
                        +{world.categories.length - 3} MORE
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-softwhite group-hover:text-orange transition-colors flex items-center gap-1.5">
                    <span>{world.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-orange" />
                  </span>
                  <span className="text-[10px] text-muted font-mono">
                    {world.code.slice(-2)}/04
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Direct Case Studies Quick-Shelf */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="text-orange">DIRECT ACCESS:</span>
            <span>Featured Case Studies —</span>
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
