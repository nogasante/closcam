"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";

export function ReportForm() {
  const params = useSearchParams();
  const dispute = params.get("dispute") === "1";
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");
    setMessage("");
    const body = new FormData(form);
    body.set("kind", dispute ? "dispute" : "report");
    try {
      const response = await fetch("/api/report", { method: "POST", body });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Not sent.");
        return;
      }
      setMessage(dispute ? "Dispute sent." : "Report sent.");
      form.reset();
      setFileName("");
    } catch {
      setError("Not sent.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <h1>{dispute ? "Dispute a flag" : "Report"}</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input name="website" tabIndex={-1} autoComplete="off" className="absolute h-0 w-0 opacity-0" aria-hidden="true" />
        <label className="grid gap-1 text-sm">
          Type
          <select name="type" className="say-field" defaultValue={params.get("type") ?? "phone"}>
            <option value="phone">Phone number</option>
            <option value="url">Link</option>
            <option value="business">Business name</option>
            <option value="message">Message</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Number or link
          <input name="value" required className="say-field" defaultValue={params.get("value") ?? ""} />
        </label>
        {dispute ? null : (
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
        )}
        <label className="grid gap-1 text-sm">
          {dispute ? "What is wrong" : "What happened"}
          <textarea
            name={dispute ? "note" : "description"}
            required
            minLength={8}
            rows={4}
            placeholder="No names, PINs or codes."
            className="say-field py-3"
          />
        </label>
        {dispute ? null : (
          <label className="file-pick say-field">
            <input
              name="evidence"
              type="file"
              accept="image/*"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
            <span>{fileName || "Add screenshot (optional)"}</span>
          </label>
        )}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending" : dispute ? "Send dispute" : "Send report"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-miss">{error}</p> : null}
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      <SiteFooter />
    </PageShell>
  );
}
