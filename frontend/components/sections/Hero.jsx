"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
import gsap from "gsap";

const LETTERS = ["P", "O", "R", "T", "F", "O", "L", "I", "O"];

export default function Hero() {
  const containerRef = useRef(null);
  const portraitRef = useRef(null);
  const textBgRef = useRef(null);
  const glowRef = useRef(null);
  const letterRefs = useRef([]);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  const [revealed, setRevealed] = useState(true);
  const rafRef = useRef(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Trigger choreographed entrance reveal
    const revealTimer = setTimeout(() => {
      setRevealed(true);
    }, 60);

    if (prefersReduced.current) return () => clearTimeout(revealTimer);

    // Smooth continuous floating drift & desktop mouse parallax
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to +1
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const tick = (time) => {
      if (!isTouch) {
        curX += (targetX - curX) * 0.055;
        curY += (targetY - curY) * 0.055;
      }

      // Continuous subtle harmonic breathing
      const driftY = Math.sin(time * 0.001) * 4;
      const driftX = Math.cos(time * 0.0006) * 2.5;

      if (textBgRef.current) {
        textBgRef.current.style.transform = `translate3d(${(curX * 12 + driftX).toFixed(2)}px, ${(curY * 6 + driftY).toFixed(2)}px, 0)`;
      }
      if (portraitRef.current) {
        const portraitDriftY = Math.sin(time * 0.0008 + 0.6) * -2;
        portraitRef.current.style.transform = `translate3d(${(curX * -8).toFixed(2)}px, ${(curY * -4 + portraitDriftY).toFixed(2)}px, 0)`;
      }
      if (glowRef.current) {
        const glowScale = 1 + Math.sin(time * 0.0005) * 0.035;
        glowRef.current.style.transform = `translate3d(${(curX * 14).toFixed(2)}px, ${(curY * 8).toFixed(2)}px, 0) scale(${glowScale.toFixed(3)})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    rafRef.current = requestAnimationFrame(tick);

    // Letter-by-letter continuous wave animation
    let waveTl = null;
    let observer = null;

    const isMobile = window.innerWidth < 768;
    const yDist = isMobile ? -8 : -14;
    const xDist = isMobile ? 1.5 : 2.5;
    const rot = isMobile ? 1.0 : 1.8;

    waveTl = gsap.timeline({ repeat: -1 });

    letterRefs.current.forEach((el, index) => {
      if (!el) return;
      const start = index * 0.13;
      waveTl
        .to(
          el,
          {
            y: yDist,
            x: xDist,
            rotation: -rot,
            scale: 1.025,
            duration: 0.48,
            ease: "sine.out",
          },
          start
        )
        .to(
          el,
          {
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.48,
            ease: "sine.inOut",
          },
          start + 0.48
        );
    });

    // Pause animation when out of viewport for efficiency
    if (containerRef.current && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            waveTl?.play();
          } else {
            waveTl?.pause();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(revealTimer);
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (waveTl) waveTl.kill();
      if (observer) observer.disconnect();
    };
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[calc(100svh-4.5rem)] lg:min-h-0 lg:h-[calc(100vh-4.75rem)] max-h-[1080px] w-full flex flex-col justify-between overflow-hidden bg-obsidian text-softwhite select-none pt-1 sm:pt-2 lg:pt-2"
      aria-label="Hero — Md Ali Azgor"
    >
      {/* ── LAYER 0: ATMOSPHERIC LIGHTING & FILM TEXTURE ── */}
      {/* Centered warm rim-light glow positioned right behind the portrait */}
      <div
        ref={glowRef}
        className="absolute top-[16%] lg:top-[14%] left-1/2 -translate-x-1/2 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] rounded-full pointer-events-none -z-10 blur-[120px] opacity-45 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(244,106,69,0.35) 0%, rgba(212,78,40,0.18) 42%, rgba(118,35,22,0.08) 65%, transparent 80%)",
        }}
      />

      {/* Atmospheric vignette */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 50% 45%, transparent 50%, rgba(8,9,11,0.8) 100%)",
        }}
      />

      {/* Subtle scanline and noise texture */}
      <div
        className="absolute inset-0 scanline-grid opacity-15 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, black 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, black 85%)",
        }}
      />
      <div className="absolute inset-0 noise-bg opacity-25 pointer-events-none" />

      {/* Architectural vertical grid guide lines */}
      <div className="absolute inset-0 max-w-[1480px] mx-auto px-6 md:px-12 pointer-events-none hidden lg:flex justify-between">
        <div className="w-px h-full bg-white/[0.025]" />
        <div className="w-px h-full bg-white/[0.025]" />
        <div className="w-px h-full bg-white/[0.025]" />
        <div className="w-px h-full bg-white/[0.025]" />
      </div>

      {/* ── LAYER 1: MONUMENTAL "PORTFOLIO" BACKDROP TYPOGRAPHY ── */}
      {/* Centered across the middle background, framing behind the portrait silhouette */}
      <div
        ref={textBgRef}
        className="absolute inset-x-0 top-[6%] sm:top-[7%] lg:top-[8%] pointer-events-none z-10 w-full overflow-hidden flex justify-center items-center will-change-transform"
      >
        <div
          role="text"
          aria-label="PORTFOLIO"
          className="flex items-center justify-center select-none"
        >
          {LETTERS.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="inline-block font-monument font-black uppercase will-change-transform"
              style={{
                fontSize: "clamp(3.2rem, 11.5vw, 13.5rem)",
                marginRight: i === LETTERS.length - 1 ? 0 : "0.06em",
                background:
                  "linear-gradient(135deg, #FF7748 0%, #F46A45 30%, #E65A32 55%, #762316 100%)",
                backgroundSize: "220% 220%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 15px 45px rgba(244,106,69,0.25))",
                transformOrigin: "50% 100%",
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.04}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.04}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ── LAYER 2 & 3: CENTERED PORTRAIT EDITORIAL COMPOSITION ── */}
      <div className="relative z-20 flex-1 max-w-[1480px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center lg:items-end justify-between pb-2 lg:pb-0">

        {/* === LEFT COLUMN: EDITORIAL IDENTITY & POSITIONING === */}
        <div
          ref={leftColRef}
          className={`w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-3.5 lg:gap-4 xl:gap-5 z-30 pt-3 lg:pt-0 lg:pb-8 xl:pb-10 text-left transition-all duration-700 ease-out delay-200 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Eyebrow & Name Heading */}
          <div className="flex flex-col">
            <span className="font-mono text-xs md:text-sm font-semibold text-[#FF7748] tracking-[0.25em] uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F46A45] animate-pulse" />
              <span>HELLO, I&apos;M</span>
            </span>
            <h1 className="font-display font-extrabold text-[clamp(2.3rem,3.8vw,4.2rem)] leading-[0.9] tracking-tight uppercase text-softwhite">
              MD ALI
              <br />
              <span className="text-softwhite">
                AZGOR<span className="text-[#F46A45]">.</span>
              </span>
            </h1>
          </div>

          {/* Professional Journey Progression */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#FF8662] font-semibold">
              // CREATIVE JOURNEY
            </span>
            <div className="inline-flex flex-wrap items-center gap-2 font-mono text-xs md:text-sm text-softwhite/90">
              <span className="font-semibold text-softwhite">GRAPHIC DESIGN</span>
              <span className="text-[#F46A45] font-bold">→</span>
              <span className="font-semibold text-softwhite">UI/UX DESIGN</span>
              <span className="text-[#F46A45] font-bold">→</span>
              <span className="font-semibold text-softwhite">WEB DEV</span>
            </div>
          </div>

          {/* Concise Positioning Manifesto */}
          <div>
            <p className="font-sans text-xs md:text-sm text-muted/90 leading-relaxed font-normal max-w-[340px]">
              Multidisciplinary creative crafting high-impact visual identities, digital products, and intelligent interactive web experiences.
            </p>
          </div>

          {/* Prominent CTAs — Side-by-Side Flex with High Contrast */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-1">
            {/* Primary Action */}
            <a
              href="#projects"
              onClick={scrollTo("projects")}
              data-cursor="explore"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#F46A45] text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-[#FF8662] shadow-[0_0_25px_rgba(244,106,69,0.35)] hover:shadow-[0_0_35px_rgba(244,106,69,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>

            {/* Secondary Action with High-Contrast Surface */}
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              data-cursor="contact"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-white/25 bg-white/[0.06] text-softwhite font-mono text-xs tracking-wider uppercase hover:border-[#F46A45]/70 hover:bg-white/[0.12] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>LET&apos;S CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-softwhite/80 group-hover:text-[#FF7748] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>

        {/* === CENTER COLUMN: ICONIC COMMANDING PORTRAIT (LAYER 4) === */}
        <div
          ref={portraitRef}
          className={`relative z-20 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[580px] flex justify-center self-center lg:self-end mt-1 lg:mt-0 will-change-transform transition-all duration-1000 ease-out delay-150 ${
            revealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
          }`}
        >
          {/* Portrait Container with Bottom Fade Mask */}
          <div
            className="relative w-full flex items-end justify-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 72%, transparent 98%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 72%, transparent 98%)",
            }}
          >
            <Image
              src="/images/ali Suit Portrait Cutout.png"
              alt="Md Ali Azgor — Creative Developer and UI/UX Designer in tailored black suit and glasses"
              width={1025}
              height={1320}
              priority
              quality={90}
              className="w-auto h-auto max-h-[46vh] sm:max-h-[52vh] md:max-h-[58vh] lg:max-h-[64vh] xl:max-h-[72vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.92)]"
            />
          </div>
        </div>

        {/* === RIGHT COLUMN: EDITORIAL CREATIVE MATRIX === */}
        <div
          ref={rightColRef}
          className={`w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-3.5 lg:gap-4 xl:gap-5 z-30 pt-3 lg:pt-0 lg:pb-8 xl:pb-10 text-left lg:text-right lg:items-end justify-center transition-all duration-700 ease-out delay-300 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Section Tag */}
          <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-semibold text-[#FF7748] tracking-[0.25em] uppercase">
            <span>// 02 · CREATIVE MATRIX</span>
          </div>

          {/* Core Pillars Typography */}
          <div className="flex flex-col gap-1 lg:items-end">
            <span className="font-display font-bold text-lg md:text-xl xl:text-2xl tracking-wider text-softwhite uppercase">
              CREATIVE THINKER.
            </span>
            <span className="font-display font-bold text-lg md:text-xl xl:text-2xl tracking-wider text-[#FF7748] uppercase">
              DESIGNER.
            </span>
            <span className="font-display font-bold text-lg md:text-xl xl:text-2xl tracking-wider text-softwhite uppercase">
              DEVELOPER.
            </span>
          </div>

          {/* Editorial statement */}
          <p className="font-sans text-xs md:text-sm text-muted/90 leading-relaxed font-normal max-w-[320px]">
            Based in Chittagong, Bangladesh. Transforming complex problems into memorable, high-impact digital realities with artistic vision and engineering rigor.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.05] text-xs font-mono text-softwhite/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR COMMISSIONS</span>
          </div>
        </div>
      </div>

      {/* ── LAYER 5: BOTTOM STATUS & SCROLL INDICATOR ── */}
      <div className="relative z-30 px-6 md:px-12 py-3 border-t border-white/[0.06] bg-obsidian/50 backdrop-blur-md">
        <div className="max-w-[1480px] mx-auto w-full flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted/60 uppercase">
          
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-white/40">[ 01 // OVERVIEW ]</span>
            <span>·</span>
            <span>IIUC CSE STUDENT</span>
          </div>

          <a
            href="#statement"
            onClick={scrollTo("statement")}
            className="flex items-center gap-2 text-muted/70 hover:text-[#FF7748] transition-colors duration-200 group mx-auto sm:mx-0"
            aria-label="Scroll to explore next section"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
          </a>

          <div className="hidden md:flex items-center gap-2 text-muted/50">
            <span>{personalInfo.coordinates}</span>
            <span>·</span>
            <span>CHITTAGONG, BANGLADESH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
