"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SiteFooter } from "@/components/SiteHeader";

const CURL = `curl -H "x-api-key: YOUR_KEY" \\
  "https://closcam.vercel.app/api/v1/lookup?type=phone&q=0550000000"`;

const JS = `const response = await fetch(
  "/api/v1/lookup?type=phone&q=" + encodeURIComponent("0550000000"),
  { headers: { "x-api-key": "YOUR_KEY" } },
);
const data = await response.json();`;

export function Developers() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ label: form.get("label"), website: form.get("website") }),
    });
    const data = (await response.json()) as { key?: string; error?: string };
    if (!response.ok || !data.key) {
      setError(data.error ?? "The key was not created.");
      return;
    }
    setKey(data.key);
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">Developers</h1>
      <p className="mt-3 text-muted">
        A free key can read community reports. It does not include who reported them, or any screenshot.
      </p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input name="website" tabIndex={-1} autoComplete="off" className="absolute h-0 w-0 opacity-0" aria-hidden="true" />
        <label className="grid gap-1 text-sm">
          Key name
          <input name="label" required className="say-field" placeholder="My project" />
        </label>
        <button type="submit" className="btn btn-primary">
          Create a free key
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-miss">{error}</p> : null}
      {key ? <p className="mt-4 break-all font-mono text-sm">Copy this key now. {key}</p> : null}
      <h2 className="mt-8 text-lg font-extrabold">curl</h2>
      <pre className="mt-2 overflow-x-auto rounded-xl bg-[#12161b] p-3 text-sm">{CURL}</pre>
      <h2 className="mt-6 text-lg font-extrabold">JavaScript</h2>
      <pre className="mt-2 overflow-x-auto rounded-xl bg-[#12161b] p-3 text-sm">{JS}</pre>
      <p className="mt-4 text-sm">
        <a className="underline" href="/api/v1/openapi.json">
          OpenAPI
        </a>
        . Spec path: /api/v1/lookup. Sixty reads an hour per key.
      </p>
      <p className="mt-4 text-sm text-muted">
        <Link href="/tools">Back to tools</Link>
      </p>
      <SiteFooter />
    </PageShell>
  );
}
