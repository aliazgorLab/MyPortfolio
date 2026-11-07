import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass, Palette, Layout, Terminal, Film, Sparkles } from "lucide-react";
import { getPublicCreativeWorlds } from "@/lib/services/portfolio";
import { FALLBACK_WORLDS } from "@/lib/constants/universe";

export const metadata = {
  title: "The Creative Universe — Four Disciplines | Md Ali Azgor",
  description:
    "Step inside the interactive Creative Universe of Md Ali Azgor: Graphic Design, UI/UX Design, Web Development, and Video & Motion.",
};

const WORLD_VISUALS = {
  "graphic-design": {
    code: "WORLD 01",
    subtitle: "Brand Identity, Typography & Print",
    categories: ["Logo Design", "Brand Identity", "Poster Design", "Banner Design", "Social Media", "Print"],
    accent: "#F46A45",
    icon: Palette,
    bgGlow: "from-[#F46A45]/20 to-transparent",
    href: "/universe/graphic-design",
    cta: "ENTER ART EXHIBITION",
  },
  "ui-ux-design": {
    code: "WORLD 02",
    subtitle: "Digital Interfaces, Prototypes & Design Systems",
    categories: ["Website UI", "Mobile Apps", "Dashboards", "Design Systems", "Prototypes", "Case Studies"],
    accent: "#FF8662",
    icon: Layout,
    bgGlow: "from-[#FF8662]/20 to-transparent",
    href: "/universe/ui-ux-design",
    cta: "ENTER INTERFACE LAB",
  },
  "web-development": {
    code: "WORLD 03",
    subtitle: "Full-Stack Software, Interactive Systems & Tools",
    categories: ["Web Applications", "Full-Stack", "Frontend", "Tools & Utilities", "Interactive Web"],
    accent: "#E65A32",
    icon: Terminal,
    bgGlow: "from-[#E65A32]/20 to-transparent",
    href: "/universe/web-development",
    cta: "ENTER DIGITAL SYSTEMS",
  },
  "video-motion": {
    code: "WORLD 04",
    subtitle: "Motion Graphics, Kinetic Typography & Showreels",
    categories: ["Promotional Videos", "Motion Graphics", "Video Editing", "Reels", "Showreels"],
    accent: "#9B3825",
    icon: Film,
    bgGlow: "from-[#9B3825]/20 to-transparent",
    href: "/universe/video-motion",
    cta: "ENTER SCREENING ROOM",
  },
};

export default async function UniverseOverviewPage() {
  const worldsFromDb = await getPublicCreativeWorlds();
  const worlds = worldsFromDb.length > 0 ? worldsFromDb : FALLBACK_WORLDS;

  return (
    <main className="min-h-screen bg-obsidian text-softwhite noise-bg selection:bg-orange selection:text-obsidian flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-graphite/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono text-mist hover:text-white px-3 py-1.5 rounded-full border border-white/10 bg-charcoal hover:border-orange transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-orange">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="font-semibold tracking-widest">UNIVERSE ARCHITECTURE</span>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/15 border border-orange/30 text-orange text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE MULTIDISCIPLINARY PORTFOLIO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-softwhite tracking-tight uppercase max-w-4xl mx-auto leading-none mb-6">
            THE CREATIVE <span className="text-orange">UNIVERSE</span>
          </h1>

          <p className="text-mist text-base sm:text-lg md:text-xl font-sans max-w-2xl mx-auto leading-relaxed">
            Four disciplines. One continuous creative journey. Step through a portal below to explore individual works, checkpoints, and case studies.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* 4 World Entry Portals Grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {worlds.map((world, idx) => {
            const visual = WORLD_VISUALS[world.slug] || WORLD_VISUALS["graphic-design"];
            const Icon = visual.icon;

            return (
              <Link
                key={world.slug}
                href={visual.href}
                className="group relative rounded-2xl border border-white/10 bg-charcoal hover:border-orange/60 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange/10 hover:-translate-y-1"
              >
                {/* Background Ambient Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${visual.bgGlow} opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none`}
                />

                {/* Top Discipline Metadata */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-orange uppercase">
                      {visual.code}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-graphite border border-white/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-obsidian transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-softwhite group-hover:text-orange transition-colors mb-2">
                    {world.title}
                  </h2>
                  <p className="text-xs font-mono text-mist/70 mb-3 uppercase tracking-wider">
                    {visual.subtitle}
                  </p>
                  <p className="text-mist text-sm leading-relaxed font-sans">
                    {world.description}
                  </p>
                </div>

                {/* Middle: Checkpoint Categories Pill List */}
                <div className="relative z-10 my-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
                    CHECKPOINTS IN THIS WORLD:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {visual.categories.map((cat, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-100 text-mist group-hover:text-softwhite transition-colors"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Action CTA */}
                <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10 text-xs font-mono">
                  <span className="font-semibold text-softwhite group-hover:text-orange transition-colors flex items-center gap-2">
                    <span>{visual.cta}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-orange" />
                  </span>
                  <span className="text-mist/60 group-hover:text-mist">
                    STEP INSIDE →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-graphite/40 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div>
            <span className="text-orange">MD ALI AZGOR</span> // CREATIVE UNIVERSE PORTFOLIO
          </div>
          <Link
            href="/#work"
            className="text-mist hover:text-orange transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-orange" />
            <span>RETURN TO MAIN PORTFOLIO</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
