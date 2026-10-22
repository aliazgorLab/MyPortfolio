"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/portfolioData";
import ProjectModal from "@/components/ui/ProjectModal";
import { ArrowUpRight, ExternalLink, Eye, Layers } from "lucide-react";

export default function SelectedWork() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const categories = ["ALL", "PRODUCT & FRONTEND", "AI / FULL-STACK", "UI/UX & SYSTEMS"];

  const filteredProjects = projects.filter((p) => {
    if (filter === "ALL") return true;
    if (filter === "PRODUCT & FRONTEND")
      return p.category.includes("Product") || p.category.includes("Frontend");
    if (filter === "AI / FULL-STACK")
      return p.category.includes("AI") || p.category.includes("Full-Stack");
    if (filter === "UI/UX & SYSTEMS")
      return p.category.includes("UI/UX") || p.category.includes("Simulation");
    return true;
  });

  return (
    <section id="work" className="py-28 md:py-36 px-6 bg-obsidian relative noise-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-3">
              <span>03 //</span>
              <span>INDEXED WORKS</span>
            </div>
            <h2 className="font-display-heading text-softwhite">
              SELECTED WORK
            </h2>
            <p className="font-sans text-muted/80 text-base md:text-lg mt-2">
              Ideas, interfaces & things brought to life.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  filter === cat
                    ? "bg-lavender text-obsidian font-semibold shadow-[0_0_15px_rgba(199,184,255,0.3)]"
                    : "bg-surface-100/60 text-muted hover:text-softwhite border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Showcase Stream */}
        <div className="flex flex-col gap-16 md:gap-24">
          {filteredProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <article
                key={project.id}
                className="group relative rounded-2xl border border-white/10 bg-surface-100/30 backdrop-blur-md p-6 sm:p-8 md:p-10 transition-all duration-500 hover:border-lavender/40 hover:bg-surface-100/60"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Visual Media Column (7 cols) */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    data-cursor="inspect"
                    className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-200 border border-white/10 cursor-pointer lg:col-span-7 ${
                      isEven ? "" : "lg:col-start-6"
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                    {/* Quick view floating badge */}
                    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-softwhite group-hover:border-lavender/50 transition-colors">
                      <Eye className="w-3.5 h-3.5 text-lavender" />
                      <span>VIEW SPECS</span>
                    </div>

                    {/* Project Number badge on image */}
                    <div className="absolute top-4 left-4 z-10 font-mono text-xs font-bold text-lavender bg-obsidian/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                      {project.number}
                    </div>
                  </div>

                  {/* Information Column (5 cols) */}
                  <div
                    className={`flex flex-col justify-center lg:col-span-5 ${
                      isEven ? "" : "lg:col-start-1"
                    }`}
                  >
                    {/* Category & Year */}
                    <div className="flex items-center gap-3 text-xs font-mono text-muted uppercase tracking-widest mb-3">
                      <span className="text-lavender">{project.category}</span>
                      <span>·</span>
                      <span>{project.year}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-softwhite tracking-tight mb-4 group-hover:text-lavender transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Tagline & Description */}
                    <p className="font-sans text-muted/90 text-sm sm:text-base leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Metric or key feature highlight */}
                    <div className="p-3.5 rounded-lg bg-surface-200/50 border border-white/5 mb-6">
                      <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-1">
                        SIGNIFICANT ARCHITECTURE
                      </span>
                      <span className="font-mono text-xs text-softwhite font-medium">
                        {project.metrics}
                      </span>
                    </div>

                    {/* Technology Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded text-xs font-mono bg-surface-200 text-muted/90 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Affordance Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-softwhite text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-lavender transition-colors"
                      >
                        <span>EXPLORE CASE STUDY</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 p-2.5 rounded border border-white/10 text-muted hover:text-softwhite hover:border-lavender transition-colors"
                          title="Open Project Repository"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
