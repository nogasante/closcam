"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";
import { REPORT_LINES } from "@/lib/sources";

type Flag = { label: string; detail: string };
type Verdict = {
  risk: "low" | "medium" | "high";
  summary: string;
  flags: Flag[];
  next: string;
  report: { label: string; value: string }[];
  numbers?: string[];
  community?: { status: string; reportCount: number; disputeOpen: boolean } | null;
};

export function Checker() {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [copied, setCopied] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await response.json()) as Verdict & { error?: string };
      if (!response.ok) {
        setVerdict(null);
        setError(data.error ?? "The check did not finish.");
        return;
      }
      setCopied("");
      setVerdict(data);
    } catch {
      setError("The check did not finish.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <h1>Check a message</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <label className="sr-only" htmlFor="check-text">
          Message, link, number, or name
        </label>
        <textarea
          id="check-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          maxLength={2000}
          className="say-field min-h-32 py-3"
          placeholder="No names, PINs or codes."
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Checking" : "Check message"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-miss">{error}</p> : null}
      {verdict ? (
        <article className="lift mt-6 px-4 py-4">
          <p className="text-sm text-muted">Risk</p>
          <p className="text-2xl font-extrabold capitalize">{verdict.risk}</p>
          <p className="mt-3">{verdict.summary}</p>
          {verdict.flags.length > 0 ? (
            <ul className="mt-3 grid gap-1 text-sm">
              {verdict.flags.slice(0, 3).map((flag) => (
                <li key={flag.label}>{flag.label}</li>
              ))}
            </ul>
          ) : null}
          {verdict.community && verdict.community.status !== "clean_unknown" && verdict.numbers?.[0] ? (
            <p className="mt-3 text-sm">
              <Link
                href={`/report?dispute=1&type=phone&value=${encodeURIComponent(verdict.numbers[0])}`}
              >
                Dispute this flag
              </Link>
            </p>
          ) : null}
          {verdict.numbers && verdict.numbers.length > 0 ? (
            <a
              className="btn btn-secondary mt-3"
              href="https://osebow.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                const number = verdict.numbers?.[0] ?? "";
                void navigator.clipboard.writeText(number).then(
                  () => setCopied("number copied"),
                  () => setCopied(""),
                );
              }}
            >
              Check this number on Osebow
            </a>
          ) : null}
          {copied ? <p className="mt-2 text-sm text-muted">{copied}</p> : null}
        </article>
      ) : null}
      <section className="mt-8">
        <h2>Get help</h2>
        <ul className="mt-2 text-sm leading-6">
          <li>
            <a href="https://osebow.com/report" target="_blank" rel="noreferrer">
              Report a scammer
            </a>
          </li>
          <li>
            <a href="https://osebow.com/business" target="_blank" rel="noreferrer">
              Find a business&apos;s official number
            </a>
          </li>
          {REPORT_LINES.map((line) => (
            <li key={line.label}>
              {line.label}: {line.value}
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
