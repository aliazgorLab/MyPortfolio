"use client";

import { useEffect, useRef, useState } from "react";
import ParticlePortrait from "@/components/ui/ParticlePortrait";

export default function Hero() {
  const containerRef = useRef(null);
  const portraitRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    setMounted(true);
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Staggered reveal
    const t = setTimeout(
      () => setRevealed(true),
      prefersReduced.current ? 0 : 120
    );

    // Interaction checks: disable on touch or reduced-motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || prefersReduced.current) return () => clearTimeout(t);

    // Subtle parallax tracking for portrait
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let curX = targetX;
    let curY = targetY;

    const handleMouse = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const tick = () => {
      // Smooth visual lag for subtle portrait parallax
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;

      // Subtle parallax on portrait container
      if (portraitRef.current) {
        const px = ((curX / window.innerWidth) - 0.5) * 8;
        const py = ((curY / window.innerHeight) - 0.5) * 6;
        portraitRef.current.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", handleMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const cls = (base, enter, delay = "") =>
    `${base} transition-all duration-700 ease-out ${delay} ${
      revealed ? enter : "opacity-0 translate-y-6"
    }`;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-obsidian"
      aria-label="Hero — Md Ali Azgor"
    >
      {/* ── Layer 0: Base atmosphere */}
      <div
        className="absolute inset-0 scanline-grid opacity-35 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 20%, black 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 20%, black 80%)",
        }}
      />
      <div className="absolute inset-0 noise-bg opacity-70 pointer-events-none" />

      {/* Outer vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(8,9,11,0.85) 100%)",
        }}
      />


      {/* ── Layer 2: Top metadata bar */}
      <div
        className={cls(
          "relative z-20 pt-28 pb-0 px-6 md:px-10 max-w-[1440px] mx-auto w-full flex items-center justify-between",
          "opacity-100 translate-y-0",
          "delay-100"
        )}
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted/60 uppercase flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#58BFFF] opacity-60" />
          PORTFOLIO SPECIFICATION // 2026
        </span>
        <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] text-muted/50 uppercase">
          DESIGN × ENGINEERING × EXPERIMENTATION
        </span>
      </div>

      {/* ── Layer 3: Main poster composition */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6">
        {/* === TOP HEADLINE: I DESIGN === */}
        <div
          className={cls(
            "w-full max-w-[1200px] mx-auto text-center relative z-10",
            "opacity-100 translate-y-0",
            "delay-[200ms]"
          )}
        >
          <h1
            className="hero-top-line select-none leading-none tracking-tighter text-softwhite uppercase font-display"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
            }}
          >
            I DESIGN
          </h1>
        </div>

        {/* === PORTRAIT CENTER BAND === */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto flex items-end justify-center -mt-5 md:-mt-8 lg:-mt-12">
          {/* Left metadata column */}
          <div
            className={cls(
              "hidden lg:flex flex-col gap-3 pb-6 pr-6 flex-shrink-0 w-44 self-end z-30",
              "opacity-100 translate-y-0",
              "delay-[350ms]"
            )}
          >
            <div className="h-px bg-white/10 w-full mb-1" />
            <p className="font-mono text-[9px] tracking-widest text-muted/60 uppercase leading-relaxed">
              DIGITAL CRAFT
              <br />
              SYSTEMS / INTERACTION
            </p>
            <p className="font-mono text-[9px] tracking-widest text-muted/40 uppercase">
              INDEX 01 — 05
            </p>
          </div>

          {/* Portrait — dominant center element */}
          <div
            ref={portraitRef}
            className={cls(
              "relative flex-shrink-0 z-20",
              "opacity-100 translate-y-0",
              "delay-[300ms]"
            )}
            style={{
              width: "clamp(320px, min(55vw, 760px), 760px)",
            }}
          >
            {/* Soft cyan atmospheric light behind subject */}
            <div
              className="absolute inset-0 -z-10 blur-[90px] opacity-35 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 65% 65% at 50% 45%, #58BFFF 0%, rgba(88, 191, 255, 0.15) 45%, transparent 75%)",
              }}
            />

            {/* Portrait container with bottom gradient fade */}
            <div
              className="relative"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 80%, transparent 98%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 80%, transparent 98%)",
              }}
            >
              <ParticlePortrait
                src="/images/hero_image.png"
                alt="Md Ali Azgor — Creative developer and UI/UX designer with dark glasses, holding a smartphone, lit by dramatic cyan-blue rim lighting"
              />
            </div>

            {/* Fine technical line — left edge of portrait */}
            <div className="absolute top-1/4 -left-3 w-px h-16 bg-gradient-to-b from-transparent via-[#58BFFF]/30 to-transparent hidden lg:block" />
            <div className="absolute top-1/4 -right-3 w-px h-16 bg-gradient-to-b from-transparent via-[#58BFFF]/30 to-transparent hidden lg:block" />
          </div>

          {/* Right metadata column */}
          <div
            className={cls(
              "hidden lg:flex flex-col gap-3 pb-6 pl-6 flex-shrink-0 w-44 self-end z-30",
              "opacity-100 translate-y-0",
              "delay-[400ms]"
            )}
          >
            <div className="h-px bg-white/10 w-full mb-1" />
            <p className="font-sans text-sm text-muted/80 leading-relaxed font-light max-w-[160px]">
              I&apos;m{" "}
              <span className="text-softwhite font-medium">Md Ali Azgor</span>{" "}
              — a CSE student and creative developer at the intersection of
              design &amp; engineering.
            </p>
          </div>
        </div>

        {/* === BOTTOM HEADLINE: WHAT I BUILD. === */}
        <div
          className={cls(
            "w-full max-w-[1200px] mx-auto text-center relative z-30 -mt-5 md:-mt-8 lg:-mt-12 pointer-events-none",
            "opacity-100 translate-y-0",
            "delay-[250ms]"
          )}
        >
          <p
            className="hero-bottom-line select-none leading-none tracking-tighter uppercase font-display"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
            }}
          >
            <span className="text-softwhite">WHAT I </span>
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(243,242,239,0.35)",
              }}
            >
              BUILD
            </span>
            <span
              className="inline-block ml-1"
              style={{ color: "#C7B8FF" }}
            >
              .
            </span>
          </p>
        </div>

        {/* === Mobile bio + CTAs === */}
        <div
          className={cls(
            "lg:hidden w-full max-w-[560px] mx-auto text-center mt-8 px-4",
            "opacity-100 translate-y-0",
            "delay-[450ms]"
          )}
        >
          <p className="font-sans text-sm text-muted/80 leading-relaxed mb-6">
            I&apos;m{" "}
            <span className="text-softwhite font-medium">Md Ali Azgor</span> —
            a CSE student and creative developer exploring the intersection of
            digital design, frontend engineering, and intelligent software.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#work"
              onClick={scrollTo("work")}
              className="hero-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-softwhite text-obsidian font-mono text-[11px] font-semibold tracking-wider uppercase hover:bg-mist transition-colors duration-200"
            >
              <span>EXPLORE SELECTED WORK</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 1v10M1 6l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded border border-white/15 text-softwhite font-mono text-[11px] tracking-wider uppercase hover:border-white/30 transition-colors duration-200"
            >
              <span>LET&apos;S CONNECT</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 9.5L9.5 2.5M4 2.5h5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* === Desktop CTAs (below WHAT I BUILD) === */}
        <div
          className={cls(
            "hidden lg:flex items-center gap-5 mt-10",
            "opacity-100 translate-y-0",
            "delay-[500ms]"
          )}
        >
          <a
            href="#work"
            onClick={scrollTo("work")}
            data-cursor="explore"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded bg-softwhite text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-mist transition-colors duration-200"
          >
            <span>EXPLORE SELECTED WORK</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="transform group-hover:translate-y-0.5 transition-transform duration-200"
              aria-hidden="true"
            >
              <path
                d="M6.5 1v11M1 7l5.5 5 5.5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <a
            href="#contact"
            onClick={scrollTo("contact")}
            data-cursor="contact"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded border border-white/15 text-softwhite font-mono text-xs tracking-wider uppercase hover:border-white/30 transition-all duration-200"
          >
            <span>LET&apos;S CONNECT</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              aria-hidden="true"
            >
              <path
                d="M2.5 10.5L10.5 2.5M4.5 2.5H10.5V8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Layer 4: Bottom scroll divider */}
      <div
        className={cls(
          "relative z-20 px-6 md:px-10 pb-6 pt-4 max-w-[1440px] mx-auto w-full flex items-center justify-between border-t border-white/5 mt-auto",
          "opacity-100 translate-y-0",
          "delay-[600ms]"
        )}
      >
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted/50 uppercase hidden sm:block">
          INDEX 01 — 05 · CURATED SELECTION
        </span>
        <a
          href="#statement"
          onClick={scrollTo("statement")}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted/60 hover:text-[#58BFFF] transition-colors duration-300 uppercase group"
          aria-label="Scroll to explore"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="inline-block group-hover:translate-y-0.5 transition-transform duration-300">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 1v8M1.5 5.5L5 9l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
