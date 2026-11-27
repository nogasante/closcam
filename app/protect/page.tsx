import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Protection",
};

export default function ProtectPage() {
  return (
    <PageShell>
      <p className="text-[12px] tracking-wide text-muted uppercase">Protection</p>
      <h1 className="mt-2 text-[28px] font-medium tracking-tight">Lock the account</h1>
      <p className="mt-3 text-[15px] text-muted">
        Two-step verification, never forwarding a code, calling a friend on the saved line, and what to do if the account is already gone. The full exercise is next. The rooms already teach the two doors.
      </p>
      <div className="mt-6 grid gap-2">
        <Link href="/drills/s03-verification-code" className="btn btn-primary">
          Code from a saved contact
        </Link>
        <Link href="/call" className="btn btn-secondary">
          Security call
        </Link>
        <Link href="/" className="btn btn-secondary">
          Junction
        </Link>
      </div>
    </PageShell>
  );
}
