"use client";

import dynamic from "next/dynamic";

const GraphicDesignExhibition3D = dynamic(
  () => import("@/components/universe/three/GraphicDesignExhibition3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-obsidian flex flex-col items-center justify-center text-orange font-mono">
        <div className="w-12 h-12 rounded-full border-2 border-orange border-t-transparent animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest">
          ENTERING GRAPHIC DESIGN 3D EXHIBITION...
        </span>
      </div>
    ),
  }
);

export default function GraphicDesignUniversePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-obsidian">
      <GraphicDesignExhibition3D />
    </main>
  );
}
