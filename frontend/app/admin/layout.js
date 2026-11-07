import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserAction, logoutAction } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  FolderGit2,
  Palette,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Trophy,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — Md Ali Azgor",
  robots: {
    index: false,
    follow: false,
  },
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Artworks", href: "/admin/artworks", icon: Palette },
  { label: "Experience", href: "/admin/experiences", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Skills", href: "/admin/skills", icon: Sparkles },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Achievements", href: "/admin/achievements", icon: Trophy },
  { label: "Media Assets", href: "/admin/media", icon: ImageIcon },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({ children }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // If on login route, render bare children without sidebar or access checks
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  // Server-side strict authorization enforcement for all /admin routes
  const userRes = await getCurrentUserAction();
  if (!userRes.success || userRes.data?.profile?.role !== "admin") {
    redirect("/admin/login");
  }

  const profile = userRes.data?.profile;

  return (
    <div className="min-h-screen bg-obsidian text-softwhite flex noise-bg">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-white/10 bg-surface-100/50 backdrop-blur-2xl flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lavender/10 border border-lavender/30 flex items-center justify-center text-lavender shadow-[0_0_15px_rgba(199,184,255,0.2)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">
                ALI AZGOR
              </div>
              <div className="font-mono text-[9px] text-lavender tracking-widest uppercase">
                CMS CONTROL
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs text-muted hover:text-softwhite hover:bg-surface-200/80 transition-all group"
                >
                  <Icon className="w-4 h-4 text-muted group-hover:text-lavender transition-colors" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="px-3 py-2 rounded-xl bg-surface-200/60 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-lavender/20 border border-lavender/30 flex items-center justify-center text-xs font-mono font-bold text-lavender">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <div className="font-sans text-xs font-medium truncate">
                {profile?.full_name || "Administrator"}
              </div>
              <div className="font-mono text-[9px] text-muted truncate">
                {profile?.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-surface-200/40 text-[11px] font-mono text-muted hover:text-softwhite hover:border-lavender/30 transition-all"
            >
              <span>VIEW SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <form action={logoutAction} className="shrink-0">
              <button
                type="submit"
                title="Sign out of Admin Dashboard"
                className="p-2 rounded-lg border border-white/10 bg-surface-200/40 text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Mobile / Tablet */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between md:hidden bg-surface-100/60 backdrop-blur-xl">
          <div className="font-display font-bold text-sm tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-lavender" />
            <span>PORTFOLIO CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs font-mono text-muted hover:text-lavender transition-colors"
            >
              VISIT SITE →
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign out"
                className="p-1.5 rounded-lg border border-white/10 bg-surface-200/40 text-muted hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
