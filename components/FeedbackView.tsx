"use client";

import Link from "next/link";
import { readRememberedChoice, useMounted } from "@/lib/storage";
import type { Scenario } from "@/lib/types";
import { PageShell } from "./PageShell";

export function FeedbackView({
  scenario,
  nextId,
}: {
  scenario: Scenario;
  nextId: string | null;
}) {
  const mounted = useMounted();
  const choiceId = mounted ? readRememberedChoice(scenario.id) : null;
  const choice = scenario.choices.find((item) => item.id === choiceId) ?? null;
  const correct = choice ? choice.correct : null;

  return (
    <PageShell>
      <h1>{correct === null ? "Lesson" : correct ? "Met" : "Missed"}</h1>
      <p className="mt-3">{scenario.lesson}</p>
      <ul className="mt-3 grid gap-2">
        {scenario.redFlags.slice(0, 3).map((flag) => (
          <li key={flag} className="border-l border-line pl-3 text-sm">
            {flag}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {nextId ? (
          <Link href={`/drills/${nextId}`} className="btn btn-primary">
            Next room
          </Link>
        ) : (
          <Link href="/score" className="btn btn-primary">
            See results
          </Link>
        )}
      </div>
    </PageShell>
  );
}
