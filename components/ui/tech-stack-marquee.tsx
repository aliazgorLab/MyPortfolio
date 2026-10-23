"use client";

import React from "react";

interface TechItem {
  name: string;
  color: string;
  svg: React.ReactNode;
}

const TECH_STACK: TechItem[] = [
  {
    name: "Next.js",
    color: "#ffffff",
    svg: (
      <svg viewBox="0 0 180 180" className="h-7 w-7" fill="currentColor">
        <path d="M90 0a90 90 0 1 0 90 90A90.1 90.1 0 0 0 90 0zm43.3 139.7L73.9 61.2V124H58.6V49.5h16.2l59.5 78.5V49.5h15.3v90.2z" />
      </svg>
    ),
  },
  {
    name: "React",
    color: "#61DAFB",
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="h-7 w-7" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    svg: (
      <svg viewBox="0 0 128 128" className="h-7 w-7" fill="currentColor">
        <path d="M1.5 0h125v128H1.5z" fill="none" />
        <path d="M117.2 108.5c-2.3 8.3-9.4 13.9-19.1 13.9-13.4 0-21.7-8.6-21.7-22.3 0-14.7 9.8-23.7 23.3-23.7 7.2 0 13 2.9 16.6 7.8l-8.6 5.8c-2.1-2.9-4.8-4.4-8.2-4.4-7.5 0-12.3 5.4-12.3 14.1 0 8.5 4.6 13.6 11.9 13.6 4.6 0 7.7-2.3 9.7-5.5zm-53.9-43.2H47.1V121H35.8V65.3H19.5V55.7h43.8z" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    color: "#06B6D4",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#5FA04E",
    svg: (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
        <path d="M16 2.5L3.5 9.7v14.5L16 31.4l12.5-7.2V9.7L16 2.5zm0 3.2l9.7 5.6v11.3L16 28.2l-9.7-5.6V11.3L16 5.7z" />
      </svg>
    ),
  },
  {
    name: "MongoDB",
    color: "#47A248",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 0C11.5 3 6 8.5 6 14.5c0 4.5 3 8.5 6 9.5 3-1 6-5 6-9.5C18 8.5 12.5 3 12 0zm.4 21.6c-.2-.1-.4-.1-.4-.1v-6.3h-.7V7.1s2.8 4 2.8 7.9c0 3.3-1.4 5.9-1.7 6.6z" />
      </svg>
    ),
  },
  {
    name: "Firebase",
    color: "#FFCA28",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M3.89 15.67L6.2 1.34a.63.63 0 0 1 1.2-.12l2.6 4.93-6.11 9.52zm16.48 2.05l-2.07-13a.64.64 0 0 0-1.12-.29L2.83 18.25l7.95 4.5a2.53 2.53 0 0 0 2.44 0l7.15-5.03zm-10.4-8.8l2.25-4.28a.63.63 0 0 1 1.15.15l1.6 10.02-5-5.89z" />
      </svg>
    ),
  },
  {
    name: "C++",
    color: "#00599C",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M11.5 3.5L3.8 8v9l7.7 4.5 7.7-4.5V8L11.5 3.5zm2.8 11.2a4.4 4.4 0 1 1 0-5.4l1.3-1a6 6 0 1 0 0 7.4l-1.3-1zM18 10.5h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1zm3 0h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z" />
      </svg>
    ),
  },
  {
    name: "Figma",
    color: "#F24E1E",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-4-4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-4h4a4 4 0 1 1 0 8h-4V4zm-8 12a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0zm4 4a4 4 0 0 1 4-4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    color: "#ffffff",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    ),
  },
  {
    name: "Socket.io",
    color: "#ffffff",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.2 14.5l-4.7-6.2h3.5V6.7l4.7 6.2h-3.5z" />
      </svg>
    ),
  },
  {
    name: "Git",
    color: "#F05032",
    svg: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M2.6 10.59L10.6 2.6a2.02 2.02 0 0 1 2.85 0l7.95 7.95a2.02 2.02 0 0 1 0 2.85l-7.95 7.95a2.02 2.02 0 0 1-2.85 0L2.6 13.44a2.02 2.02 0 0 1 0-2.85zm9.4 6.41a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-2.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5-2.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      </svg>
    ),
  },
];

export function TechStackMarquee() {
  return (
    <section className="relative w-full py-10 sm:py-14 overflow-hidden border-y border-white/[0.04] bg-obsidian/40 backdrop-blur-sm select-none">
      {/* Background Mask for Smooth Left/Right Edge Fade */}
      <div className="relative mx-auto max-w-7xl [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]">
        {/* Infinite Running Track */}
        <div className="group flex w-max gap-12 sm:gap-16 items-center animate-marquee hover:[animation-play-state:paused] will-change-transform">
          {/* Double map to guarantee seamless infinite repetition */}
          {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              tabIndex={0}
              className="group/item flex items-center gap-3 cursor-pointer select-none transition-all duration-300 ease-out hover:scale-110 focus:outline-none"
            >
              {/* Logo with default monochrome & full brand color on hover */}
              <div
                className="text-neutral-400 opacity-40 grayscale contrast-75 transition-all duration-300 group-hover/item:text-[var(--brand-color)] group-hover/item:opacity-100 group-hover/item:grayscale-0 group-hover/item:contrast-100"
                style={{ "--brand-color": tech.color } as React.CSSProperties}
              >
                {tech.svg}
              </div>

              {/* Stack label */}
              <span className="font-mono text-sm tracking-tight text-neutral-500 opacity-40 transition-all duration-300 group-hover/item:text-neutral-200 group-hover/item:opacity-100 font-medium">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStackMarquee;
