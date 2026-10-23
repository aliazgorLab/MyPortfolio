"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AZSignature from "@/components/ui/AZSignature";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Capabilities", href: "#capabilities" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);

      const ids = ["work", "about", "experience", "capabilities", "contact"];
      const offset = window.scrollY + 140;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && offset >= el.offsetTop && offset < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mobile scroll lock + Escape ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = (e) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/85 backdrop-blur-xl border-b border-white/5 py-3.5"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Left — AZ. Signature */}
          <Link
            href="/"
            onClick={goHome}
            aria-label="Md Ali Azgor — Home"
            className="group flex-shrink-0 az-logo-enter focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF791F]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded"
          >
            <span
              className="block transition-transform duration-300 ease-out origin-left group-hover:scale-[1.06] group-hover:-rotate-1"
            >
              <AZSignature size={44} />
            </span>
          </Link>

          {/* Center — Desktop nav links */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-sm font-sans font-medium tracking-wide transition-colors duration-250 group ${
                    active ? "text-softwhite" : "text-muted hover:text-softwhite"
                  }`}
                >
                  {link.label}
                  {/* underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#58BFFF] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right — Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              data-cursor="contact"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded border border-white/15 text-sm font-sans font-medium text-softwhite hover:border-white/30 hover:text-softwhite transition-all duration-250"
            >
              <span>Let&apos;s Talk</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                aria-hidden="true"
              >
                <path
                  d="M2.5 10.5L10.5 2.5M4.5 2.5H10.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Mobile — CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="text-xs font-sans font-medium text-softwhite/80 border border-white/15 px-3 py-1.5 rounded hover:border-white/30 transition-colors duration-200"
            >
              Talk
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-1.5 text-softwhite focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
            >
              {/* Animated hamburger */}
              <span className="flex flex-col gap-[5px] w-5">
                <span
                  className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[6px]" : ""
                  }`}
                />
                <span
                  className={`block h-px bg-current transition-all duration-300 ${
                    mobileOpen ? "w-0 opacity-0" : "w-3.5"
                  }`}
                />
                <span
                  className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-40 bg-obsidian/97 backdrop-blur-2xl flex flex-col px-8 pt-28 pb-10 md:hidden transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.22em] text-muted/50 uppercase mb-8">
          // NAVIGATION
        </span>

        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="group flex items-center justify-between py-4 border-b border-white/8 text-softwhite hover:text-[#58BFFF] transition-colors duration-250"
            >
              <span
                className="font-display font-bold tracking-tight uppercase"
                style={{ fontSize: "clamp(1.75rem, 7vw, 2.5rem)" }}
              >
                {link.label}
              </span>
              <span className="font-mono text-xs text-muted/50">
                0{idx + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="group flex items-center justify-between py-4 border-b border-white/8 text-softwhite hover:text-[#FF791F] transition-colors duration-250"
          >
            <span
              className="font-display font-bold tracking-tight uppercase"
              style={{ fontSize: "clamp(1.75rem, 7vw, 2.5rem)" }}
            >
              Let&apos;s Talk
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 16L16 4M7 4h9v9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-2 font-mono text-[11px] text-muted/40">
          <span>ali.azgor.0810@gmail.com</span>
          <span>Chittagong, Bangladesh</span>
        </div>
      </div>
    </>
  );
}
