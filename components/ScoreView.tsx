"use client";

import Link from "next/link";
import { useState } from "react";
import { summarise } from "@/lib/scoring";
import { clearProgress, useProgress } from "@/lib/storage";
import { PageShell } from "./PageShell";
import { QuietFooter } from "./ReportStrip";

export function ScoreView({ total }: { total: number }) {
  const progress = useProgress();
  const summary = summarise(progress, total);
  const [confirmClear, setConfirmClear] = useState(false);
  const missed = Object.entries(progress.results)
    .filter(([, result]) => !result.correct)
    .map(([id]) => id);

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">Your practice score</h1>
      <p className="mt-2 text-muted">
        First answers only. Untried drills are not marked wrong. Nothing here has your name.
      </p>
      <p className="mt-5 text-5xl font-bold tracking-tight">
        {summary.correct} / {summary.total}
      </p>
      <p className="mt-1 text-sm font-semibold text-muted">correct on the first try</p>
      {summary.percentage !== null ? (
        <p className="mt-3 text-2xl font-bold">{summary.percentage}%</p>
      ) : (
        <p className="mt-3 text-sm">
          {summary.attempted} of {summary.total} drills tried. Finish all 10 to see a percentage.
        </p>
      )}
      {summary.band ? <p className="mt-4 font-semibold">{summary.band}</p> : (
        <p className="mt-4">You have not finished a drill yet.</p>
      )}
      {missed.length > 0 ? (
        <p className="mt-3 text-sm">
          <Link href="/drills" className="font-semibold text-green underline">
            Review the drills you missed
          </Link>
        </p>
      ) : null}
      <div className="mt-5 grid gap-2">
        <Link href="/checklist" className="btn btn-primary">
          Open the checklist
        </Link>
        <Link href="/drills" className="btn btn-secondary">
          Pick a drill
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
      <div className="mt-8">
        {confirmClear ? (
          <button type="button" className="btn btn-secondary" onClick={() => clearProgress()}>
            Yes, clear the score on this phone
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)}>
            Clear this phone&apos;s practice score
          </button>
        )}
      </div>
      <div className="-mx-4 mt-6">
        <QuietFooter />
      </div>
    </PageShell>
  );
}
