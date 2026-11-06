"use client";

import { useState } from "react";
import Preloader from "@/components/layout/Preloader";
import Hero from "@/components/sections/Hero";
import TechStackMarquee from "@/components/ui/tech-stack-marquee";
import Statement from "@/components/sections/Statement";
import SelectedWork from "@/components/sections/SelectedWork";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import ProjectProcess from "@/components/sections/project-process";
import Capabilities from "@/components/sections/Capabilities";
import Philosophy from "@/components/sections/Philosophy";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative w-full overflow-hidden">
      <Preloader onComplete={() => setLoaded(true)} />
      <Hero />
      <TechStackMarquee />
      <Statement />
      <SelectedWork />
      <About />
      <Experience />
      <ProjectProcess />
      <Capabilities />
      <Philosophy />
      <Contact />
    </main>
  );
}
