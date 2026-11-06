"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Palette, Code2, ShieldCheck, Rocket } from "lucide-react";

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
  rotation: string;
  pin: {
    color: string;
    shadow: string;
  };
  cardGradient: string;
}

const STEPS: StepItem[] = [
  {
    id: "step-1",
    stepNumber: "01",
    tag: "DISCOVERY",
    title: "Proposal & Architecture",
    description:
      "Detailed technical proposal, system architecture diagrams, database schema mapping, and timeline estimation.",
    icon: <Compass className="h-4 w-4" />,
    rotation: "rotate-[12deg] hover:rotate-0",
    pin: {
      color: "bg-blue-500",
      shadow: "shadow-[0_8px_20px_rgba(59,130,246,0.6)]",
    },
    cardGradient: "from-blue-500/10 via-transparent to-amber-500/10",
  },
  {
    id: "step-2",
    stepNumber: "02",
    tag: "DESIGN CONCEPT",
    title: "UI/UX & Design Tokens",
    description:
      "Modern, responsive layouts designed in Figma with obsessive focus on micro-interactions, accessibility, and typography.",
    icon: <Palette className="h-4 w-4" />,
    rotation: "-rotate-[13deg] hover:rotate-0",
    pin: {
      color: "bg-purple-500",
      shadow: "shadow-[0_8px_20px_rgba(168,85,247,0.6)]",
    },
    cardGradient: "from-purple-500/10 via-transparent to-pink-500/10",
  },
  {
    id: "step-3",
    stepNumber: "03",
    tag: "ENGINEERING",
    title: "Full-Stack Development",
    description:
      "Scalable Next.js, React, and TypeScript implementation with clean API contracts, modular state, and zero technical debt.",
    icon: <Code2 className="h-4 w-4" />,
    rotation: "rotate-[11deg] hover:rotate-0",
    pin: {
      color: "bg-cyan-500",
      shadow: "shadow-[0_8px_20px_rgba(6,182,212,0.6)]",
    },
    cardGradient: "from-cyan-500/10 via-transparent to-blue-500/10",
  },
  {
    id: "step-4",
    stepNumber: "04",
    tag: "OPTIMIZATION",
    title: "Security & Performance",
    description:
      "Sub-second TTFB, Lighthouse 100 audits, zero layout shifts (CLS), WCAG accessibility compliance, and stress testing.",
    icon: <ShieldCheck className="h-4 w-4" />,
    rotation: "-rotate-[14deg] hover:rotate-0",
    pin: {
      color: "bg-emerald-500",
      shadow: "shadow-[0_8px_20px_rgba(16,185,129,0.6)]",
    },
    cardGradient: "from-emerald-500/10 via-transparent to-teal-500/10",
  },
  {
    id: "step-5",
    stepNumber: "05",
    tag: "DEPLOYMENT",
    title: "Edge Launch & CI/CD",
    description:
      "Zero-downtime automated edge deployments on Vercel, DNS and SSL configuration, telemetry, and client handover.",
    icon: <Rocket className="h-4 w-4" />,
    rotation: "rotate-[10deg] hover:rotate-0",
    pin: {
      color: "bg-amber-500",
      shadow: "shadow-[0_8px_20px_rgba(245,158,11,0.6)]",
    },
    cardGradient: "from-amber-500/10 via-transparent to-orange-500/10",
  },
];

export function ProjectProcess() {
  return (
    <section id="process" className="relative w-full overflow-hidden py-28 sm:py-36 border-t border-white/5 bg-obsidian noise-bg">
      {/* Subtle Lined Notebook Background Texture */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "100% 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            Methodology & Workflow
          </span>
          <h2 className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-5xl">
            Our Process, Step by Step
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            A battle-tested execution pipeline from napkin concept to production release.
          </p>
        </div>

        {/* Winding Cards Canvas */}
        <div className="relative mt-20 sm:mt-28">
          {/* ========================================================== */}
          {/* ARMORED SVG CURVED DASHED LINE (Arcs across cards)         */}
          {/* ========================================================== */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            <svg
              className="h-full w-full stroke-neutral-700/80"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 1600"
            >
              {/* Fluid Bezier curves looping over and between step positions */}
              <path
                d="M 680 120 
                   C 450 -20, 250 80, 320 380 
                   C 380 620, 780 480, 680 820 
                   C 580 1120, 240 980, 320 1240 
                   C 380 1440, 720 1380, 660 1560"
                strokeDasharray="10 12"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Cards Stack */}
          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((item, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={item.id}
                  className={`relative flex w-full justify-center ${
                    isEven ? "md:justify-start md:pl-16 lg:pl-24" : "md:justify-end md:pr-16 lg:pr-24"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 120, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className={`group relative w-72 sm:w-80 min-h-[340px] rounded-[30px] border border-neutral-800/90 bg-neutral-950/90 p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out cursor-grab active:cursor-grabbing hover:scale-105 hover:z-30 hover:border-neutral-700 ${item.rotation}`}
                  >
                    {/* Inner Ambient Gradient Wash */}
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-b ${item.cardGradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    {/* 3D Skeuomorphic Push Pin */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                      <div className="relative">
                        {/* Pin Head */}
                        <div
                          className={`h-7 w-7 rounded-full border-2 border-white/80 ${item.pin.color} ${item.pin.shadow} transition-transform duration-300 group-hover:scale-125`}
                        >
                          {/* Top Gloss Highlight */}
                          <div className="absolute top-1 left-1.5 h-2 w-2 rounded-full bg-white/70 blur-[0.5px]" />
                        </div>
                        {/* Shadow cast on card */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-5 rounded-full bg-black/60 blur-sm" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 flex flex-col justify-between h-full pt-3">
                      <div>
                        {/* Step Number & Tag */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-3xl font-black italic tracking-tighter text-neutral-200">
                            {item.stepNumber}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                            {item.icon}
                            {item.tag}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 font-mono text-xl font-bold tracking-tight text-white group-hover:text-neutral-100">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm leading-relaxed text-neutral-400 font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="mt-6 flex items-center justify-between border-t border-neutral-900 pt-3 text-[11px] font-mono text-neutral-500">
                        <span>Phase {item.stepNumber}</span>
                        <span className="text-neutral-400 group-hover:text-white transition-colors">
                          Complete &rarr;
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectProcess;
