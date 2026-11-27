"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";

export function ReportForm() {
  const [mode, setMode] = useState<"report" | "dispute">("report");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const body = new FormData(event.currentTarget);
    body.set("kind", mode);
    try {
      const response = await fetch("/api/report", { method: "POST", body });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "The report did not send.");
        return;
      }
      setMessage(mode === "dispute" ? "Dispute received. It does not remove the entry by itself." : "Report received. It stays unverified until others report the same item.");
      event.currentTarget.reset();
    } catch {
      setError("The report did not send.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">Report</h1>
      <p className="mt-3 text-muted">
        Tell CloScam about a number, link, message, or business name. Do not include your name, a PIN, or a code. A screenshot is optional and is not published.
      </p>
      <p className="mt-3 text-sm">
        <button type="button" className="min-h-11 text-muted" onClick={() => setMode(mode === "report" ? "dispute" : "report")}>
          {mode === "report" ? "This was flagged by mistake" : "Back to a new report"}
        </button>
      </p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input name="website" tabIndex={-1} autoComplete="off" className="absolute h-0 w-0 opacity-0" aria-hidden="true" />
        <label className="grid gap-1 text-sm">
          What it is
          <select name="type" className="say-field" defaultValue="phone">
            <option value="phone">Phone number</option>
            <option value="url">Link</option>
            <option value="business">Business name</option>
            <option value="message">Message text</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          The item
          <input name="value" required className="say-field" placeholder="055 000 0000 or a link" />
        </label>
        {mode === "report" ? (
          <label className="grid gap-1 text-sm">
            Scam type
            <select name="scamType" className="say-field" defaultValue="payment">
              <option value="payment">Payment</option>
              <option value="code">Code or PIN</option>
              <option value="impersonation">Impersonation</option>
              <option value="job">Job or prize</option>
              <option value="other">Other</option>
            </select>
          </label>
        ) : null}
        <label className="grid gap-1 text-sm">
          {mode === "report" ? "What happened" : "Why this is wrong"}
          <textarea name={mode === "report" ? "description" : "note"} required minLength={8} rows={4} className="say-field py-3" />
        </label>
        {mode === "report" ? (
          <label className="grid gap-1 text-sm text-muted">
            Screenshot, optional. It is not saved or shown to others.
            <input name="evidence" type="file" accept="image/*" className="text-sm" />
          </label>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending" : mode === "report" ? "Send report" : "Send dispute"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-miss">{error}</p> : null}
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      <p className="mt-6 text-sm text-muted">
        <Link href="/tools">Back to tools</Link>
      </p>
      <SiteFooter />
    </PageShell>
  );
}
