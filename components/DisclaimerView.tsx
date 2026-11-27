"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setConsent } from "@/lib/storage";
import { PageShell } from "./PageShell";

export function DisclaimerView() {
  const router = useRouter();

  function accept() {
    setConsent();
    router.push("/");
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">Before you start</h1>
      <div className="mt-4 grid gap-3 text-[1.02rem]">
        <p>CloScam is a training simulator. No real messages, calls or payments are sent.</p>
        <p>
          This app is not affiliated with, and is not approved by, any mobile money operator, bank,
          the Bank of Ghana, the Cyber Security Authority or the Ghana Police Service.
        </p>
        <p>Completing the drills does not guarantee you will not be scammed.</p>
        <p>We do not ask for your name, number, PIN or contacts, and we do not store personal data.</p>
        <p>You will see fictional names such as PulsePay and SwiftBundle. They are not real companies.</p>
      </div>
      <div className="mt-5 grid gap-2">
        <button type="button" className="btn btn-primary" onClick={accept}>
          I understand, start training
        </button>
        <Link href="/sources" className="btn btn-secondary">
          Read official sources first
        </Link>
      </div>
    </PageShell>
  );
}
