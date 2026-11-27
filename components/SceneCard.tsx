export function SceneCard({
  place,
  speaker,
  line,
}: {
  place: string;
  speaker: string;
  line: string;
}) {
  return (
    <section className="sim-surface" aria-label={`Simulated scene at a ${place}`}>
      <div className="watermark" aria-hidden="true">
        SIMULATION
      </div>
      <div className="relative z-10 px-4 py-5">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">{place}</p>
        <p className="mt-3 text-sm font-semibold">{speaker}</p>
        <p className="mt-1 text-lg leading-snug">{line}</p>
      </div>
    </section>
  );
}
