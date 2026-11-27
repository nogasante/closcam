"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SimulationBanner } from "@/components/PageShell";

export type FlagEntry = { label: string; detail: string };

export function ConsoleFrame({
  kicker,
  title,
  brief,
  objective,
  pressureLabel,
  pressureLeft,
  flags,
  progress,
  action,
  children,
  phoneMode = false,
}: {
  kicker: string;
  title: string;
  brief: string;
  objective: string;
  pressureLabel: string;
  pressureLeft: number;
  flags: FlagEntry[];
  progress: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  phoneMode?: boolean;
}) {
  const panel = (
    <div className="grid gap-8">
      <div>
        <p className="text-sm text-muted">{kicker}</p>
        <h1 className="mt-1 text-[28px] leading-tight font-extrabold">{title}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">{brief}</p>
        <p className="mt-4 text-[16px]">{objective}</p>
        <div className="pressure mt-6" aria-label={pressureLabel}>
          <span style={{ width: `${Math.max(0, Math.min(100, pressureLeft))}%` }} />
        </div>
      </div>
      {flags.length > 0 ? (
        <ul className="grid gap-3">
          {flags.map((flag, index) => (
            <li key={`${flag.label}-${index}`} className="text-sm text-muted">
              {flag.detail}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="text-sm text-muted">{progress}</p>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <div className={phoneMode ? "hidden" : "nav-frost"}>
        <SiteHeader action={action} />
        <SimulationBanner />
      </div>
      <div className="mx-auto grid w-full max-w-[1120px] flex-1 gap-6 px-0 py-0 lg:grid-cols-[minmax(0,420px)_minmax(300px,1fr)] lg:gap-10 lg:px-8 lg:py-8">
        <div className="min-w-0 lg:pt-2">{children}</div>
        <aside className="hidden px-1 lg:block">{panel}</aside>
      </div>
    </div>
  );
}

export function MobileBrief({
  objective,
  flags,
}: {
  objective: string;
  flags: FlagEntry[];
}) {
  return (
    <div className="border-b border-line px-3 py-2 lg:hidden">
      <p className="text-[14px] leading-snug">{objective}</p>
      {flags.length > 0 ? (
        <p className="mt-1 text-[12px] text-miss">
          {flags.length} in the log. {flags[flags.length - 1]?.label}.
        </p>
      ) : null}
    </div>
  );
}

export function LeaveLink() {
  return (
    <Link href="/hub" className="inline-flex min-h-11 items-center text-[13px] font-medium">
      Leave
    </Link>
  );
}
