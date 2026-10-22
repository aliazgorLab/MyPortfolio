import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolioData";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }) {
  const project = projects.find((p) => p.id === params.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Md Ali Azgor`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-obsidian text-softwhite pt-32 pb-24 px-6 noise-bg">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-lavender tracking-widest uppercase transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SELECTED WORK</span>
        </Link>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-lavender tracking-widest uppercase mb-3">
            <span>PROJECT // {project.number}</span>
            <span>·</span>
            <span>{project.category}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="font-sans text-xl text-muted/90 max-w-3xl leading-relaxed">
            {project.tagline} — {project.description}
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-surface-200 mb-16 shadow-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover object-top"
          />
        </div>

        {/* Narrative & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div>
              <h2 className="font-mono text-xs text-lavender tracking-widest uppercase mb-4">
                // SYSTEM ARCHITECTURE & CHALLENGE
              </h2>
              <p className="font-sans text-muted/90 text-base sm:text-lg leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {project.features && (
              <div>
                <h2 className="font-mono text-xs text-lavender tracking-widest uppercase mb-4">
                  // CORE IMPLEMENTATIONS
                </h2>
                <ul className="flex flex-col gap-3">
                  {project.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-sans text-base text-softwhite/90"
                    >
                      <CheckCircle2 className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-100/60 border border-white/5 flex flex-col gap-6">
            <div>
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-1">
                PRODUCTION METRIC
              </span>
              <span className="font-mono text-base text-softwhite font-medium">
                {project.metrics}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                TECH STACK
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-surface-200 text-softwhite border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-colors"
                >
                  <span>VISIT REPOSITORY / APP</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && project.githubUrl !== project.liveUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded border border-white/10 bg-surface-200 text-softwhite font-mono text-xs font-medium tracking-wider uppercase hover:border-lavender hover:text-lavender transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW SOURCE REPO</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Return Call */}
        <div className="pt-12 border-t border-white/10 flex justify-between items-center">
          <Link
            href="/#work"
            className="font-mono text-xs text-lavender tracking-wider uppercase hover:underline"
          >
            ← BROWSE ALL WORKS
          </Link>
          <a
            href="/#contact"
            className="font-mono text-xs text-softwhite tracking-wider uppercase hover:text-lavender"
          >
            CONTACT FOR COLLABORATION →
          </a>
        </div>
      </div>
    </main>
  );
}
