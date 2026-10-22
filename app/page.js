"use client";

import { useState } from "react";
import Preloader from "@/components/layout/Preloader";
import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import SelectedWork from "@/components/sections/SelectedWork";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Capabilities from "@/components/sections/Capabilities";
import Philosophy from "@/components/sections/Philosophy";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative w-full overflow-hidden">
      <Preloader onComplete={() => setLoaded(true)} />
      <Hero />
      <Statement />
      <SelectedWork />
      <About />
      <Experience />
      <Capabilities />
      <Philosophy />
      <Contact />
    </main>
  );
}
