"use client";

import { experience } from "@/data/portfolioData";
import { Briefcase, Calendar, CheckCircle, AlertCircle } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-28 md:py-36 px-6 bg-obsidian relative border-t border-white/5 noise-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-3">
              <span>05 //</span>
              <span>PROFESSIONAL TIMELINE</span>
            </div>
            <h2 className="font-display-heading text-softwhite">
              EXPERIENCE
            </h2>
            <p className="font-sans text-muted/80 text-base md:text-lg mt-2">
              Roles, internships, and design leadership.
            </p>
          </div>
          <div className="font-mono text-xs text-muted/60 uppercase">
            CHRONOLOGICAL TRAJECTORY [2023 — PRESENT]
          </div>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l border-white/10 ml-4 md:ml-32 pl-8 md:pl-16 flex flex-col gap-12 md:gap-16">
          {experience.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker on the vertical rule */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-4 h-4 rounded-full border-2 border-obsidian bg-surface-200 group-hover:bg-lavender group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(199,184,255,0.4)]">
                {item.current && (
                  <span className="absolute inset-0 rounded-full bg-lavender animate-ping opacity-75" />
                )}
              </div>

              {/* Floating period date on desktop to the left */}
              <div className="hidden md:block absolute -left-48 top-1 font-mono text-xs text-muted group-hover:text-lavender transition-colors w-28 text-right">
                {item.period}
              </div>

              {/* Card Container */}
              <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-md hover:border-lavender/40 hover:bg-surface-100/70 transition-all duration-300">
                {/* Mobile Period Tag */}
                <div className="md:hidden flex items-center gap-2 font-mono text-xs text-lavender mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.period}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-softwhite group-hover:text-lavender transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-sm text-softwhite/90 font-medium">
                        {item.company}
                      </span>
                      <span className="text-muted/60">·</span>
                      <span className="font-mono text-xs text-muted">
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {item.current && (
                    <span className="self-start sm:self-auto px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CURRENT ROLE
                    </span>
                  )}
                </div>

                {/* Highlights */}
                <ul className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-white/5">
                  {item.points.map((pt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted/90 font-sans leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-lavender/60 shrink-0 mt-2" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Clear Transparency / Confirmation Note if flagged */}
                {item.note && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 font-mono text-[11px] text-muted/60">
                    <AlertCircle className="w-3.5 h-3.5 text-lavender/60 shrink-0" />
                    <span>{item.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
