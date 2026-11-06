"use client";

import { useEffect, useState } from "react";
import { personalInfo } from "@/data/portfolioData";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("loading"); // 'loading', 'revealing', 'done'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Respect reduced motion or prior visit
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasVisited = sessionStorage.getItem("aa_visited");

    if (prefersReducedMotion || hasVisited) {
      setStage("done");
      if (onComplete) onComplete();
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 6;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setStage("revealing");
          setTimeout(() => {
            setStage("done");
            sessionStorage.setItem("aa_visited", "true");
            if (onComplete) onComplete();
          }, 800);
        }, 300);
      } else {
        setProgress(current);
      }
    }, 45);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        clearInterval(interval);
        setStage("done");
        sessionStorage.setItem("aa_visited", "true");
        if (onComplete) onComplete();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onComplete]);

  if (!mounted || stage === "done") return null;

  const handleSkip = () => {
    setStage("done");
    sessionStorage.setItem("aa_visited", "true");
    if (onComplete) onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`preloader-overlay fixed inset-0 z-50 flex flex-col items-center justify-between bg-obsidian text-softwhite select-none transition-opacity duration-700 ${
        stage === "revealing" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top telemetry bar */}
      <div className="w-full max-w-7xl px-6 py-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-lavender animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-muted uppercase">
            SYS_INIT // 2026.V2
          </span>
        </div>
        <div className="font-mono text-xs tracking-widest text-muted hidden sm:block">
          COORDINATES: {personalInfo.coordinates}
        </div>
        <button
          onClick={handleSkip}
          className="font-mono text-xs tracking-widest text-lavender/70 hover:text-lavender underline uppercase transition-colors"
        >
          [ SKIP ESC ]
        </button>
      </div>

      {/* Center signature reveal */}
      <div className="flex flex-col items-center text-center px-6">
        {/* Futuristic Monogram */}
        <div className="relative mb-8 w-20 h-20 flex items-center justify-center border border-white/10 rounded-lg bg-surface-100/50 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-lavender/20 via-transparent to-transparent opacity-60 animate-pulse" />
          {/* Subtle horizontal scanline */}
          <div className="absolute inset-x-0 h-[1px] bg-lavender/60 top-0 animate-[scan_2s_ease-in-out_infinite]" />
          <span className="font-display text-3xl font-bold tracking-tighter text-softwhite">
            AA<span className="text-lavender">.</span>
          </span>
        </div>

        {/* Masked Name Reveal */}
        <div className="overflow-hidden mb-3">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-softwhite">
            Md Ali Azgor
          </h1>
        </div>

        <p className="font-mono text-xs sm:text-sm tracking-widest text-lavender/90 uppercase mb-8">
          Future / Form · Portfolio Initialization
        </p>

        {/* Minimal Progress Line & Counter */}
        <div className="w-64 sm:w-80">
          <div className="flex justify-between items-center font-mono text-xs text-muted mb-2">
            <span>LOADING ASSETS</span>
            <span className="text-softwhite font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-lavender transition-all duration-100 ease-out shadow-[0_0_12px_#c7b8ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="w-full max-w-7xl px-6 py-8 flex justify-between items-center text-xs font-mono text-muted/60 border-t border-white/5">
        <span>CSE & CREATIVE DEVELOPMENT</span>
        <span>CLICK ANYWHERE TO ENTER</span>
      </div>
    </div>
  );
}
