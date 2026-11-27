export type FlagRule = {
  id: string;
  label: string;
  detail: string;
  pattern: RegExp;
};

export type FlagMatch = {
  id: string;
  label: string;
  start: number;
  end: number;
  text: string;
};

export type FlagLabel = {
  id: string;
  label: string;
  detail: string;
};

export type FlagReport = {
  matches: FlagMatch[];
  labels: FlagLabel[];
};

export const FLAG_RULES: FlagRule[] = [
  {
    id: "pin",
    label: "asks for a PIN or code",
    detail: "The text asks for a PIN, OTP, password, or a verification code.",
    pattern:
      /\b(PINs?|OTPs?|password|verification codes?|6-digit code|one-time code|whatsapp code|the code)\b/gi,
  },
  {
    id: "no-call",
    label: "asks you not to call",
    detail: "The text tells you not to call.",
    pattern: /\b(do not call|don'?t call|dont call)\b/gi,
  },
  {
    id: "link",
    label: "payment link",
    detail: "The text includes a web link or tells you to open a payment request.",
    pattern:
      /((https?:\/\/)?[\w-]+\.(online|com|net|xyz|app)(\/\S*)?)|(\btap this\b)|(\bpayment link\b)/gi,
  },
  {
    id: "deal",
    label: "too-good price",
    detail:
      "The text promises a prize, a fast return, or a price that looks far too low.",
    pattern:
      /(\bonly GHS\b|\bno risk\b|\bwon\b|\bprize\b|\bGHS\s?[\d,]+\s+back\b|\btoo good\b)/gi,
  },
  {
    id: "number",
    label: "unofficial-looking number",
    detail:
      "A personal-looking phone number appears. A random mobile number is not an official wallet menu.",
    pattern: /(?:\+233|0)(?:[\s-]?\d){8,10}/g,
  },
  {
    id: "urgency",
    label: "urgency",
    detail:
      "The text pushes you to act fast, or it threatens a block, a freeze, or removal.",
    pattern:
      /\b(urgent|urgently|emergency|immediately|tonight|midnight|expires?|blocked|freeze|hurry|asap|removed|report you|\bnow\b|in \d+ minutes|closes in \d+ minutes)\b/gi,
  },
];

export function scanFlags(input: string): FlagReport {
  const occupied: boolean[] = Array.from({ length: input.length }, () => false);
  const matches: FlagMatch[] = [];

  for (const rule of FLAG_RULES) {
    rule.pattern.lastIndex = 0;
    let found = rule.pattern.exec(input);
    while (found) {
      const text = found[0];
      const start = found.index;
      const end = start + text.length;
      const overlaps = occupied.slice(start, end).some(Boolean);
      if (!overlaps && text.trim().length > 0) {
        for (let i = start; i < end; i += 1) {
          occupied[i] = true;
        }
        matches.push({
          id: rule.id,
          label: rule.label,
          start,
          end,
          text,
        });
      }
      if (found[0].length === 0) {
        rule.pattern.lastIndex += 1;
      }
      found = rule.pattern.exec(input);
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const labels: FlagLabel[] = [];
  for (const rule of FLAG_RULES) {
    if (matches.some((match) => match.id === rule.id)) {
      labels.push({ id: rule.id, label: rule.label, detail: rule.detail });
    }
  }

  return { matches, labels };
}
