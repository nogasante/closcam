"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { Flame, Star } from "lucide-react";
import type { DrillSummary } from "@/lib/scenarios";
import { useConsent, useExtras, useMounted, useProgress } from "@/lib/storage";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";
import { RoomArt } from "@/components/phone/RoomArt";

const RANKS = [
  { xp: 0, name: "New" },
  { xp: 100, name: "Spotter" },
  { xp: 300, name: "Careful" },
  { xp: 600, name: "Sharp" },
  { xp: 1000, name: "Closer" },
];

export function TrainingHub({ drills }: { drills: DrillSummary[] }) {
  const router = useRouter();
  const mounted = useMounted();
  const consent = useConsent();
  const progress = useProgress();
  const extras = useExtras();

  useEffect(() => {
    if (mounted && !consent) router.replace("/disclaimer");
  }, [mounted, consent, router]);

  const cleared = drills.filter((drill) => progress.results[drill.id]).length;
  const correct = drills.filter((drill) => progress.results[drill.id]?.correct).length;
  const xp = drills.reduce((sum, drill) => {
    const result = progress.results[drill.id];
    if (!result) return sum;
    return sum + (result.correct ? 100 : 40);
  }, 0);
  const rank = [...RANKS].reverse().find((item) => xp >= item.xp)?.name ?? "New";
  const nextRank = RANKS.find((item) => item.xp > xp);
  const streak = streakOf(progress.results);

  if (!mounted || !consent) {
    return (
      <PageShell>
        <h1 className="text-3xl font-extrabold">CloScam</h1>
      </PageShell>
    );
  }

  return (
    <PageShell
      wide
      action={
        <p className="flex items-center gap-3 text-sm font-bold">
          <Flame size={16} className="text-danger" aria-hidden="true" />
          {streak}
          <Star size={16} className="text-green" aria-hidden="true" />
          {xp} XP
        </p>
      }
    >
      <RankToast rank={rank} xp={xp} mounted={mounted} />
      <div className="lift px-4 py-4 sm:px-5">
        <p className="text-xs font-bold tracking-wide text-green uppercase">Mission map</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-extrabold">Walk it before you pay.</h1>
          <p className="text-sm text-muted">
            {rank}
            {nextRank ? ` · ${nextRank.xp - xp} XP to ${nextRank.name}` : ""}
          </p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0e1626]">
          <div className="h-full bg-safe" style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">
          {cleared} of {drills.length} rooms answered · {correct} first-try correct
          {extras.call === true ? " · Call refused" : ""}
          {extras.protect ? " · Protection done" : ""}
        </p>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {drills.map((drill) => {
          const done = progress.results[drill.id];
          return (
            <li key={drill.id}>
              <Link href={`/drills/${drill.id}`} className="room-card lift block overflow-hidden">
                <RoomArt id={drill.id} />
                <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                  <p className="text-lg font-extrabold">{drill.title}</p>
                  <p className="shrink-0 text-sm text-muted">
                    {done ? (done.correct ? "Met" : "Missed") : drill.headline ? "Start" : drill.difficulty}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/call" className="btn btn-primary">
          Live call
        </Link>
        <Link href="/protect" className="text-sm text-muted">
          Protection
        </Link>
      </div>
      <SiteFooter />
    </PageShell>
  );
}

function RankToast({ rank, xp, mounted }: { rank: string; xp: number; mounted: boolean }) {
  const message = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("closcam-progress", onStoreChange);
      return () => window.removeEventListener("closcam-progress", onStoreChange);
    },
    () => {
      if (!mounted) return "";
      const seen = window.sessionStorage.getItem("closcam-seen-rank") ?? "";
      if (seen && seen !== rank && xp > 0) return rank;
      return "";
    },
    () => "",
  );
  useEffect(() => {
    if (!mounted) return;
    if (!message) {
      window.sessionStorage.setItem("closcam-seen-rank", rank);
      return;
    }
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("closcam-seen-rank", rank);
      window.dispatchEvent(new Event("closcam-progress"));
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [message, mounted, rank]);
  if (!message) return null;
  return (
    <p className="mb-4 rounded-xl bg-green px-4 py-3 text-sm font-extrabold text-[#1a1408]">
      New rank: {message}
    </p>
  );
}

function streakOf(results: Record<string, { correct: boolean; at: string }>): number {
  const ordered = Object.values(results).sort((a, b) => a.at.localeCompare(b.at));
  let count = 0;
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (!ordered[index]?.correct) break;
    count += 1;
  }
  return count;
}
