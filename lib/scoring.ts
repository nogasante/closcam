import type { Progress } from "./types";

export function bandFor(correct: number): string {
  if (correct <= 4) {
    return "Keep practising. The checklist will help.";
  }
  if (correct <= 7) {
    return "You are spotting many of the tricks. Review the ones you missed.";
  }
  return "Strong awareness. Revisit the checklist and share the official report lines with family.";
}

export function summarise(progress: Progress, total: number) {
  const entries = Object.values(progress.results);
  const attempted = entries.length;
  const correct = entries.filter((entry) => entry.correct).length;
  const percentage =
    attempted === total && total > 0
      ? Math.round((correct / total) * 100)
      : null;

  return {
    correct,
    attempted,
    total,
    percentage,
    band: attempted > 0 ? bandFor(correct) : null,
  };
}
