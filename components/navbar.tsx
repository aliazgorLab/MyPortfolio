"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
];

export function Navigation() {
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      // Trigger threshold: activate capsule after scrolling past 350px (approx. hero fold)
      const scrollThreshold = 350;
      if (window.scrollY > scrollThreshold) {
        setShowFloatingNav(true);
      } else {
        setShowFloatingNav(false);
      }

      // Active section detection for indicator
      const sections = [
        { id: "projects", href: "#projects" },
        { id: "work", href: "#projects" },
        { id: "about", href: "#about" },
        { id: "experience", href: "#experience" },
        { id: "stack", href: "#stack" },
        { id: "capabilities", href: "#stack" },
        { id: "contact", href: "#contact" },
      ];

      const scrollPos = window.scrollY + 200;
      let matched = "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            matched = section.href;
            break;
          }
        }
      }
      setActiveSection(window.scrollY > 350 ? matched : "");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. STATIC HERO HEADER (Normal flow, scrolls away naturally) */}
      {/* ============================================================ */}
      <header className="relative z-40 w-full border-b border-neutral-800/40 bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          {/* Logo / Monogram */}
          <Link
            className="font-mono text-xl font-bold tracking-tight text-neutral-100 transition hover:opacity-80"
            href="/"
            onClick={handleLogoClick}
          >
            AZ<span className="text-emerald-500">.</span>
          </Link>

          {/* Centered Desktop Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-neutral-400 transition hover:text-neutral-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hero Action CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-mono font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. FLOATING CAPSULE NAVBAR (Slides down when hero is scrolled past) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
              mass: 0.8,
            }}
            className="fixed inset-x-0 top-4 z-50 mx-auto flex w-max max-w-[92vw] items-center justify-between gap-4 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-3.5 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:gap-6 sm:px-6 sm:py-2.5"
          >
            {/* Compact Monogram */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="font-mono text-sm font-bold tracking-tight text-neutral-100 transition-opacity hover:opacity-80 hover:text-white"
            >
              AZ<span className="text-emerald-500">.</span>
            </Link>

            {/* Micro Navigation Items */}
            <nav className="flex items-center gap-3 sm:gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive
                        ? "font-semibold text-white"
                        : "text-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Capsule CTA Pill */}
            <Link
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-neutral-200 to-white px-3 py-1.5 text-xs font-medium text-neutral-950 shadow-sm transition hover:opacity-90 sm:px-3.5"
            >
              <span>Connect</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
