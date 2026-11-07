import { getCreativeWorldData } from "@/lib/services/universeAdapter";
import UniverseWorldLayout from "@/components/universe/UniverseWorldLayout";

export const metadata = {
  title: "Graphic Design World — Creative Universe | Md Ali Azgor",
  description:
    "Explore Logo Design, Brand Identity, Poster Design, Banners, Social Media, and Print Design works in an interactive exhibition journey.",
};

export default async function GraphicDesignUniversePage() {
  const data = await getCreativeWorldData("graphic-design");

  return (
    <UniverseWorldLayout
      world={data.world}
      categories={data.categories}
      allWorlds={data.allWorlds}
    />
  );
}
