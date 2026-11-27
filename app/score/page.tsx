import type { Metadata } from "next";
import { ScoreView } from "@/components/ScoreView";
import { getScenarios } from "@/lib/scenarios";

export const metadata: Metadata = {
  title: "Your practice score",
};

export default function ScorePage() {
  return <ScoreView total={getScenarios().length} />;
}
