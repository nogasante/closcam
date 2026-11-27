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
}) {
  const panel = (
    <div className="grid gap-6">
      <section>
        <p className="text-[12px] tracking-wide text-muted uppercase">{kicker}</p>
        <h1 className="mt-1 text-[22px] leading-tight font-medium tracking-tight">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{brief}</p>
      </section>
      <section>
        <h2 className="text-[12px] tracking-wide text-muted uppercase">Objective</h2>
        <p className="mt-2 text-[15px]">{objective}</p>
      </section>
      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[12px] tracking-wide text-muted uppercase">Pressure</h2>
          <p className="mono text-[12px] text-muted">{pressureLabel}</p>
        </div>
        <div className="pressure mt-2" aria-hidden="true">
          <span style={{ width: `${Math.max(0, Math.min(100, pressureLeft))}%` }} />
        </div>
      </section>
      <section>
        <h2 className="text-[12px] tracking-wide text-muted uppercase">Red-flag log</h2>
        {flags.length === 0 ? (
          <p className="mt-2 text-[14px] text-muted">Nothing logged yet.</p>
        ) : (
          <ol className="mt-2 grid gap-2">
            {flags.map((flag, index) => (
              <li key={`${flag.label}-${index}`} className="border-l border-danger py-1 pl-3 text-[14px]">
                <span className="font-medium">{flag.label}.</span> {flag.detail}
              </li>
            ))}
          </ol>
        )}
      </section>
      <section>
        <h2 className="text-[12px] tracking-wide text-muted uppercase">Progress</h2>
        <p className="mt-2 text-[14px]">{progress}</p>
      </section>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 bg-paper">
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
