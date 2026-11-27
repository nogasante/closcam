"use client";

import Link from "next/link";
import { useProgress } from "@/lib/storage";
import { PageShell } from "./PageShell";

export type DrillCard = {
  id: string;
  number: number;
  title: string;
  headline: boolean;
  difficulty: string;
  surfaces: string;
};

export function DrillPicker({ drills }: { drills: DrillCard[] }) {
  const progress = useProgress();

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">Pick a drill</h1>
      <p className="mt-2 text-muted">Ten short drills. One correct choice in each.</p>
      <ul className="mt-4 grid gap-2">
        {drills.map((drill) => {
          const done = Boolean(progress.results[drill.id]);
          return (
            <li key={drill.id}>
              <Link
                href={`/drills/${drill.id}`}
                className="block min-h-11 rounded-2xl border border-line bg-card px-4 py-3"
              >
                <span className="flex items-center justify-between gap-3 text-xs font-bold tracking-wide text-muted uppercase">
                  <span>
                    {drill.surfaces} · {drill.difficulty}
                  </span>
                  {done ? <span className="text-green">Done</span> : null}
                </span>
                <span className="mt-1 block font-semibold">
                  {drill.number}. {drill.title}
                </span>
                {drill.headline ? (
                  <span className="mt-1 inline-block text-sm font-semibold text-green">
                    Start here
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
