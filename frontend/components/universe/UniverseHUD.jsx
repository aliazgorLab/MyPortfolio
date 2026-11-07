"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Sparkles, Layers } from "lucide-react";

export default function UniverseHUD({
  currentWorldSlug = "graphic-design",
  worlds = [],
  activeCategoryName = "",
}) {
  const worldList = worlds.length > 0 ? worlds : [
    { slug: "graphic-design", title: "Graphic Design", code: "01" },
    { slug: "ui-ux-design", title: "UI/UX Design", code: "02" },
    { slug: "web-development", title: "Web Development", code: "03" },
    { slug: "video-motion", title: "Video & Motion", code: "04" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-obsidian/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Left: Back to Home / Universe Hub */}
        <div className="flex items-center gap-3">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-surface-50 text-xs font-mono text-mist hover:text-white hover:border-orange hover:bg-surface-100 transition-all focus:outline-none focus:ring-2 focus:ring-orange/50"
            aria-label="Return to portfolio homepage work section"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-orange" />
            <span className="hidden sm:inline">HOME</span>
            <span className="text-white/40">//</span>
            <span className="text-orange">WORK</span>
          </Link>

          <Link
            href="/universe"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-surface-50 text-xs font-mono text-mist hover:text-white hover:border-white/30 transition-all"
            title="View all 4 Worlds in Universe Overview"
          >
            <Compass className="w-3.5 h-3.5 text-orange" />
            <span>UNIVERSE HUB</span>
          </Link>
        </div>

        {/* Center: Discipline Switcher Navigation */}
        <nav
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1"
          aria-label="Creative Universe Worlds"
        >
          {worldList.map((world, index) => {
            const isActive = world.slug === currentWorldSlug;
            const code = String(index + 1).padStart(2, "0");

            return (
              <Link
                key={world.slug}
                href={`/universe/${world.slug}`}
                className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange/50 ${
                  isActive
                    ? "bg-orange text-obsidian font-semibold shadow-lg shadow-orange/20"
                    : "text-mist/80 hover:text-white hover:bg-surface-100 border border-transparent hover:border-white/10"
                }`}
              >
                <span className={isActive ? "text-obsidian/70" : "text-orange"}>
                  {code}
                </span>
                <span className="hidden lg:inline">{world.title}</span>
                <span className="lg:hidden">
                  {world.slug === "graphic-design"
                    ? "GRAPHIC"
                    : world.slug === "ui-ux-design"
                    ? "UI/UX"
                    : world.slug === "web-development"
                    ? "DEV"
                    : "MOTION"}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-obsidian animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Telemetry Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-right">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-orange uppercase flex items-center justify-end gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-ping" />
              <span>EXPLORATION MODE</span>
            </div>
            <div className="text-xs font-mono text-softwhite/80 truncate max-w-[180px]">
              {activeCategoryName || "Checkpoint Active"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
