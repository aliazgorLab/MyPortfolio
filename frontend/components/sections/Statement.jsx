"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Statement() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 50%",
          scrub: 1,
        },
        opacity: 0.3,
        y: 40,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={containerRef}
      className="relative py-28 md:py-36 px-6 bg-charcoal/60 border-y border-white/5 noise-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Index & Category */}
        <div className="flex items-center justify-between text-xs font-mono text-muted uppercase tracking-widest mb-12">
          <div className="flex items-center gap-2">
            <span className="text-lavender">02 //</span>
            <span>INTENTION & PERSPECTIVE</span>
          </div>
          <span className="hidden sm:inline">FUTURE / FORM</span>
        </div>

        {/* Editorial Statement Heading */}
        <div ref={textRef} className="max-w-5xl">
          <p className="font-editorial-statement text-softwhite mb-8">
            GOOD DIGITAL EXPERIENCES ARE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender via-mist to-softwhite underline decoration-lavender/40 decoration-1 underline-offset-8">
              DESIGNED WITH INTENTION
            </span>
            .
          </p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-white/10">
            <div className="md:col-span-4 font-mono text-xs text-lavender tracking-widest uppercase">
              // DESIGN PHILOSOPHY
            </div>
            <div className="md:col-span-8 font-sans text-muted/90 text-base md:text-lg leading-relaxed">
              Bridging conceptual visual discipline with robust frontend engineering. Every interaction, typographic hierarchy, and micro-transition is calibrated to serve human clarity, responsiveness, and performance.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
