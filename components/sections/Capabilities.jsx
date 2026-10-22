"use client";

import { capabilities } from "@/data/portfolioData";
import { Sparkles, Terminal, Code2, Cpu, Wrench } from "lucide-react";

const CATEGORY_ICONS = {
  DESIGN: Sparkles,
  FRONTEND: Code2,
  "BACKEND & SYSTEMS": Terminal,
  "AI & EXPERIMENTATION": Cpu,
  EXPLORING: Wrench,
};

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-28 md:py-36 px-6 bg-charcoal/30 relative border-t border-white/5 noise-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-3">
              <span>06 //</span>
              <span>TECHNICAL CAPABILITY</span>
            </div>
            <h2 className="font-display-heading text-softwhite">
              SKILLS & CAPABILITIES
            </h2>
            <p className="font-sans text-muted/80 text-base md:text-lg mt-2">
              Disciplinary competencies and technical tools.
            </p>
          </div>
          <div className="font-mono text-xs text-muted/60 uppercase">
            TYPOGRAPHIC CAPABILITY MATRIX // 01 — 05
          </div>
        </div>

        {/* Structured Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category] || Sparkles;
            return (
              <div
                key={cat.category}
                className="group relative p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-md hover:border-lavender/40 hover:bg-surface-100/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Top Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-surface-200 text-lavender border border-white/5 group-hover:border-lavender/30 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs text-muted uppercase tracking-widest">
                        {cat.index} //
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted/60 uppercase">
                      {cat.skills.length} ITEMS
                    </span>
                  </div>

                  {/* Category Title */}
                  <h3 className="font-display text-xl font-bold text-softwhite uppercase tracking-tight mb-6 group-hover:text-lavender transition-colors">
                    {cat.category}
                  </h3>

                  {/* Skills List */}
                  <ul className="flex flex-col gap-3">
                    {cat.skills.map((skill, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-sm font-sans text-muted/90 group/item hover:text-softwhite transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-lavender transition-colors" />
                          <span>{skill}</span>
                        </span>
                        <span className="font-mono text-[10px] text-muted/40 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          0{i + 1}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[10px] text-muted/50 uppercase tracking-widest flex justify-between items-center">
                  <span>DISCIPLINE VERIFIED</span>
                  <span className="text-lavender/70">PROVEN IN CODE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
