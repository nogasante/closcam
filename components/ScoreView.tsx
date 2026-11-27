"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { summarise } from "@/lib/scoring";
import { getScenarios } from "@/lib/scenarios";
import { clearProgress, useProgress } from "@/lib/storage";
import { CountUp } from "./motion/CountUp";
import { PageShell } from "./PageShell";
import { QuietFooter } from "./ReportStrip";

export function ScoreView({ total }: { total: number }) {
  const reduce = useReducedMotion();
  const progress = useProgress();
  const summary = summarise(progress, total);
  const scenarios = getScenarios();
  const [confirmClear, setConfirmClear] = useState(false);
  const stars = summary.correct >= 8 ? 3 : summary.correct >= 5 ? 2 : summary.correct > 0 ? 1 : 0;

  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">Results</h1>
      <div className="mt-4 flex gap-2" aria-label="Stars">
        {[0, 1, 2].map((index) => {
          const on = index < stars;
          return (
            <motion.span
              key={index}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.15 + index * 0.12 }}
            >
              <Star size={28} className={on ? "fill-green text-green" : "text-line"} aria-hidden="true" />
            </motion.span>
          );
        })}
      </div>
      <p className="mt-2 text-muted">
        First answers only. Untried drills are not marked wrong. Nothing here has your name.
      </p>
      <p className="mt-5 text-5xl font-bold tracking-tight">
        <CountUp to={summary.correct} /> / {summary.total}
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
      <ul className="mt-6 grid gap-4">
        {scenarios.map((scenario, index) => {
          const result = progress.results[scenario.id];
          const safe = scenario.choices.find((choice) => choice.correct)?.text ?? scenario.lesson;
          return (
            <motion.li
              key={scenario.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.05 * index }}
            >
              <p className="font-extrabold">
                {scenario.number}. {scenario.title}
              </p>
              {result ? (
                <p className="mt-1 text-sm text-muted">
                  {result.correct ? "You took the safe move. " : "Your first answer missed it. Safe move: "}
                  {safe}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">Not tried yet. Safe move: {safe}</p>
              )}
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-6">
        <Link href="/checklist" className="btn btn-primary">
          Open the checklist
        </Link>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/drills" className="inline-flex min-h-11 items-center text-muted">
            Pick a drill
          </Link>
          <Link href="/hub" className="inline-flex min-h-11 items-center text-muted">
            Mission map
          </Link>
        </p>
      </div>
      <div className="mt-6">
        {confirmClear ? (
          <button type="button" className="min-h-11 text-sm text-muted" onClick={() => clearProgress()}>
            Yes, clear the score on this phone
          </button>
        ) : (
          <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setConfirmClear(true)}>
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
