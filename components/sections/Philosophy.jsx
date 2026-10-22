"use client";

import { principles } from "@/data/portfolioData";

export default function Philosophy() {
  return (
    <section className="py-28 md:py-36 px-6 bg-obsidian relative border-t border-white/5 noise-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-4">
          <span>07 //</span>
          <span>WORKING PRINCIPLES</span>
        </div>

        <div className="max-w-4xl mb-20">
          <h2 className="font-display-heading text-softwhite tracking-tight">
            THE DETAILS ARE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-softwhite via-mist to-lavender">
              THE EXPERIENCE.
            </span>
          </h2>
          <p className="font-sans text-muted/90 text-lg sm:text-xl mt-4 max-w-2xl">
            A design manifesto guiding every wireframe, component token, and line of frontend code.
          </p>
        </div>

        {/* Manifesto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {principles.map((p) => (
            <div
              key={p.number}
              className="relative p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-md flex flex-col justify-between group hover:border-lavender/40 hover:bg-surface-100/70 transition-all duration-300"
            >
              <div>
                <span className="font-mono text-3xl font-bold text-lavender/60 group-hover:text-lavender transition-colors block mb-6">
                  {p.number}
                </span>

                <h3 className="font-display text-2xl font-bold text-softwhite tracking-tight mb-3">
                  {p.title}
                </h3>

                <h4 className="font-sans text-base text-softwhite/90 font-medium leading-snug mb-4">
                  {p.subtitle}
                </h4>

                <p className="font-sans text-sm text-muted/80 leading-relaxed">
                  {p.detail}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[10px] text-muted/50 uppercase tracking-widest">
                CORE PRINCIPLE // AZGOR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
