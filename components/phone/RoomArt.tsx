const LABELS: Record<string, string> = {
  "s01-data-payment-link": "A SIM card beside a phone showing GHS 15",
  "s02-hijacked-whatsapp": "A handset with two different numbers",
  "s03-verification-code": "A phone with a text notification",
  "s04-prize-call": "A handset and a prize ticket",
  "s05-fake-care-pin": "A keypad with hidden digits",
  "s06-upgrade-limit": "A gauge and a GHS 20 coin",
  "s07-too-good-investment": "A small rising chart",
  "s08-sent-by-mistake": "A receipt for GHS 850",
  "s09-agent-phone": "A PulsePay kiosk",
  "s10-unexpected-prompt": "A phone asking to pay",
};

export function RoomArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 320 132" className="h-32 w-full" role="img" aria-label={LABELS[id] ?? "Training object"}>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7e2d8" />
          <stop offset="0.18" stopColor="#b7b2a8" />
          <stop offset="0.55" stopColor="#4a4e54" />
          <stop offset="1" stopColor="#23272c" />
        </linearGradient>
        <linearGradient id={`${id}-plastic`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3efe6" />
          <stop offset="1" stopColor="#c9c2b4" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe7a3" />
          <stop offset="1" stopColor="#d49212" />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a222a" />
          <stop offset="1" stopColor="#0c1116" />
        </linearGradient>
      </defs>
      <rect width="320" height="132" fill="#2a3038" />
      <ellipse cx="168" cy="118" rx="108" ry="14" fill="#14181c" opacity="0.55" />
      <Scene id={id} />
    </svg>
  );
}

function Phone({ x, y, gid, w = 78, h = 104 }: { x: number; y: number; gid: string; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill={`url(#${gid}-metal)`} />
      <rect x={x + 5} y={y + 6} width={w - 10} height={h - 12} rx="8" fill={`url(#${gid}-screen)`} />
      <rect x={x + w / 2 - 10} y={y + 9} width="20" height="4" rx="2" fill="#0c1116" />
    </g>
  );
}

function Scene({ id }: { id: string }) {
  if (id === "s01-data-payment-link") {
    return (
      <g>
        <g transform="translate(54 28) rotate(-8)">
          <rect width="70" height="86" rx="8" fill={`url(#${id}-plastic)`} />
          <rect x="10" y="12" width="28" height="22" rx="3" fill={`url(#${id}-gold)`} />
          <rect x="14" y="16" width="8" height="6" fill="#8a5a0b" />
          <rect x="24" y="16" width="8" height="6" fill="#8a5a0b" />
          <path d="M12 48h46M12 58h46M12 68h32" stroke="#8d877c" strokeWidth="2" />
        </g>
        <Phone x={176} y={16} gid={id} />
        <text x="190" y="62" fill="#f7f4ee" fontSize="13" fontFamily="sans-serif">
          GHS 15
        </text>
        <rect x="190" y="72" width="48" height="8" rx="4" fill="#f0b429" />
      </g>
    );
  }
  if (id === "s02-hijacked-whatsapp") {
    return (
      <g>
        <Phone x={36} y={16} gid={id} />
        <rect x="128" y="34" width="168" height="28" rx="8" fill="#243038" />
        <text x="140" y="53" fill="#f7f4ee" fontSize="13" fontFamily="sans-serif">
          024 318 2201
        </text>
        <rect x="128" y="74" width="168" height="28" rx="8" fill={`url(#${id}-gold)`} />
        <text x="140" y="93" fill="#1a1408" fontSize="13" fontFamily="sans-serif">
          055 111 4488
        </text>
      </g>
    );
  }
  if (id === "s03-verification-code") {
    return (
      <g>
        <Phone x={118} y={14} w={84} h={108} gid={id} />
        <rect x="132" y="36" width="56" height="34" rx="6" fill="#2c3a44" />
        <text x="140" y="50" fill="#d5dde6" fontSize="8" fontFamily="sans-serif">
          Message
        </text>
        <text x="140" y="62" fill="#f7f4ee" fontSize="9" fontFamily="sans-serif">
          验证码
        </text>
      </g>
    );
  }
  if (id === "s04-prize-call") {
    return (
      <g>
        <rect x="48" y="36" width="118" height="36" rx="18" fill={`url(#${id}-plastic)`} />
        <circle cx="70" cy="54" r="10" fill="#2a3038" />
        <circle cx="144" cy="54" r="10" fill="#2a3038" />
        <rect x="188" y="28" width="86" height="72" rx="8" fill={`url(#${id}-gold)`} />
        <text x="204" y="58" fill="#1a1408" fontSize="14" fontFamily="sans-serif">
          Prize
        </text>
        <text x="204" y="76" fill="#1a1408" fontSize="11" fontFamily="sans-serif">
          ticket
        </text>
      </g>
    );
  }
  if (id === "s05-fake-care-pin") {
    return (
      <g>
        <rect x="96" y="18" width="128" height="100" rx="16" fill={`url(#${id}-plastic)`} />
        <rect x="112" y="30" width="96" height="22" rx="6" fill="#0c1116" />
        {[0, 1, 2, 3].map((dot) => (
          <circle key={dot} cx={128 + dot * 18} cy="41" r="3" fill="#f0b429" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
          <rect key={key} x={114 + (key % 3) * 32} y={60 + Math.floor(key / 3) * 16} width="22" height="10" rx="3" fill="#3a414a" />
        ))}
      </g>
    );
  }
  if (id === "s06-upgrade-limit") {
    return (
      <g>
        <rect x="46" y="28" width="140" height="78" rx="16" fill={`url(#${id}-plastic)`} />
        <path d="M70 86 A46 46 0 0 1 162 86" fill="none" stroke="#8d877c" strokeWidth="8" strokeLinecap="round" />
        <path d="M70 86 A46 46 0 0 1 128 46" fill="none" stroke="#f0b429" strokeWidth="8" strokeLinecap="round" />
        <circle cx="230" cy="66" r="32" fill={`url(#${id}-gold)`} />
        <text x="214" y="71" fill="#1a1408" fontSize="14" fontFamily="sans-serif">
          20
        </text>
      </g>
    );
  }
  if (id === "s07-too-good-investment") {
    return (
      <g>
        <rect x="70" y="22" width="180" height="92" rx="16" fill={`url(#${id}-plastic)`} />
        <rect x="86" y="36" width="148" height="64" rx="8" fill="#0c1116" />
        <path d="M98 84 L124 72 L150 76 L186 44 L220 36" fill="none" stroke="#3dce7c" strokeWidth="3" />
        <circle cx="220" cy="36" r="4" fill="#f0b429" />
      </g>
    );
  }
  if (id === "s08-sent-by-mistake") {
    return (
      <g>
        <rect x="78" y="18" width="164" height="98" rx="10" fill="#f7f4ee" />
        <rect x="78" y="18" width="164" height="16" rx="8" fill="#e7e2d8" />
        <text x="94" y="58" fill="#5c6672" fontSize="12" fontFamily="sans-serif">
          Received
        </text>
        <text x="94" y="82" fill="#1a1408" fontSize="20" fontFamily="sans-serif">
          GHS 850
        </text>
        <path d="M94 96h132" stroke="#c9c2b4" strokeWidth="2" strokeDasharray="4 4" />
      </g>
    );
  }
  if (id === "s09-agent-phone") {
    return (
      <g>
        <rect x="86" y="40" width="148" height="68" rx="6" fill="#3a414a" />
        <rect x="74" y="26" width="172" height="22" rx="4" fill={`url(#${id}-gold)`} />
        <text x="112" y="42" fill="#1a1408" fontSize="12" fontFamily="sans-serif">
          PULSEPAY
        </text>
        <rect x="132" y="58" width="56" height="28" rx="4" fill="#0c1116" />
        <rect x="146" y="92" width="28" height="8" rx="2" fill="#c9c2b4" />
      </g>
    );
  }
  return (
    <g>
      <Phone x={118} y={14} w={84} h={108} gid={id} />
      <rect x="132" y="40" width="56" height="40" rx="6" fill="#3a1e22" />
      <text x="140" y="58" fill="#ffc9c4" fontSize="9" fontFamily="sans-serif">
        Pay
      </text>
      <text x="140" y="70" fill="#f7f4ee" fontSize="9" fontFamily="sans-serif">
        GHS 200
      </text>
    </g>
  );
}
