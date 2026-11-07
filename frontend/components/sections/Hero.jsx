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
  const [revealed, setRevealed] = useState(true);
  const rafRef = useRef(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced.current) return;

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
        curX += (targetX - curX) * 0.06;
        curY += (targetY - curY) * 0.06;
      }

      // Continuous subtle harmonic breathing & floating motion
      const driftY = Math.sin(time * 0.0011) * 6;
      const driftX = Math.cos(time * 0.0007) * 3;

      if (textBgRef.current) {
        textBgRef.current.style.transform = `translate3d(${(curX * 14 + driftX).toFixed(2)}px, ${(curY * 7 + driftY).toFixed(2)}px, 0)`;
      }
      if (portraitRef.current) {
        const portraitDriftY = Math.sin(time * 0.0009 + 0.8) * -2.5;
        portraitRef.current.style.transform = `translate3d(${(curX * -8).toFixed(2)}px, ${(curY * -4 + portraitDriftY).toFixed(2)}px, 0)`;
      }
      if (glowRef.current) {
        const glowScale = 1 + Math.sin(time * 0.0006) * 0.035;
        glowRef.current.style.transform = `translate3d(${(curX * 16).toFixed(2)}px, ${(curY * 10).toFixed(2)}px, 0) scale(${glowScale.toFixed(3)})`;
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

    if (!prefersReduced.current) {
      const isMobile = window.innerWidth < 768;
      const yDist = isMobile ? -10 : -18;
      const xDist = isMobile ? 2 : 3.5;
      const rot = isMobile ? 1.5 : 2.5;

      waveTl = gsap.timeline({ repeat: -1 });

      letterRefs.current.forEach((el, index) => {
        if (!el) return;
        const start = index * 0.14;
        waveTl
          .to(
            el,
            {
              y: yDist,
              x: xDist,
              rotation: -rot,
              scale: 1.025,
              duration: 0.45,
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
              duration: 0.45,
              ease: "sine.inOut",
            },
            start + 0.45
          );
      });

      // Pause when out of viewport for optimal performance
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
    }

    return () => {
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

  const anim = (delayClass = "delay-100") =>
    `transition-all duration-700 ease-out ${delayClass} ${
      revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[calc(100svh-5rem)] w-full flex flex-col justify-between overflow-hidden bg-obsidian text-softwhite select-none pt-8 sm:pt-9 lg:pt-10"
      aria-label="Hero — Md Ali Azgor"
    >
      {/* ── LAYER 0: ATMOSPHERIC LIGHTING & FILM TEXTURE ── */}
      <div
        ref={glowRef}
        className="absolute top-[16%] lg:top-[14%] right-[5%] lg:right-[15%] w-[450px] h-[450px] lg:w-[650px] lg:h-[650px] rounded-full pointer-events-none -z-10 blur-[130px] opacity-40 transition-opacity duration-1000 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(230,90,50,0.38) 0%, rgba(118,35,22,0.2) 45%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 30%, rgba(8,9,11,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0 scanline-grid opacity-20 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, black 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, black 85%)",
        }}
      />
      <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />

      {/* Subtle architectural vertical grid accents */}
      <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 md:px-12 pointer-events-none hidden lg:flex justify-between">
        <div className="w-px h-full bg-white/[0.03]" />
        <div className="w-px h-full bg-white/[0.03]" />
        <div className="w-px h-full bg-white/[0.03]" />
      </div>

      {/* ── LAYER 1: MONUMENTAL "PORTFOLIO" BACKGROUND TYPOGRAPHY ── */}
      <div
        ref={textBgRef}
        className="absolute inset-x-0 top-[7%] sm:top-[8%] lg:top-[9%] pointer-events-none z-10 w-full overflow-hidden flex justify-center items-center will-change-transform"
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
              className="inline-block font-monument font-black uppercase will-change-transform animate-portfolio-shimmer"
              style={{
                fontSize: "clamp(3.2rem, 11.2vw, 13.5rem)",
                marginRight: i === LETTERS.length - 1 ? 0 : "0.08em",
                background:
                  "linear-gradient(135deg, #FF7A50 0%, #E65A32 28%, #FF8A65 48%, #E65A32 68%, #762316 100%)",
                backgroundSize: "220% 220%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 15px 40px rgba(230,90,50,0.22))",
                transformOrigin: "50% 100%",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ── LAYER 2 & 3: MAIN EDITORIAL & PORTRAIT COMPOSITION ── */}
      <div className="relative z-20 flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center lg:items-end justify-between pb-6 lg:pb-0">
        
        {/* === LEFT COLUMN: EDITORIAL IDENTITY & POSITIONING === */}
        <div className="w-full lg:max-w-[580px] flex flex-col gap-5 lg:gap-6 z-30 pt-0 lg:pb-10 text-left">
          
          {/* Eyebrow & Name Heading */}
          <div className={`flex flex-col ${anim("delay-100")}`}>
            <span className="font-mono text-xs md:text-sm font-semibold text-[#FF7A50] tracking-[0.25em] uppercase mb-1.5 flex items-center gap-2">
              <span>// 01 · HELLO, I&apos;M</span>
            </span>
            <h1 className="font-display font-extrabold text-[clamp(2.75rem,6.2vw,5.5rem)] leading-[0.88] tracking-tight uppercase text-softwhite">
              MD ALI
              <br />
              <span className="text-softwhite">
                AZGOR<span className="text-[#E65A32]">.</span>
              </span>
            </h1>
          </div>

          {/* Professional Disciplines */}
          <div className={anim("delay-200")}>
            <div className="inline-flex flex-wrap items-center gap-2 text-xs md:text-sm font-mono tracking-wider text-muted">
              <span className="text-softwhite font-medium">CREATIVE DEVELOPER</span>
              <span className="text-white/20">/</span>
              <span className="text-[#FF7A50] font-medium">UI/UX DESIGNER</span>
              <span className="text-white/20">/</span>
              <span className="text-softwhite font-medium">ENGINEERING STUDENT</span>
            </div>
          </div>

          {/* Concise Positioning Manifesto */}
          <div className={anim("delay-300")}>
            <p className="font-sans text-sm md:text-base text-muted/90 leading-relaxed font-normal max-w-[500px]">
              Designing meaningful digital experiences where creativity meets
              technology. Specializing in high-performance web systems, precision
              interaction design, and intelligent interfaces.
            </p>
          </div>

          {/* Prominent CTAs */}
          <div className={`flex flex-wrap items-center gap-4 pt-1 ${anim("delay-400")}`}>
            {/* Primary Action */}
            <a
              href="#projects"
              onClick={scrollTo("projects")}
              data-cursor="explore"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#E65A32] text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-[#F06A3F] shadow-[0_0_25px_rgba(230,90,50,0.35)] hover:shadow-[0_0_35px_rgba(230,90,50,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>

            {/* Secondary Action */}
            <a
              href="#contact"
              onClick={scrollTo("contact")}
              data-cursor="contact"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-softwhite font-mono text-xs tracking-wider uppercase hover:border-[#E65A32]/60 hover:text-white hover:bg-white/[0.04] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>LET&apos;S CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-[#FF7A50] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Location Coordinates Micro-Data */}
          <div className={`pt-1 hidden sm:flex items-center gap-4 font-mono text-[10px] text-muted/50 tracking-widest uppercase ${anim("delay-500")}`}>
            <span>{personalInfo.coordinates}</span>
            <span>·</span>
            <span>CHITTAGONG, BANGLADESH</span>
          </div>
        </div>

        {/* === RIGHT COLUMN: CENTRAL PORTRAIT FOREGROUND (LAYER 4) === */}
        <div
          ref={portraitRef}
          className={`relative z-20 w-full max-w-[420px] md:max-w-[500px] lg:max-w-[620px] xl:max-w-[680px] flex justify-center lg:justify-end self-center lg:self-end mt-4 lg:mt-0 will-change-transform ${anim(
            "delay-200"
          )}`}
        >
          {/* Portrait Container with Bottom Fade Mask */}
          <div
            className="relative w-full flex items-end justify-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 82%, transparent 99%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 82%, transparent 99%)",
            }}
          >
            <Image
              src="/images/ali Suit Portrait Cutout.png"
              alt="Md Ali Azgor — Creative Developer and UI/UX Designer in tailored black suit and glasses"
              width={1025}
              height={1320}
              priority
              quality={90}
              className="w-auto h-auto max-h-[56vh] sm:max-h-[62vh] lg:max-h-[78vh] xl:max-h-[82vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      </div>

      {/* ── LAYER 5: BOTTOM STATUS & SCROLL INDICATOR ── */}
      <div className="relative z-30 px-6 md:px-12 py-4 border-t border-white/[0.06] bg-obsidian/40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted/60 uppercase">
          
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-white/40">[ 01 // OVERVIEW ]</span>
            <span>·</span>
            <span>IIUC CSE STUDENT</span>
          </div>

          <a
            href="#statement"
            onClick={scrollTo("statement")}
            className="flex items-center gap-2 text-muted/70 hover:text-[#FF7A50] transition-colors duration-200 group mx-auto sm:mx-0"
            aria-label="Scroll to explore next section"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-200" />
          </a>

          <div className="hidden md:flex items-center gap-2 text-muted/50">
            <span>EXPERIMENTAL PORTFOLIO</span>
            <span>//</span>
            <span>v2.6</span>
          </div>
        </div>
      </div>
    </section>
  );
}
