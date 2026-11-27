import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedbackView } from "@/components/FeedbackView";
import { getScenario, getScenarios, nextScenarioId } from "@/lib/scenarios";

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
  return { title: scenario ? `${scenario.title} feedback` : "Feedback" };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) {
    notFound();
  }
  return <FeedbackView scenario={scenario} nextId={nextScenarioId(scenario.id)} />;
}
