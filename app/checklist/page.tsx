import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { QuietFooter } from "@/components/ReportStrip";
import { CHECKLIST } from "@/lib/checklist";

export const metadata: Metadata = {
  title: "Checklist",
};

export default function ChecklistPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">Checklist</h1>
      <p className="mt-2 text-muted">
        Short rules you can reuse after the drills. This is training, not a promise that you will
        not be scammed.
      </p>
      <ol className="mt-4 grid gap-3">
        {CHECKLIST.map((item, index) => (
          <li key={item.title} className="rounded-2xl border border-line bg-card px-4 py-3">
            <p className="font-bold">
              {index + 1}. {item.title}
            </p>
            <p className="mt-1 text-sm">{item.detail}</p>
            <a
              href={item.sourceUrl}
              className="mt-2 inline-flex min-h-11 items-center font-semibold text-green underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.sourceName}
            </a>
          </li>
        ))}
      </ol>
      <div className="-mx-4 mt-6">
        <QuietFooter />
      </div>
    </PageShell>
  );
}
