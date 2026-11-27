export function CallScript({
  callerId,
  callerLabel,
  lines,
  visible,
}: {
  callerId: string;
  callerLabel: string;
  lines: string[];
  visible: number;
}) {
  const shown = lines.slice(0, visible);
  return (
    <section className="sim-surface" aria-label={`Simulated call from ${callerLabel}`}>
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 bg-[#161b22] px-4 py-6 text-center text-[#f7f4ee]">
        <p className="text-xs font-bold tracking-wide text-[#d7c4c4] uppercase">
          Incoming simulation
        </p>
        <p className="mt-3 text-2xl font-semibold">{callerLabel}</p>
        <p className="mt-1 font-mono text-sm text-[#d9e2ea]">{callerId}</p>
        <p className="mt-4 text-sm text-[#c9d3dc]">No real call is placed. There is no microphone.</p>
      </div>
      <div className="relative z-10 space-y-3 px-3 py-3" aria-live="polite">
        {shown.map((line, index) => (
          <p key={index} className="rounded-2xl bg-[#f6f1e8] px-3 py-3">
            <span className="mb-1 block text-xs font-bold text-muted">{callerLabel}</span>
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
