import { communityLists, type CommunityHit } from "./lists";

export type Risk = "low" | "medium" | "high";

export type CheckFlag = {
  label: string;
  detail: string;
};

export type RulesVerdict = {
  risk: Risk;
  summary: string;
  flags: CheckFlag[];
  next: string;
  hits: CommunityHit[];
};

const OFFICIAL_HOSTS = [
  "mtn.com.gh",
  "telecel.com.gh",
  "at.com.gh",
  "gcb.com.gh",
  "ecobank.com",
  "stanbicbank.com.gh",
  "calbank.net",
  "absa.com.gh",
  "bog.gov.gh",
  "csa.gov.gh",
  "ghana.gov.gh",
  "police.gov.gh",
];

const BRANDS = ["mtn", "telecel", "gcb", "ecobank", "stanbic", "calbank", "absa", "momo"];

const NEW_TLDS = new Set([
  "xyz",
  "top",
  "click",
  "online",
  "shop",
  "live",
  "site",
  "icu",
  "buzz",
  "tk",
  "gq",
  "ml",
  "cf",
  "rest",
  "loan",
  "support",
]);

const RANK: Record<Risk, number> = { low: 0, medium: 1, high: 2 };

export function higherRisk(a: Risk, b: Risk): Risk {
  return RANK[a] >= RANK[b] ? a : b;
}

function hostOf(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const host = new URL(withScheme).hostname.toLowerCase().replace(/\.$/, "");
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

export function extractHosts(text: string): string[] {
  const found = text.match(/https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}/gi) ?? [];
  const hosts = found.map((item) => hostOf(item.replace(/[),.;]+$/, ""))).filter((item): item is string => Boolean(item));
  return [...new Set(hosts)];
}

export function extractNumbers(text: string): string[] {
  const found = text.match(/(?:\+233|0)(?:[\s-]?\d){8,10}/g) ?? [];
  return [...new Set(found.map((item) => item.replace(/\s+/g, " ")))];
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const next = a[i - 1] === b[j - 1] ? prev : Math.min(prev, row[j], row[j - 1]) + 1;
      prev = row[j];
      row[j] = next;
    }
  }
  return row[b.length] ?? a.length;
}

function labelOf(host: string): string {
  const parts = host.split(".").filter(Boolean);
  if (parts.length >= 3 && parts[parts.length - 1] === "gh") return parts[parts.length - 3] ?? host;
  return parts[0] ?? host;
}

function official(host: string): boolean {
  return OFFICIAL_HOSTS.some((item) => host === item || host.endsWith(`.${item}`));
}

export function urlFlags(text: string): CheckFlag[] {
  const flags: CheckFlag[] = [];
  for (const host of extractHosts(text)) {
    if (official(host)) continue;
    if (host.startsWith("xn--") || host.includes("xn--")) {
      flags.push({
        label: "Punycode domain",
        detail: `${host} uses punycode. That is a common way to disguise a lookalike address.`,
      });
    }
    const tld = host.split(".").pop() ?? "";
    if (NEW_TLDS.has(tld)) {
      flags.push({
        label: "Unusual domain ending",
        detail: `${host} uses .${tld}. Official Ghana bank and network sites do not use that ending.`,
      });
    }
    const label = labelOf(host);
    for (const known of OFFICIAL_HOSTS) {
      const knownLabel = labelOf(known);
      if (label !== knownLabel && distance(label, knownLabel) > 0 && distance(label, knownLabel) <= 2) {
        flags.push({
          label: "Lookalike domain",
          detail: `${host} is close to ${known}, but it is not that site.`,
        });
        break;
      }
    }
    if (BRANDS.some((brand) => label.includes(brand) || host.includes(`${brand}-`) || host.includes(`${brand}.`))) {
      if (!flags.some((flag) => flag.detail.includes(host))) {
        flags.push({
          label: "Name on the wrong site",
          detail: `${host} uses a familiar company name on a host that is not their official site.`,
        });
      }
    }
  }
  return flags;
}

export async function assessRules(text: string): Promise<RulesVerdict> {
  const flags: CheckFlag[] = [...urlFlags(text)];
  const value = text.toLowerCase();

  if (/\b(pin|otp|password|verification code|one-time code|whatsapp code)\b/i.test(text)) {
    flags.push({
      label: "Asks for a PIN or code",
      detail: "A real bank or network will not ask you to read a PIN, OTP, or WhatsApp code.",
    });
  }
  if (/\b(urgent|immediately|in \d+ minutes|blocked|freeze|expires?|hurry|now)\b/i.test(value)) {
    flags.push({
      label: "Urgency",
      detail: "The message pushes you to act before you can check.",
    });
  }
  if (/\b(send|transfer|pay).{0,40}(first|before)|pay first|send .{0,20} first\b/i.test(value)) {
    flags.push({
      label: "Send money first",
      detail: "You are asked to pay before anything is delivered.",
    });
  }
  if (/\b(won|prize|guaranteed|double your|no risk)\b/i.test(value)) {
    flags.push({
      label: "Too-good offer",
      detail: "The offer is a prize, a guarantee, or a return that is hard to believe.",
    });
  }
  const numbers = extractNumbers(text);
  if (numbers.length > 0 && /\b(bank|security|care|support|mtn|telecel|wallet)\b/i.test(text)) {
    flags.push({
      label: "Personal-looking number",
      detail: `${numbers[0]} is a full mobile number, not a short official line such as 292 or 100.`,
    });
  }

  const hits = (
    await Promise.all(
      communityLists.map((list) => list.lookup({ numbers, domains: extractHosts(text) })),
    )
  ).flat();
  for (const hit of hits) {
    flags.push({ label: `Listed by ${hit.source}`, detail: hit.note });
  }

  let risk: Risk = "low";
  if (flags.some((flag) => /punycode|lookalike|pin or code|send money/i.test(flag.label))) risk = "high";
  else if (flags.length >= 2) risk = "high";
  else if (flags.length === 1) risk = "medium";

  const summary =
    risk === "low"
      ? "Nothing in this text matches the usual tricks. Still confirm it on an official channel before you pay or share a code."
      : risk === "medium"
        ? "One warning stands out. Do not pay or share a code until you have checked it yourself."
        : "This matches several common scam patterns. Do not pay, and do not share a code.";

  const next =
    risk === "low"
      ? "If money or a code is involved, open the official app or dial the short code you already know. Do not use a link from the message."
      : "Stop. Do not reply with a code or send money. Call the person on the number you already saved, or use an official short code.";

  return { risk, summary, flags, next, hits };
}
