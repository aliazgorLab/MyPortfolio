import { getCreativeWorldData } from "@/lib/services/universeAdapter";
import UniverseWorldLayout from "@/components/universe/UniverseWorldLayout";

export const metadata = {
  title: "UI/UX Design World — Creative Universe | Md Ali Azgor",
  description:
    "Explore Website UI, Mobile Apps, Dashboards, Design Systems, and UX Case Studies in an interactive digital lab.",
};

export default async function UiUxDesignUniversePage() {
  const data = await getCreativeWorldData("ui-ux-design");

  return (
    <UniverseWorldLayout
      world={data.world}
      categories={data.categories}
      allWorlds={data.allWorlds}
    />
  );
}
