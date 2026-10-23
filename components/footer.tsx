"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Terminal, Clock } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

export function Footer() {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Displays formatted local time with UTC offset (Asia/Dhaka, GMT+6)
      const timeString = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setLocalTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-50 w-full border-t border-neutral-800/80 bg-neutral-950 text-neutral-300 subpixel-antialiased">
      {/* Top subtle glow line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-neutral-500/30 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Col 1: Identity & Research Profile */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold tracking-tight text-neutral-100 uppercase sm:text-lg">
                MD ALI AZGOR
              </span>
              <span className="rounded-full border border-neutral-800 bg-neutral-900/80 px-2 py-0.5 font-mono text-[11px] text-neutral-400">
                CSE &middot; Dev & Design
              </span>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-neutral-400 font-normal">
              Computer Science & Engineering student and Software Engineer focused on 
              high-performance web architecture, UI/UX systems, and autonomous cybersecurity simulations.
            </p>

            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Available for Research & Dev</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-neutral-400">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                <span suppressHydrationWarning>
                  {localTime ? `${localTime} (GMT+6)` : "Live Clock"}
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation & Engineering */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-neutral-100 uppercase">
              Index
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-neutral-400 transition hover:text-white" href="#projects">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link className="text-neutral-400 transition hover:text-white" href="#research">
                  Research & Thesis
                </Link>
              </li>
              <li>
                <Link className="text-neutral-400 transition hover:text-white" href="#experience">
                  Experience & Roles
                </Link>
              </li>
              <li>
                <Link className="text-neutral-400 transition hover:text-white" href="#stack">
                  Tech Stack & Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Connect */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-neutral-100 uppercase">
              Connect & Signals
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/aliazgorLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-neutral-400 transition hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/ali-azgor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-neutral-400 transition hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:ali.azgor.0810@gmail.com"
                  className="group inline-flex items-center gap-1.5 text-neutral-400 transition hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Dispatch</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 sm:flex-row">
          <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
            <span>&copy; {new Date().getFullYear()} Md Ali Azgor</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Terminal className="h-3 w-3" />
              <span>Next.js &middot; Tailwind &middot; Vercel</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-1 text-xs font-mono text-neutral-400 transition hover:text-white"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <span className="transition-transform group-hover:-translate-y-0.5">&uarr;</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
