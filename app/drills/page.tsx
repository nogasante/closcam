import type { Metadata } from "next";
import { DrillPicker, type DrillCard } from "@/components/DrillPicker";
import { drillSummaries, surfaceLabel } from "@/lib/scenarios";

export const metadata: Metadata = {
  title: "Pick a drill",
};

export default function DrillsPage() {
  const drills: DrillCard[] = drillSummaries().map((drill) => ({
    id: drill.id,
    number: drill.number,
    title: drill.title,
    headline: drill.headline,
    difficulty: drill.difficulty === "easy" ? "Easy" : "Medium",
    surfaces: drill.surfaces.map((surface) => surfaceLabel(surface)).join(" + "),
  }));
  return <DrillPicker drills={drills} />;
}
