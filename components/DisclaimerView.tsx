"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setConsent } from "@/lib/storage";
import { PageShell } from "./PageShell";

export function DisclaimerView() {
  const router = useRouter();

  function accept() {
    setConsent();
    router.push("/hub");
  }

  return (
    <PageShell>
      <h1>Before you start</h1>
      <div className="mt-4 grid gap-3">
        <p>Nothing real is sent.</p>
        <p>Not a bank, a network, or an authority.</p>
        <p>No name, number, or PIN is stored.</p>
      </div>
      <div className="mt-5 grid gap-2">
        <button type="button" className="btn btn-primary" onClick={accept}>
          Start training
        </button>
        <Link href="/sources" className="inline-flex min-h-11 items-center text-sm text-muted">
          Read official sources first
        </Link>
      </div>
    </PageShell>
  );
}
