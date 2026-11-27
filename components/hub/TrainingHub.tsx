"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { DrillSummary } from "@/lib/scenarios";
import { surfaceLabel } from "@/lib/scenarios";
import { useConsent, useExtras, useMounted, useProgress } from "@/lib/storage";
import { PageShell } from "@/components/PageShell";
import { JunctionFlat } from "./JunctionFlat";
import type { Spot } from "./JunctionScene";

const JunctionScene = dynamic(() => import("./JunctionScene"), {
  ssr: false,
  loading: () => <p className="px-3 py-6 text-[14px] text-muted">Building the junction</p>,
});

const GRAPHICS_EVENT = "closcam-graphics-change";

function readGraphics(): "model" | "flat" {
  const saved = window.localStorage.getItem("closcam-graphics");
  if (saved === "flat" || saved === "model") return saved;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = window.matchMedia("(max-width: 1099px)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (reduce || narrow || connection?.saveData) return "flat";
  return "model";
}

function useGraphics(): "model" | "flat" {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(GRAPHICS_EVENT, onStoreChange);
      return () => window.removeEventListener(GRAPHICS_EVENT, onStoreChange);
    },
    readGraphics,
    () => "flat",
  );
}

export function TrainingHub({ drills }: { drills: DrillSummary[] }) {
  const router = useRouter();
  const mounted = useMounted();
  const consent = useConsent();
  const progress = useProgress();
  const extras = useExtras();
  const mode = useGraphics();
  const [hover, setHover] = useState("Site map. Phone, stall, or booth.");

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
  const rank = xp >= 1000 ? "Closer" : xp >= 600 ? "Sharp" : xp >= 300 ? "Careful" : xp >= 100 ? "Spotter" : "New";
  const next = drills.find((drill) => !progress.results[drill.id]) ?? drills[0];

  function select(spot: Spot) {
    if (spot === "phone" && next) router.push(`/drills/${next.id}`);
    if (spot === "kiosk") router.push("/drills/s09-agent-phone");
    if (spot === "booth") router.push("/call");
  }

  function setGraphics(nextMode: "model" | "flat") {
    window.localStorage.setItem("closcam-graphics", nextMode);
    window.dispatchEvent(new Event(GRAPHICS_EVENT));
  }

  if (!mounted || !consent) {
    return (
      <PageShell>
        <h1 className="text-[28px] font-medium tracking-tight">CloScam</h1>
      </PageShell>
    );
  }

  return (
    <PageShell
      wide
      action={
        <p className="mono text-[12px] text-muted">
          {xp} XP · {rank}
        </p>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
        <section>
          <p className="text-[12px] tracking-wide text-muted uppercase">Junction</p>
          <h1 className="mt-2 text-[32px] leading-none font-medium tracking-tight">Walk it before you pay.</h1>
          <p className="mt-3 max-w-md text-[15px] text-muted">
            CloScam: shut scammers out before they get in.
          </p>
          <div className="relative mt-6 h-[240px] border border-line lg:h-[420px]">
            {mode === "model" ? <JunctionScene onSelect={select} /> : <JunctionFlat onSelect={select} />}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted">{hover}</p>
            <button
              type="button"
              className="min-h-11 shrink-0 text-[13px]"
              onClick={() => setGraphics(mode === "model" ? "flat" : "model")}
              onMouseEnter={() =>
                setHover(mode === "model" ? "Flat elevation of the same junction." : "3D site model.")
              }
            >
              {mode === "model" ? "Flat view" : "3D model"}
            </button>
          </div>
        </section>
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[12px] tracking-wide text-muted uppercase">Rooms</h2>
            <p className="text-[13px] text-muted">
              {cleared} of {drills.length} answered · {correct} first-try correct
            </p>
          </div>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {drills.map((drill) => {
              const done = progress.results[drill.id];
              return (
                <li key={drill.id}>
                  <Link href={`/drills/${drill.id}`} className="flex min-h-14 items-baseline justify-between gap-3 py-3">
                    <span>
                      <span className="mono text-[12px] text-muted">
                        {String(drill.number).padStart(2, "0")}
                      </span>{" "}
                      <span className="text-[15px]">{drill.title}</span>
                      <span className="mt-1 block text-[12px] text-muted">
                        {drill.surfaces.map((surface) => surfaceLabel(surface)).join(" · ")} ·{" "}
                        {drill.difficulty === "easy" ? "Easy" : "Medium"}
                        {drill.headline ? " · Start here" : ""}
                      </span>
                    </span>
                    <span className="text-[12px] text-muted">{done ? (done.correct ? "Met" : "Missed") : "Open"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href="/call" className="btn btn-primary">
              Live call
            </Link>
            <Link href="/protect" className="btn btn-secondary">
              Protection
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-muted">
            Takeover has two doors. A PulseLink security call, or a saved contact who asks for a code. Either one ends with your contacts being asked for money.
            {extras.call === true ? " Call: refused." : ""}
            {extras.protect ? " Protection: done." : ""}
          </p>
        </section>
      </div>
    </PageShell>
  );
}
