import type { Metadata } from "next";
import { ToolsClient } from "@/components/ToolsClient";
import { getScenarios } from "@/lib/scenarios";
import { scenarioScript } from "@/lib/script";

export const metadata: Metadata = {
  title: "Practice tools",
};

export default function ToolsPage() {
  const drills = getScenarios().map((scenario) => ({
    id: scenario.id,
    title: `${scenario.number}. ${scenario.title}`,
    script: scenarioScript(scenario),
  }));
  return <ToolsClient drills={drills} />;
}
