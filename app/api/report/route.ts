import { addReport, openDispute, reporterHash } from "@/lib/community/store";
import { normalizeSubject, stripPersonal, type SubjectType } from "@/lib/community/normalize";

export const runtime = "nodejs";

const TYPES = new Set<SubjectType>(["phone", "url", "business", "message"]);
const SCAM_TYPES = new Set(["payment", "code", "impersonation", "job", "other"]);
const buckets = new Map<string, { count: number; reset: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded && forwarded.length > 0 ? forwarded : "local";
}

function limited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + 60 * 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 8;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (limited(ip)) {
    return Response.json({ error: "Too many reports. Try again later." }, { status: 429 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Send the report as a form." }, { status: 400 });
  }
  if (String(form.get("website") ?? "").trim() !== "") {
    return Response.json({ ok: true });
  }
  const kind = String(form.get("kind") ?? "");
  if (kind === "dispute") {
    const type = String(form.get("type") ?? "") as SubjectType;
    const key = normalizeSubject(type, String(form.get("value") ?? ""));
    const note = stripPersonal(String(form.get("note") ?? ""));
    if (!TYPES.has(type) || !key || note.length < 8) {
      return Response.json({ error: "Say what was flagged and why it is wrong." }, { status: 400 });
    }
    await openDispute(type, key, note);
    return Response.json({ ok: true });
  }
  const type = String(form.get("type") ?? "") as SubjectType;
  const key = normalizeSubject(type, String(form.get("value") ?? ""));
  const scamType = String(form.get("scamType") ?? "");
  const description = stripPersonal(String(form.get("description") ?? ""));
  const file = form.get("evidence");
  const hasEvidence = file instanceof File && file.size > 0 && file.size < 1_500_000 && file.type.startsWith("image/");
  if (!TYPES.has(type) || !key || !SCAM_TYPES.has(scamType) || description.length < 8) {
    return Response.json({ error: "Add the item, a type, and a short description." }, { status: 400 });
  }
  await addReport({
    type,
    key,
    scamType,
    description,
    hasEvidence,
    reporterHash: reporterHash(ip),
  });
  return Response.json({ ok: true, stored: key });
}
