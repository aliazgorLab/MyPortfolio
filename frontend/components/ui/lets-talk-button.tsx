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
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-surface-elevated/90 border border-white/10 select-none transition-all duration-300 hover:border-orange/50 hover:shadow-[0_0_20px_rgba(244,106,69,0.2)] active:scale-95 ${compact
        ? "px-4 py-2 text-xs"
        : "px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm"
        } ${className}`}
    >
      {/* ============================================================ */}
      {/* INTERNAL LIGHT SWEEP (Strictly constrained within bounds)    */}
      {/* ============================================================ */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full animate-internal-light bg-gradient-to-r from-transparent via-orange/20 to-transparent"
      />

      {/* ============================================================ */}
      {/* CLEAN CONTENT: LABEL + ARROW ONLY                            */}
      {/* ============================================================ */}
      <span className="relative z-10 flex items-center gap-2 font-mono font-medium tracking-tight text-softwhite transition-colors duration-200 group-hover:text-orange-light">
        <span>Let&apos;s Talk</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange" />
      </span>
    </Link>
  );
}

export default LetsTalkButton;
