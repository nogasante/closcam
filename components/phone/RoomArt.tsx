function Person({
  x,
  y,
  shirt,
  skin = "#e0b088",
}: {
  x: number;
  y: number;
  shirt: string;
  skin?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="14" fill={skin} />
      <circle cx="-5" cy="-1" r="1.4" fill="#2a2118" />
      <circle cx="5" cy="-1" r="1.4" fill="#2a2118" />
      <path d="M-6 6 Q0 10 6 6" fill="none" stroke="#2a2118" strokeWidth="1.2" />
      <path d="M-16 18 Q0 8 16 18 L18 46 Q0 40 -18 46 Z" fill={shirt} />
    </g>
  );
}

export function RoomArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 320 132" className="h-32 w-full" role="img" aria-label="">
      <Scene id={id} />
    </svg>
  );
}

function Scene({ id }: { id: string }) {
  if (id === "s01-data-payment-link") {
    return (
      <g>
        <rect width="320" height="132" fill="#145c45" />
        <rect y="96" width="320" height="36" fill="#0e3d2e" />
        <Person x={78} y={58} shirt="#f0b429" />
        <rect x="150" y="28" width="140" height="78" rx="12" fill="#10241c" />
        <rect x="162" y="40" width="88" height="16" rx="8" fill="#1c3330" />
        <rect x="178" y="62" width="96" height="16" rx="8" fill="#1f7a4d" />
        <text x="166" y="98" fill="#f0b429" fontSize="11" fontFamily="sans-serif">
          GHS 15
        </text>
      </g>
    );
  }
  if (id === "s02-hijacked-whatsapp") {
    return (
      <g>
        <rect width="320" height="132" fill="#1a3a32" />
        <Person x={64} y={62} shirt="#3d6b8a" />
        <Person x={250} y={62} shirt="#8a3d3d" />
        <rect x="108" y="36" width="104" height="58" rx="12" fill="#10241c" />
        <text x="118" y="58" fill="#f5f7fb" fontSize="11" fontFamily="sans-serif">
          Send GHS 800
        </text>
        <text x="118" y="76" fill="#f0b429" fontSize="11" fontFamily="sans-serif">
          055 not 024
        </text>
      </g>
    );
  }
  if (id === "s03-verification-code") {
    return (
      <g>
        <rect width="320" height="132" fill="#14324a" />
        <Person x={70} y={64} shirt="#f0b429" />
        <rect x="130" y="22" width="160" height="88" rx="14" fill="#0e1524" />
        <rect x="142" y="36" width="136" height="36" rx="8" fill="#1c2740" />
        <text x="150" y="58" fill="#f5f7fb" fontSize="13" fontFamily="sans-serif">
          验证码 382-194
        </text>
        <text x="150" y="92" fill="#9aa6bd" fontSize="11" fontFamily="sans-serif">
          Chinese registration text
        </text>
      </g>
    );
  }
  if (id === "s04-prize-call") {
    return (
      <g>
        <rect width="320" height="132" fill="#2a2148" />
        <Person x={86} y={64} shirt="#f0b429" />
        <rect x="150" y="34" width="70" height="64" rx="8" fill="#f0b429" />
        <rect x="162" y="46" width="46" height="28" rx="4" fill="#1a1408" />
        <circle cx="248" cy="58" r="26" fill="#3dce7c" />
        <text x="236" y="63" fill="#062216" fontSize="16" fontFamily="sans-serif">
          Win
        </text>
      </g>
    );
  }
  if (id === "s05-fake-care-pin") {
    return (
      <g>
        <rect width="320" height="132" fill="#1a2744" />
        <Person x={78} y={64} shirt="#d7d0c6" />
        <rect x="140" y="28" width="140" height="76" rx="12" fill="#0e1524" />
        <text x="156" y="52" fill="#f5f7fb" fontSize="12" fontFamily="sans-serif">
          PulsePay Care
        </text>
        <text x="156" y="74" fill="#ff5d5d" fontSize="12" fontFamily="sans-serif">
          Read your PIN
        </text>
        <rect x="156" y="82" width="28" height="10" rx="2" fill="#31425f" />
        <rect x="190" y="82" width="28" height="10" rx="2" fill="#31425f" />
        <rect x="224" y="82" width="28" height="10" rx="2" fill="#31425f" />
      </g>
    );
  }
  if (id === "s06-upgrade-limit") {
    return (
      <g>
        <rect width="320" height="132" fill="#1e2a22" />
        <Person x={70} y={66} shirt="#3dce7c" />
        <rect x="130" y="30" width="150" height="74" rx="10" fill="#0e1524" />
        <text x="146" y="54" fill="#f5f7fb" fontSize="12" fontFamily="sans-serif">
          Limit upgrade
        </text>
        <text x="146" y="76" fill="#f0b429" fontSize="14" fontFamily="sans-serif">
          Fee GHS 20
        </text>
        <path d="M250 78 L270 48 L290 78" fill="none" stroke="#3dce7c" strokeWidth="4" />
      </g>
    );
  }
  if (id === "s07-too-good-investment") {
    return (
      <g>
        <rect width="320" height="132" fill="#2a2418" />
        <Person x={64} y={68} shirt="#8a3d3d" />
        <rect x="120" y="24" width="170" height="86" rx="10" fill="#0e1524" />
        <path d="M136 88 L170 70 L200 76 L250 36" fill="none" stroke="#3dce7c" strokeWidth="4" />
        <text x="140" y="100" fill="#f0b429" fontSize="12" fontFamily="sans-serif">
          GHS 300 to 900
        </text>
      </g>
    );
  }
  if (id === "s08-sent-by-mistake") {
    return (
      <g>
        <rect width="320" height="132" fill="#1a3044" />
        <Person x={72} y={66} shirt="#3d6b8a" />
        <rect x="140" y="28" width="150" height="76" rx="12" fill="#f5f7fb" />
        <text x="152" y="52" fill="#121a2b" fontSize="11" fontFamily="sans-serif">
          You received
        </text>
        <text x="152" y="74" fill="#0e7a45" fontSize="16" fontFamily="sans-serif">
          GHS 850
        </text>
        <text x="152" y="92" fill="#5c6b82" fontSize="10" fontFamily="sans-serif">
          Wallet did not move
        </text>
      </g>
    );
  }
  if (id === "s09-agent-phone") {
    return (
      <g>
        <rect width="320" height="132" fill="#c47a3a" />
        <rect y="96" width="320" height="36" fill="#8a5430" />
        <rect x="150" y="36" width="120" height="70" rx="4" fill="#6b3e24" />
        <rect x="140" y="28" width="140" height="14" fill="#f0b429" />
        <text x="168" y="39" fill="#1a1408" fontSize="10" fontFamily="sans-serif">
          PULSEPAY
        </text>
        <Person x={70} y={64} shirt="#1a2744" />
        <rect x="96" y="70" width="16" height="28" rx="3" fill="#0e1524" />
      </g>
    );
  }
  return (
    <g>
      <rect width="320" height="132" fill="#3a1e28" />
      <Person x={70} y={66} shirt="#f0b429" />
      <rect x="140" y="26" width="146" height="80" rx="14" fill="#0e1524" />
      <text x="156" y="52" fill="#ff5d5d" fontSize="13" fontFamily="sans-serif">
        Pay GHS 200
      </text>
      <text x="156" y="72" fill="#f5f7fb" fontSize="11" fontFamily="sans-serif">
        You did not start this
      </text>
      <rect x="156" y="82" width="50" height="14" rx="4" fill="#3dce7c" />
    </g>
  );
}
