"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { DrillSummary } from "@/lib/scenarios";
import { useConsent, useMounted, useProgress } from "@/lib/storage";
import { PageShell } from "./PageShell";
import { QuietFooter } from "./ReportStrip";

export function HomeScreen({ drills }: { drills: DrillSummary[] }) {
  const router = useRouter();
  const mounted = useMounted();
  const consent = useConsent();
  const progress = useProgress();
  const attempted = Object.keys(progress.results).length;
  const start =
    drills.find((drill) => !progress.results[drill.id])?.id ?? drills[0]?.id ?? "";

  useEffect(() => {
    if (mounted && !consent) {
      router.replace("/disclaimer");
    }
  }, [mounted, consent, router]);

  if (!mounted || !consent) {
    return (
      <PageShell>
        <h1 className="text-3xl font-bold">CloScam</h1>
        <p className="mt-2 text-muted">Training simulation</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <p className="text-sm font-semibold text-green">Training for Ghana mobile money</p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">CloScam</h1>
      <p className="mt-2 text-lg leading-snug font-semibold">
        CloScam: shut scammers out before they get in.
      </p>
      <p className="mt-3 text-muted">
        Practise realistic scam texts, chats, calls, and fake payment pages. You get a score and a
        checklist. No real messages are sent.
      </p>
      <p className="mt-3 text-sm">
        Bank of Ghana, 2025 fraud report: 24,124 electronic fraud incidents. PSP value at risk:
        GH¢37 million.{" "}
        <Link href="/sources" className="font-semibold text-green underline">
          Sources
        </Link>
      </p>
      {attempted > 0 ? (
        <p className="mt-3 text-sm font-semibold">
          {attempted} of {drills.length} drills completed
        </p>
      ) : null}
      <div className="mt-5 grid gap-2">
        <Link href={`/drills/${start}`} className="btn btn-primary">
          {attempted > 0 && attempted < drills.length ? "Continue training" : "Start training"}
        </Link>
        <Link href="/drills" className="btn btn-secondary">
          Pick a drill
        </Link>
        <Link href="/tools" className="btn btn-secondary">
          Practice tools
        </Link>
        <Link href="/checklist" className="btn btn-secondary">
          Checklist
        </Link>
        <Link href="/sources" className="btn btn-secondary">
          Sources and help
        </Link>
        <a href="#how" className="btn btn-secondary">
          How this works
        </a>
        <Link href="/score" className="btn btn-secondary">
          Your practice score
        </Link>
      </div>
      <section id="how" className="mt-8">
        <h2 className="text-xl font-bold">How this works</h2>
        <ol className="mt-3 grid gap-3">
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            <span className="font-bold">1. Practise.</span> Walk through a chat, a text, a call, or
            a fake payment page.
          </li>
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            <span className="font-bold">2. Get scored.</span> Your first answer on each drill is
            the one that counts.
          </li>
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            <span className="font-bold">3. Reuse the checklist.</span> Leave with the rules and the
            report lines: 292, 18555 or 191.
          </li>
        </ol>
      </section>
      <p className="mt-6 text-sm">
        <Link href="/disclaimer" className="font-semibold text-green underline">
          Read the disclaimer again
        </Link>
      </p>
      <div className="-mx-4 mt-6">
        <QuietFooter />
      </div>
    </PageShell>
  );
}
