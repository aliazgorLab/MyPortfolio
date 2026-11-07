import { getCreativeWorldData } from "@/lib/services/universeAdapter";
import UniverseWorldLayout from "@/components/universe/UniverseWorldLayout";

export const metadata = {
  title: "Video & Motion World — Creative Universe | Md Ali Azgor",
  description:
    "Explore Promotional Videos, Motion Graphics, Kinetic Typography, and Showreels in a cinematic screening room.",
};

export default async function VideoMotionUniversePage() {
  const data = await getCreativeWorldData("video-motion");

  return (
    <UniverseWorldLayout
      world={data.world}
      categories={data.categories}
      allWorlds={data.allWorlds}
    />
  );
}
