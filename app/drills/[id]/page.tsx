import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrainingRoom } from "@/components/live/TrainingRoom";
import { getScenario, getScenarios } from "@/lib/scenarios";

export const dynamicParams = false;

export function generateStaticParams() {
  return getScenarios().map((scenario) => ({ id: scenario.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const scenario = getScenario(id);
  return { title: scenario?.title ?? "Drill" };
}

export default async function DrillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) {
    notFound();
  }
  return <TrainingRoom key={scenario.id} scenario={scenario} />;
}
