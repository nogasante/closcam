export function RoomArt({ kind }: { kind: string }) {
  const call = kind.includes("call");
  const scene = kind.includes("scene");
  const sms = kind.includes("sms");
  const bg = scene ? "#4a301c" : call ? "#1a2748" : "#12382e";
  return (
    <svg viewBox="0 0 320 128" className="h-32 w-full" aria-hidden="true">
      <rect width="320" height="128" fill={bg} />
      <circle cx="270" cy="24" r="40" fill="rgba(240,180,41,0.22)" />
      <rect x="22" y="16" width="78" height="96" rx="14" fill="#0e1524" stroke="#f0b429" strokeWidth="3" />
      <rect x="46" y="24" width="30" height="6" rx="3" fill="#243352" />
      {call ? (
        <>
          <circle cx="61" cy="58" r="14" fill="#f0b429" />
          <rect x="40" y="80" width="42" height="8" rx="4" fill="#f5f7fb" />
        </>
      ) : scene ? (
        <>
          <rect x="34" y="46" width="54" height="40" rx="4" fill="#c47a3a" />
          <rect x="30" y="40" width="62" height="10" fill="#f0b429" />
        </>
      ) : (
        <>
          <rect x="32" y="40" width="46" height="14" rx="6" fill="#1c3330" />
          <rect x="40" y="60" width="48" height="14" rx="6" fill={sms ? "#2f6fed" : "#1f7a4d"} />
        </>
      )}
      <rect x="124" y="46" width="150" height="12" rx="6" fill="rgba(255,255,255,0.85)" />
      <rect x="124" y="68" width="96" height="8" rx="4" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}
