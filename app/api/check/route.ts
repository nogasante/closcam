import { generateObject } from "ai";
import { z } from "zod";
import { assessRules, extractHosts, extractNumbers, higherRisk, type CheckFlag, type Risk } from "@/lib/check/assess";
import { normalizePhone, normalizeUrl } from "@/lib/community/normalize";
import { lookupSubject, type CommunityLookup } from "@/lib/community/store";
import { REPORT_LINES } from "@/lib/sources";
import { gatewayModel, geminiLanguageModel } from "@/lib/server/gemini";

export const runtime = "nodejs";

const VerdictSchema = z.object({
  risk: z.enum(["low", "medium", "high"]),
  summary: z.string().max(320),
  flags: z
    .array(z.object({ label: z.string().max(80), detail: z.string().max(240) }))
    .max(6),
  next: z.string().max(320),
});

const buckets = new Map<string, { count: number; reset: number }>();

function limited(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded && forwarded.length > 0 ? forwarded : "local";
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 12;
}

function forModel(text: string): string {
  return text.replace(/(?<![\d])(\d{4,8})(?![\d])/g, "[digits]").slice(0, 2000);
}

function pack(
  risk: Risk,
  summary: string,
  flags: CheckFlag[],
  next: string,
  numbers: string[],
  community: CommunityLookup | null,
  source: "gemini" | "gateway" | "rules",
) {
  return {
    risk,
    summary,
    flags: flags.slice(0, 6),
    next,
    report: REPORT_LINES,
    numbers,
    community,
    source,
  };
}

async function communityFirst(numbers: string[], hosts: string[]): Promise<CommunityLookup | null> {
  const phone = numbers.map((item) => normalizePhone(item)).find((item): item is string => Boolean(item));
  if (phone) return lookupSubject("phone", phone);
  const host = hosts.map((item) => normalizeUrl(item)).find((item): item is string => Boolean(item));
  if (host) return lookupSubject("url", host);
  return null;
}

export async function POST(request: Request) {
  if (limited(request)) {
    return Response.json({ error: "Too many checks. Wait a minute and try again." }, { status: 429 });
  }

  let text = "";
  try {
    const body = (await request.json()) as { text?: unknown };
    text = String(body.text ?? "").trim().slice(0, 2000);
  } catch {
    return Response.json({ error: "Send the message as text." }, { status: 400 });
  }
  if (text.length < 2) {
    return Response.json({ error: "Paste a message, link, number, or name." }, { status: 400 });
  }

  const rules = await assessRules(text);
  const google = geminiLanguageModel();
  const gateway = google ? null : gatewayModel();
  const model = google ?? gateway;
  const numbers = extractNumbers(text);
  const community = await communityFirst(numbers, extractHosts(text));
  if (!model) return Response.json(pack(rules.risk, rules.summary, rules.flags, rules.next, numbers, community, "rules"));

  try {
    const { object } = await generateObject({
      model,
      schema: VerdictSchema,
      system:
        "You help someone in Ghana decide if a message, link, phone number, or business name looks like a scam. Be calm and specific. Do not invent official websites. Do not ask for a real PIN. Fictional examples only if you must name a company that is not real. Never claim a verdict is certain.",
      prompt: forModel(text),
      maxOutputTokens: 400,
      temperature: 0.2,
    });
    const flags = [...rules.flags];
    for (const flag of object.flags) {
      if (!flags.some((item) => item.label === flag.label)) flags.push(flag);
    }
    return Response.json(
      pack(higherRisk(rules.risk, object.risk), object.summary, flags, object.next, numbers, community, google ? "gemini" : "gateway"),
    );
  } catch {
    return Response.json(pack(rules.risk, rules.summary, rules.flags, rules.next, numbers, community, "rules"));
  }
}
