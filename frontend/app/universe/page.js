"use client";

import dynamic from "next/dynamic";

const UniverseHub3D = dynamic(
  () => import("@/components/universe/three/UniverseHub3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-obsidian flex flex-col items-center justify-center text-orange font-mono">
        <div className="w-12 h-12 rounded-full border-2 border-orange border-t-transparent animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest">
          INITIALIZING 3D UNIVERSE ATRIUM...
        </span>
      </div>
    ),
  }
);

export default function UniversePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-obsidian">
      <UniverseHub3D />
    </main>
  );
}
