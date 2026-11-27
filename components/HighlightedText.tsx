import { scanFlags, type FlagReport } from "@/lib/flags";

export function HighlightedText({ text }: { text: string }) {
  const report = scanFlags(text);
  return (
    <div>
      <HighlightedBody text={text} report={report} />
      <FlagList report={report} />
    </div>
  );
}

export function HighlightedBody({ text, report }: { text: string; report: FlagReport }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  report.matches.forEach((match, index) => {
    if (match.start > cursor) {
      parts.push(text.slice(cursor, match.start));
    }
    parts.push(
      <mark key={`${match.start}-${index}`} className="flag-mark">
        {text.slice(match.start, match.end)}
      </mark>,
    );
    cursor = match.end;
  });
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }
  return <p className="whitespace-pre-wrap leading-relaxed">{parts}</p>;
}

export function FlagList({ report }: { report: FlagReport }) {
  if (report.labels.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted">
        No rules matched. That does not mean the message is safe. This tool only looks for a few
        patterns.
      </p>
    );
  }
  return (
    <ul className="mt-3 grid gap-2">
      {report.labels.map((label) => (
        <li key={label.id} className="rounded-xl bg-[#f6f1e8] px-3 py-2 text-sm">
          <span className="font-bold">{label.label}.</span> {label.detail}
        </li>
      ))}
    </ul>
  );
}
