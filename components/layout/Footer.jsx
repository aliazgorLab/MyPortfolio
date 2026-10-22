"use client";

import { personalInfo } from "@/data/portfolioData";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-obsidian border-t border-white/5 noise-bg text-muted/70">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-display font-bold text-softwhite tracking-wider uppercase text-base">
            Md Ali Azgor
          </span>
          <span className="font-mono text-xs tracking-widest text-muted">
            DESIGN / CODE / EXPERIMENT · FUTURE / FORM
          </span>
        </div>

        {/* Center Technical Coordinates */}
        <div className="font-mono text-xs text-muted/50 hidden lg:block tracking-widest text-center">
          SYSTEM COORD: {personalInfo.coordinates} // BANGLADESH
        </div>

        {/* Right actions & Back to Top */}
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs">
            © {currentYear} ALL RIGHTS RESERVED
          </span>

          <button
            onClick={scrollToTop}
            data-cursor="top"
            className="group flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 hover:border-lavender text-xs font-mono text-softwhite hover:text-lavender transition-all"
            aria-label="Scroll back to top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
