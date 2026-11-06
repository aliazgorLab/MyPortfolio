import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 text-center text-softwhite noise-bg">
      <div className="font-mono text-xs text-lavender tracking-widest uppercase mb-4">
        ERROR // 404_PAGE_NOT_FOUND
      </div>
      <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-tighter mb-4">
        VOID.
      </h1>
      <p className="font-sans text-muted/80 max-w-md text-base mb-8">
        The coordinate or asset you requested has been unmapped or decommissioned.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO BASE</span>
      </Link>
    </div>
  );
}
