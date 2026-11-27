import { normalizeBusiness, normalizePhone, normalizeUrl } from "@/lib/community/normalize";
import { lookupSubject, validApiKey } from "@/lib/community/store";

export const runtime = "nodejs";

const buckets = new Map<string, { count: number; reset: number }>();

function cors(response: Response): Response {
  response.headers.set("access-control-allow-origin", "*");
  response.headers.set("access-control-allow-methods", "GET, OPTIONS");
  response.headers.set("access-control-allow-headers", "authorization, x-api-key, content-type");
  return response;
}

function limited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + 60 * 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 60;
}

function presentedKey(request: Request): string {
  const header = request.headers.get("x-api-key")?.trim();
  if (header) return header;
  const bearer = request.headers.get("authorization") ?? "";
  return bearer.replace(/^Bearer\s+/i, "").trim();
}

export function OPTIONS() {
  return cors(new Response(null, { status: 204 }));
}

export async function GET(request: Request) {
  const key = presentedKey(request);
  if (!key || !(await validApiKey(key))) {
    return cors(Response.json({ error: "A free API key is required." }, { status: 401 }));
  }
  if (limited(key)) {
    return cors(Response.json({ error: "This key has reached the hourly limit." }, { status: 429 }));
  }
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const query = url.searchParams.get("q") ?? "";
  const normalized =
    type === "phone" ? normalizePhone(query) : type === "url" ? normalizeUrl(query) : type === "business" ? normalizeBusiness(query) : null;
  if (!normalized || (type !== "phone" && type !== "url" && type !== "business")) {
    return cors(Response.json({ error: "Use type=phone, url, or business, and a q value." }, { status: 400 }));
  }
  const found = await lookupSubject(type, normalized);
  return cors(
    Response.json({
      status: found.status,
      reportCount: found.reportCount,
      scamTypes: found.scamTypes,
      lastReported: found.lastReported,
      disputeOpen: found.disputeOpen,
    }),
  );
}
