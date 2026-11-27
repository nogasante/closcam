import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ReportStrip } from "@/components/ReportStrip";
import { SOURCE_GROUPS } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Sources and help",
};

export default function SourcesPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">Sources and help</h1>
      <p className="mt-2 text-muted">
        CloScam is a training tool. It is not affiliated with, and is not approved by, any mobile
        money operator, bank, the Bank of Ghana, the Cyber Security Authority, or the Ghana Police
        Service.
      </p>
      <div className="mt-4">
        <ReportStrip />
      </div>
      <div className="mt-6 grid gap-6">
        {SOURCE_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-xl font-bold">{group.title}</h2>
            <ul className="mt-2 grid gap-3">
              {group.items.map((item) => (
                <li key={item.name} className="rounded-2xl border border-line bg-card px-4 py-3">
                  {item.url ? (
                    <a
                      href={item.url}
                      className="font-semibold text-green underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <p className="font-semibold">{item.name}</p>
                  )}
                  {item.note ? <p className="mt-1 text-sm">{item.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm">
        <Link href="/disclaimer" className="font-semibold text-green underline">
          Back to the disclaimer
        </Link>
      </p>
    </PageShell>
  );
}
