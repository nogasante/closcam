import data from "@/data/scenarios.json";
import type { Scenario, ScenarioFile, Surface } from "./types";

const SURFACE_LABELS: Record<Surface, string> = {
  chat: "Chat",
  sms: "SMS",
  call: "Call",
  payment_page: "Payment page",
  scene: "Scene",
  prompt: "Prompt",
};

function assertScenarios(file: ScenarioFile): Scenario[] {
  if (!Array.isArray(file.scenarios) || file.scenarios.length !== 10) {
    throw new Error("CloScam expected 10 drills.");
  }
  file.scenarios.forEach((scenario, index) => {
    if (scenario.number !== index + 1) {
      throw new Error(`Drill ${scenario.id} is out of order.`);
    }
    const correct = scenario.choices.filter((choice) => choice.correct);
    if (correct.length !== 1) {
      throw new Error(`Drill ${scenario.id} needs exactly one correct choice.`);
    }
    if (scenario.steps.length === 0) {
      throw new Error(`Drill ${scenario.id} has no surface.`);
    }
  });
  return file.scenarios;
}

const scenarios = assertScenarios(data as ScenarioFile);

export function getScenarios(): Scenario[] {
  return scenarios;
}

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}

export function nextScenarioId(id: string): string | null {
  const index = scenarios.findIndex((scenario) => scenario.id === id);
  if (index < 0 || index >= scenarios.length - 1) {
    return null;
  }
  return scenarios[index + 1]?.id ?? null;
}

export function firstIncompleteId(done: Record<string, unknown>): string {
  const pending = scenarios.find((scenario) => !done[scenario.id]);
  return pending?.id ?? scenarios[0].id;
}

export function surfaceLabel(surface: Surface): string {
  return SURFACE_LABELS[surface];
}

export type DrillSummary = {
  id: string;
  number: number;
  title: string;
  headline: boolean;
  difficulty: Scenario["difficulty"];
  surfaces: Surface[];
};

export function drillSummaries(): DrillSummary[] {
  return scenarios.map((scenario) => ({
    id: scenario.id,
    number: scenario.number,
    title: scenario.title,
    headline: scenario.headline,
    difficulty: scenario.difficulty,
    surfaces: scenario.surfaces,
  }));
}
