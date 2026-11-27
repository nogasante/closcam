"use client";

import { useState } from "react";
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
};

export function Checker() {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);

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
      setVerdict(data);
    } catch {
      setError("The check did not finish.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">Scam checker</h1>
      <p className="mt-3 text-muted">
        Paste a message, link, phone number, or business name. Do not paste a real PIN or a code from your phone. This is a guide, not a guarantee.
      </p>
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
          placeholder="Paste it here"
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Checking" : "Check"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-miss">{error}</p> : null}
      {verdict ? (
        <article className="lift mt-6 px-4 py-4">
          <p className="text-sm text-muted">Risk</p>
          <p className="text-2xl font-extrabold capitalize">{verdict.risk}</p>
          <p className="mt-3">{verdict.summary}</p>
          {verdict.flags.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {verdict.flags.map((flag) => (
                <li key={flag.label}>
                  <p className="font-extrabold">{flag.label}</p>
                  <p className="text-sm text-muted">{flag.detail}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4">{verdict.next}</p>
          <div className="mt-4 grid gap-1 text-sm text-muted">
            {(verdict.report.length > 0 ? verdict.report : REPORT_LINES).map((line) => (
              <p key={line.label}>
                {line.label}: {line.value}
              </p>
            ))}
          </div>
        </article>
      ) : null}
      <SiteFooter />
    </PageShell>
  );
}
