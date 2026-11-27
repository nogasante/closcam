import { issueApiKey } from "@/lib/community/store";

export const runtime = "nodejs";

const buckets = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) buckets.set(ip, { count: 1, reset: now + 60 * 60_000 });
  else {
    bucket.count += 1;
    if (bucket.count > 5) return Response.json({ error: "Too many keys from this network." }, { status: 429 });
  }
  let body: { label?: unknown; website?: unknown };
  try {
    body = (await request.json()) as { label?: unknown; website?: unknown };
  } catch {
    return Response.json({ error: "Send a label." }, { status: 400 });
  }
  if (String(body.website ?? "").trim() !== "") return Response.json({ key: "" });
  const label = String(body.label ?? "").trim();
  if (label.length < 2) return Response.json({ error: "Name the key." }, { status: 400 });
  const key = await issueApiKey(label);
  return Response.json({ key });
}
