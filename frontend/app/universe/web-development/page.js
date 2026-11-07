import { getCreativeWorldData } from "@/lib/services/universeAdapter";
import UniverseWorldLayout from "@/components/universe/UniverseWorldLayout";

export const metadata = {
  title: "Web Development World — Creative Universe | Md Ali Azgor",
  description:
    "Explore Web Applications, Full-Stack Architecture, Interactive Code Systems, and Tools.",
};

export default async function WebDevelopmentUniversePage() {
  const data = await getCreativeWorldData("web-development");

  return (
    <UniverseWorldLayout
      world={data.world}
      categories={data.categories}
      allWorlds={data.allWorlds}
    />
  );
}
