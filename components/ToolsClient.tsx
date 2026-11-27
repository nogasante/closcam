"use client";

import { useState } from "react";
import { scanFlags, type FlagReport } from "@/lib/flags";
import { useMounted } from "@/lib/storage";
import { FlagList, HighlightedBody } from "./HighlightedText";
import { PageShell } from "./PageShell";

type DrillScript = {
  id: string;
  title: string;
  script: string;
};

const DISCLAIMER =
  "This is a training aid, not a decision that a message is or is not a scam. It does not send your text anywhere.";

export function ToolsClient({ drills }: { drills: DrillScript[] }) {
  const mounted = useMounted();
  const [tab, setTab] = useState<"drill" | "paste">("drill");
  const [picked, setPicked] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [pasteReport, setPasteReport] = useState<FlagReport | null>(null);

  const remembered =
    mounted && typeof window !== "undefined"
      ? window.sessionStorage.getItem("closcam-last-drill")
      : null;
  const drillId = picked ?? remembered ?? drills[0]?.id ?? "";
  const selected = drills.find((drill) => drill.id === drillId) ?? drills[0];
  const drillReport = selected ? scanFlags(selected.script) : null;

  return (
    <PageShell banner={tab === "drill"}>
      <h1 className="text-3xl font-bold tracking-tight">Practice tools</h1>
      <p className="mt-2 text-muted">
        A rule list for urgency, a PIN or code, &quot;do not call&quot;, a payment link, a too-good
        price, and an unofficial-looking number.
      </p>
      <p className="mt-3 rounded-2xl border border-line bg-card px-3 py-3 text-sm">{DISCLAIMER}</p>
      <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="Practice tool">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "drill"}
          className={tab === "drill" ? "btn btn-primary" : "btn btn-secondary"}
          onClick={() => setTab("drill")}
        >
          This drill
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "paste"}
          className={tab === "paste" ? "btn btn-primary" : "btn btn-secondary"}
          onClick={() => setTab("paste")}
        >
          Paste a message
        </button>
      </div>

      {tab === "drill" && selected && drillReport ? (
        <div className="mt-4" role="tabpanel">
          <label htmlFor="drill-pick" className="text-sm font-bold">
            Simulated drill
          </label>
          <select
            id="drill-pick"
            className="mt-1 min-h-12 w-full rounded-xl border border-line bg-card px-3"
            value={selected.id}
            onChange={(event) => setPicked(event.target.value)}
          >
            {drills.map((drill) => (
              <option key={drill.id} value={drill.id}>
                {drill.title}
              </option>
            ))}
          </select>
          <div className="mt-3 rounded-2xl border border-line bg-card px-3 py-3">
            <HighlightedBody text={selected.script} report={drillReport} />
            <FlagList report={drillReport} />
          </div>
        </div>
      ) : null}

      {tab === "paste" ? (
        <form
          className="mt-4"
          role="tabpanel"
          onSubmit={(event) => {
            event.preventDefault();
            setPasteReport(scanFlags(paste));
          }}
        >
          <label htmlFor="paste" className="text-sm font-bold">
            Paste a message
          </label>
          <textarea
            id="paste"
            className="mt-1 min-h-36 w-full rounded-xl border border-line bg-card px-3 py-2"
            value={paste}
            onChange={(event) => setPaste(event.target.value)}
          />
          <div className="mt-2 grid gap-2">
            <button type="submit" className="btn btn-primary">
              Highlight possible flags
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setPaste("");
                setPasteReport(null);
              }}
            >
              Clear
            </button>
          </div>
          {pasteReport ? (
            <div className="mt-3 rounded-2xl border border-line bg-card px-3 py-3">
              <HighlightedBody text={paste} report={pasteReport} />
              <FlagList report={pasteReport} />
            </div>
          ) : null}
        </form>
      ) : null}
    </PageShell>
  );
}
