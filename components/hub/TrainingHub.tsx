"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import type { DrillSummary } from "@/lib/scenarios";
import { useConsent, useExtras, useMounted, useProgress } from "@/lib/storage";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";
import { RoomArt } from "@/components/phone/RoomArt";
import { CountUp } from "@/components/motion/CountUp";

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
  const reduce = useReducedMotion();
  const nextId = drills.find((drill) => !progress.results[drill.id])?.id ?? null;
  const ring = (cleared / drills.length) * 100;

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
          <CountUp to={streak} duration={500} />
          <Star size={16} className="text-green" aria-hidden="true" />
          <CountUp to={xp} /> XP
        </p>
      }
    >
      <RankToast rank={rank} xp={xp} mounted={mounted} />
      <div className="lift px-4 py-5 sm:px-5">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ring value={ring} label={`${cleared}`} />
            <h1 className="text-3xl font-extrabold">Walk it before you pay.</h1>
          </div>
          <p className="text-sm text-muted">
            {rank}
            {nextRank ? ` · ${nextRank.xp - xp} XP to ${nextRank.name}` : ""}
          </p>
        </div>
        <div className="hw-track mt-4" aria-hidden="true">
          <motion.div
            className="hw-fill"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          />
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
          const state = done ? (done.correct ? "Met" : "Missed") : drill.id === nextId ? "Next" : "Later";
          const open = Boolean(done) || drill.id === nextId;
          const body = (
            <>
              <div className="relative h-40 w-full overflow-hidden">
                <RoomArt id={drill.id} />
              </div>
              <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                <p className="text-lg font-extrabold">{drill.title}</p>
                <p className="shrink-0 text-sm text-muted">{state}</p>
              </div>
            </>
          );
          return (
            <li key={drill.id}>
              {open ? (
                <Link href={`/drills/${drill.id}`} className={`room-card lift block overflow-hidden ${state === "Next" ? "room-next" : ""}`}>
                  {body}
                </Link>
              ) : (
                <div className="room-card lift block overflow-hidden" aria-disabled="true">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <Link href="/call" className="btn btn-primary sm:w-auto sm:px-6">
          Live call
        </Link>
        <Link href="/protect" className="mt-4 inline-flex min-h-11 items-center text-sm text-muted">
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

function Ring({ value, label }: { value: number; label: string }) {
  const radius = 16;
  const turn = 2 * Math.PI * radius;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r={radius} fill="none" stroke="#12161b" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#3dce7c"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * turn} ${turn}`}
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="12" fill="#f7f4ee">
        {label}
      </text>
    </svg>
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
