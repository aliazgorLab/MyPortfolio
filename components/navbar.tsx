"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LetsTalkButton } from "@/components/ui/lets-talk-button";

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
      // Trigger floating bar once scrolled past 320px
      setShowFloatingNav(window.scrollY > 320);

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

      const scrollPos = window.scrollY + 220;
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
      setActiveSection(window.scrollY > 320 ? matched : "");
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
      {/* 1. STATIC HERO NAVBAR (Natural document flow)                */}
      {/* ============================================================ */}
      <header className="relative z-40 w-full border-b border-neutral-800/40 bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <Link
            className="font-mono text-xl font-bold tracking-tight text-neutral-100 transition hover:opacity-85"
            href="/"
            onClick={handleLogoClick}
          >
            AZ<span className="text-emerald-500">.</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
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

          <div className="flex items-center gap-4">
            <LetsTalkButton onNavClick={handleNavClick} />
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. RACDOX-STYLE FLOATING CARD NAVBAR                         */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ y: -70, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -70, opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              mass: 0.85,
            }}
            className="fixed inset-x-0 top-5 z-50 mx-auto flex w-[92%] max-w-4xl items-center justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/85 px-6 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:px-8"
          >
            {/* Logo */}
            <Link
              className="font-mono text-lg font-bold tracking-tight text-neutral-100 transition hover:opacity-85"
              href="/"
              onClick={handleLogoClick}
            >
              AZ<span className="text-emerald-500">.</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden items-center gap-8 sm:flex md:gap-10">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-medium transition-colors duration-200 ${
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

            {/* Consistent Animated CTA */}
            <LetsTalkButton compact onNavClick={handleNavClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { LetsTalkButton };
export default Navigation;
