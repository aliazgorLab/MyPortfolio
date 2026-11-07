"use client";

import React, { useState } from "react";

interface SignatureLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SignatureLogo({ className = "", size = "md" }: SignatureLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Height configurations
  const heightClass = {
    sm: "h-7 sm:h-8",
    md: "h-8 sm:h-9",
    lg: "h-10 sm:h-11",
  }[size];

  return (
    <div
      className={`group relative inline-flex items-center select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Ali Azgor — Home"
    >
      <span className="sr-only">Ali Azgor — Home</span>

      <svg
        viewBox="0 0 118 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-auto ${heightClass} transition-transform duration-300 ease-out group-hover:scale-[1.03]`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Subtle warm glow filter for signature accent */}
          <filter id="sig-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#F46A45"
              floodOpacity="0.65"
            />
          </filter>
          <linearGradient id="sig-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F5F3F0" />
            <stop offset="100%" stopColor="#FFE8DF" />
          </linearGradient>
        </defs>

        {/* ── 1. CAPITAL 'A' STEM & PEAK ── */}
        {/* Upward entry swoop and bold descending spine */}
        <path
          d="M 12 39 C 14 34, 18 20, 26 12 C 30 7.5, 34 7.5, 37 11 C 41 16, 44 28, 48 40"
          stroke="url(#sig-stroke-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        {/* ── 2. 'A' CROSSBAR LOOP THAT FLOWS INTO 'z' ── */}
        {/* Natural signature loop bridging A to z */}
        <path
          d="M 20 28 C 26 23, 34 23, 42 27 C 47 29.5, 51 25, 55 19"
          stroke="url(#sig-stroke-grad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        {/* ── 3. LOWERCASE 'z' WITH CURSIVE RHYTHM ── */}
        {/* Top shoulder, diagonal cut, and elegant baseline finish */}
        <path
          d="M 55 19 C 62 18, 70 18, 76 19.5 C 70 26, 62 33, 56 38 C 64 37, 74 36, 82 35 C 85 34.5, 87 33, 88 31"
          stroke="url(#sig-stroke-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        {/* ── 4. SIGNATURE ACCENT DOT (.) ── */}
        {/* Crisp cinematic orange dot with hover glow */}
        <circle
          cx="96"
          cy="34"
          r="3.4"
          fill="#F46A45"
          filter={isHovered ? "url(#sig-glow)" : undefined}
          className="transition-all duration-300 origin-center group-hover:scale-125"
          style={{ transformOrigin: "96px 34px" }}
        />

        {/* ── 5. REFINED SIGNATURE UNDERLINE ACCENT ── */}
        {/* Tapered accent stroke that draws/glows on hover */}
        <path
          d="M 14 46 C 36 44, 68 45, 96 42"
          stroke="#F46A45"
          strokeWidth={isHovered ? "2.2" : "1.6"}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out origin-left"
          style={{
            opacity: isHovered ? 1 : 0.65,
            transform: isHovered ? "scaleX(1)" : "scaleX(0.85)",
            filter: isHovered ? "drop-shadow(0 0 6px rgba(244,106,69,0.7))" : "none",
          }}
        />
      </svg>
    </div>
  );
}
