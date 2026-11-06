"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface LetsTalkButtonProps {
  compact?: boolean;
  className?: string;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function LetsTalkButton({
  compact = false,
  className = "",
  onNavClick,
}: LetsTalkButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavClick) {
      onNavClick(e, "#contact");
    } else {
      e.preventDefault();
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#contact");
      }
    }
  };

  return (
    <Link
      href="#contact"
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-900/90 select-none transition-transform duration-200 active:scale-95 ${
        compact
          ? "px-4 py-2 text-xs"
          : "px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm"
      } ${className}`}
    >
      {/* ============================================================ */}
      {/* INTERNAL LIGHT SWEEP (Strictly constrained within bounds)    */}
      {/* ============================================================ */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full animate-internal-light bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* ============================================================ */}
      {/* CLEAN CONTENT: LABEL + ARROW ONLY                            */}
      {/* ============================================================ */}
      <span className="relative z-10 flex items-center gap-2 font-mono font-medium tracking-tight text-neutral-200 transition-colors duration-200 group-hover:text-white">
        <span>Let&apos;s Talk</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
      </span>
    </Link>
  );
}

export default LetsTalkButton;
