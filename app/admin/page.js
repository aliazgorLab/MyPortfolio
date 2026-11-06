import Link from "next/link";
import { getDashboardStatsAction } from "@/lib/actions/dashboard";
import {
  FolderGit2,
  Palette,
  Briefcase,
  Sparkles,
  Award,
  Trophy,
  Image as ImageIcon,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const statsRes = await getDashboardStatsAction();
  const stats = statsRes.data?.stats || {
    projects: { total: 0, published: 0, drafts: 0 },
    artworks: 0,
    experiences: 0,
    skills: 0,
    certifications: 0,
    achievements: 0,
    mediaAssets: 0,
  };
  const recentProjects = statsRes.data?.recentProjects || [];

  const CARDS = [
    {
      title: "PROJECTS",
      primary: stats.projects.total,
      secondary: `${stats.projects.published} Published · ${stats.projects.drafts} Drafts`,
      href: "/admin/projects",
      icon: FolderGit2,
    },
    {
      title: "ARTWORKS",
      primary: stats.artworks,
      secondary: "Curated Visual Designs",
      href: "/admin/artworks",
      icon: Palette,
    },
    {
      title: "EXPERIENCES",
      primary: stats.experiences,
      secondary: "Leadership & Roles",
      href: "/admin/experiences",
      icon: Briefcase,
    },
    {
      title: "SKILLS",
      primary: stats.skills,
      secondary: "Categorized Matrix",
      href: "/admin/skills",
      icon: Sparkles,
    },
    {
      title: "CERTIFICATIONS",
      primary: stats.certifications,
      secondary: "Verified Credentials",
      href: "/admin/certifications",
      icon: Award,
    },
    {
      title: "MEDIA ASSETS",
      primary: stats.mediaAssets,
      secondary: "Dual-Bucket Storage",
      href: "/admin/media",
      icon: ImageIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-2">
            <span>TERMINAL // 01</span>
            <span>·</span>
            <span>OPERATIONAL METRICS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-softwhite">
            PORTFOLIO OVERVIEW
          </h1>
          <p className="font-sans text-muted/80 text-sm mt-1">
            Dynamic CMS control center for projects, media assets, and site content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>NEW PROJECT</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-surface-100 text-xs font-mono tracking-wider uppercase text-softwhite hover:border-lavender/40 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-lavender" />
            <span>UPLOAD MEDIA</span>
          </Link>
        </div>
      </div>

      {/* Grid of Statistical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="p-6 rounded-2xl border border-white/10 bg-surface-100/50 backdrop-blur-md hover:border-lavender/40 hover:bg-surface-100/80 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                  {card.title}
                </span>
                <div className="p-2 rounded-lg bg-surface-200 border border-white/5 text-lavender group-hover:border-lavender/30 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-softwhite tracking-tight">
                  {card.primary}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-mono text-muted/80">
                  <span>{card.secondary}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-lavender group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Projects Table & Activity */}
      <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-lg font-bold text-softwhite">
              RECENTLY UPDATED PROJECTS
            </h2>
            <p className="font-sans text-xs text-muted/70 mt-0.5">
              Current status of indexed portfolio case studies
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-mono text-lavender hover:underline tracking-wider uppercase"
          >
            VIEW ALL →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="py-12 text-center text-muted font-mono text-xs">
            No projects found. Create your first project or run migrations.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="py-4 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-lavender/60 group-hover:bg-lavender transition-colors" />
                  <div>
                    <span className="font-sans text-sm font-medium text-softwhite group-hover:text-lavender transition-colors block">
                      {p.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      Updated {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase ${
                      p.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {p.status === "published" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{p.status}</span>
                  </span>

                  <Link
                    href={`/admin/projects`}
                    className="p-1.5 rounded-lg border border-white/5 bg-surface-200/50 text-muted hover:text-softwhite hover:border-white/20 transition-all"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

