"use client";

import Link from "next/link";
import { scenarioScript } from "@/lib/script";
import { readRememberedChoice, useMounted } from "@/lib/storage";
import type { Scenario } from "@/lib/types";
import { HighlightedText } from "./HighlightedText";
import { PageShell } from "./PageShell";
import { ReportStrip } from "./ReportStrip";

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
    <PageShell banner>
      <p className="text-sm font-semibold text-muted">Drill {scenario.number} of 10</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {correct === null ? "Lesson" : correct ? "Correct" : "Not this time"}
      </h1>
      {choice ? <p className="mt-3">{choice.text}</p> : null}
      {correct === null ? (
        <p className="mt-3 text-sm text-muted">Answer the drill to record a first try.</p>
      ) : (
        <p className="mt-3 text-sm text-muted">
          This score uses your first answer. Trying again will not change it.
        </p>
      )}
      <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 font-semibold">
        {scenario.lesson}
      </p>
      <h2 className="mt-5 text-lg font-bold">Red flags</h2>
      <ul className="mt-2 grid gap-2">
        {scenario.redFlags.map((flag) => (
          <li key={flag} className="rounded-xl bg-[#f6f1e8] px-3 py-2 text-sm">
            {flag}
          </li>
        ))}
      </ul>
      <h2 className="mt-5 text-lg font-bold">Simulated text</h2>
      <div className="mt-2 rounded-2xl border border-line bg-card px-3 py-3">
        <HighlightedText text={scenarioScript(scenario)} />
      </div>
      <h2 className="mt-5 text-lg font-bold">Official sources</h2>
      <ul className="mt-2 grid gap-2">
        {scenario.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              className="font-semibold text-green underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 grid gap-2">
        {nextId ? (
          <Link href={`/drills/${nextId}`} className="btn btn-primary">
            Next drill
          </Link>
        ) : (
          <Link href="/score" className="btn btn-primary">
            See your score
          </Link>
        )}
        <Link href={`/drills/${scenario.id}`} className="btn btn-secondary">
          Try this one again
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
      <div className="mt-5">
        <ReportStrip />
      </div>
    </PageShell>
  );
}
