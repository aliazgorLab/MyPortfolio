"use client";

import React, { useEffect, useState } from "react";

export interface ProgressiveBlurProps {
  /**
   * Position of the progressive blur overlay.
   * @default "bottom"
   */
  position?: "bottom" | "top";
  /**
   * Height utility classes for responsive vertical footprint.
   * @default "h-24 sm:h-32 md:h-40"
   */
  height?: string;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
  /**
   * Optional dock or interactive control children rendered inside the blur zone.
   * Controls will automatically receive `pointer-events-auto` and higher stacking context.
   */
  children?: React.ReactNode;
}

/**
 * ProgressiveBlur renders a multi-layer feathered backdrop-blur overlay
 * eliminating hard cutoff edges across WebKit and Chromium engines.
 *
 * Matching modern Apple & Vercel design aesthetics:
 * - Exponential optical falloff (blur 0px -> 24px)
 * - Zero-jank GPU layer promotion (`translateZ(0)`)
 * - Non-blocking pointer events with passthrough clicks
 * - Neutral tinting overlay to preserve deep contrast
 * - Scroll-aware auto-fade: dynamically fades opacity to 0 when reaching
 *   the footer / bottom of the page to eliminate any collision or text blur.
 */
export function ProgressiveBlur({
  position = "bottom",
  height = "h-24 sm:h-32 md:h-40",
  className = "",
  children,
}: ProgressiveBlurProps) {
  const isBottom = position === "bottom";
  const [scrollOpacity, setScrollOpacity] = useState(1);

  /* ── Scroll-Aware Blur Fade ── */
  useEffect(() => {
    if (!isBottom || typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceToBottom = documentHeight - (scrollY + windowHeight);

      // Smoothly fade out the blur when approaching the bottom footer (within 320px)
      if (distanceToBottom < 320) {
        const factor = Math.max(0, Math.min(1, (distanceToBottom - 20) / 300));
        setScrollOpacity(factor);
      } else {
        setScrollOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBottom]);

  return (
    <div
      aria-hidden={!children}
      className={`pointer-events-none fixed inset-x-0 ${
        isBottom ? "bottom-0" : "top-0"
      } ${height} z-30 select-none overflow-hidden ${className}`}
      style={{
        transform: "translateZ(0)",
        willChange: "transform, opacity",
        opacity: isBottom ? scrollOpacity : 1,
        transition: "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Fallback & Base gradient tint */}
      <div
        className={`absolute inset-0 ${
          isBottom
            ? "bg-gradient-to-t from-background/80 via-background/30 to-transparent"
            : "bg-gradient-to-b from-background/80 via-background/30 to-transparent"
        }`}
      />

      {/* Neutral optical tint to prevent muddy graying in dark mode */}
      <div
        className={`absolute inset-0 ${
          isBottom
            ? "bg-gradient-to-t from-white/[0.02] via-transparent to-transparent"
            : "bg-gradient-to-b from-white/[0.02] via-transparent to-transparent"
        }`}
      />

      {/* Layer 1 - Micro blur */}
      <div
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{
          transform: "translateZ(0)",
          maskImage: isBottom
            ? "linear-gradient(to bottom, transparent 0%, black 25%, black 40%, transparent 60%)"
            : "linear-gradient(to top, transparent 0%, black 25%, black 40%, transparent 60%)",
          WebkitMaskImage: isBottom
            ? "linear-gradient(to bottom, transparent 0%, black 25%, black 40%, transparent 60%)"
            : "linear-gradient(to top, transparent 0%, black 25%, black 40%, transparent 60%)",
        }}
      />

      {/* Layer 2 - Low blur */}
      <div
        className="absolute inset-0 backdrop-blur-[3px]"
        style={{
          transform: "translateZ(0)",
          maskImage: isBottom
            ? "linear-gradient(to bottom, transparent 20%, black 40%, black 60%, transparent 80%)"
            : "linear-gradient(to top, transparent 20%, black 40%, black 60%, transparent 80%)",
          WebkitMaskImage: isBottom
            ? "linear-gradient(to bottom, transparent 20%, black 40%, black 60%, transparent 80%)"
            : "linear-gradient(to top, transparent 20%, black 40%, black 60%, transparent 80%)",
        }}
      />

      {/* Layer 3 - Medium blur */}
      <div
        className="absolute inset-0 backdrop-blur-[8px]"
        style={{
          transform: "translateZ(0)",
          maskImage: isBottom
            ? "linear-gradient(to bottom, transparent 40%, black 60%, black 80%, transparent 95%)"
            : "linear-gradient(to top, transparent 40%, black 60%, black 80%, transparent 95%)",
          WebkitMaskImage: isBottom
            ? "linear-gradient(to bottom, transparent 40%, black 60%, black 80%, transparent 95%)"
            : "linear-gradient(to top, transparent 40%, black 60%, black 80%, transparent 95%)",
        }}
      />

      {/* Layer 4 - Heavy blur base */}
      <div
        className="absolute inset-0 backdrop-blur-[16px] sm:backdrop-blur-[24px]"
        style={{
          transform: "translateZ(0)",
          maskImage: isBottom
            ? "linear-gradient(to bottom, transparent 60%, black 85%, black 100%)"
            : "linear-gradient(to top, transparent 60%, black 85%, black 100%)",
          WebkitMaskImage: isBottom
            ? "linear-gradient(to bottom, transparent 60%, black 85%, black 100%)"
            : "linear-gradient(to top, transparent 60%, black 85%, black 100%)",
        }}
      />

      {/* Optional Interactive Dock / Footer controls slot */}
      {children && (
        <div className="pointer-events-auto relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default ProgressiveBlur;
