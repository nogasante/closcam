"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { summarise } from "@/lib/scoring";
import { getScenarios } from "@/lib/scenarios";
import { clearProgress, useProgress, useProtectSteps } from "@/lib/storage";
import { CountUp } from "./motion/CountUp";
import { PageShell } from "./PageShell";
import { QuietFooter } from "./ReportStrip";

export function ScoreView({ total }: { total: number }) {
  const reduce = useReducedMotion();
  const progress = useProgress();
  const summary = summarise(progress, total);
  const scenarios = getScenarios();
  const protect = useProtectSteps();
  const protectCorrect = ["p-pin", "p-code", "p-call", "p-recover"].filter((id) => protect[id]?.correct).length;
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
      <p className="t-display nums mt-4">
        <CountUp to={summary.correct} /> / {summary.total}
      </p>
      <p className="mt-1 text-sm text-muted">First try</p>
      {summary.percentage !== null ? (
        <p className="mt-3 text-2xl font-bold">{summary.percentage}%</p>
      ) : (
        <p className="mt-3 text-sm">
          {summary.attempted} of {summary.total} drills tried. Finish all 10 to see a percentage.
        </p>
      )}
      {summary.band ? <p className="mt-4">{summary.band}</p> : null}
      <p className="nums mt-4 text-sm text-muted">Protection {protectCorrect} / 4</p>
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
              <p className="mt-1 text-sm text-muted">
                {result ? (result.correct ? "Met" : `Missed. ${safe}`) : "Open"}
              </p>
            </motion.li>
          );
        })}
      </ul>
      <div className="mt-6">
        <Link href="/checklist" className="btn btn-primary">
          Open checklist
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
            Clear score
          </button>
        ) : (
          <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setConfirmClear(true)}>
            Clear score
          </button>
        )}
      </div>
      <div className="-mx-4 mt-6">
        <QuietFooter />
      </div>
    </PageShell>
  );
}
