import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import type { SubjectType } from "./normalize";

export type FlagStatus = "flagged" | "reported_unverified" | "clean_unknown";

export type CommunityLookup = {
  status: FlagStatus;
  reportCount: number;
  scamTypes: string[];
  lastReported: string | null;
  disputeOpen: boolean;
};

export type NewReport = {
  type: SubjectType;
  key: string;
  scamType: string;
  description: string;
  hasEvidence: boolean;
  reporterHash: string;
};

type Row = NewReport & { at: string };
type Dispute = { type: SubjectType; key: string; note: string; at: string };
type KeyRow = { hash: string; label: string; at: string };
type Db = { reports: Row[]; disputes: Dispute[]; keys: KeyRow[] };

let memory: Db = { reports: [], disputes: [], keys: [] };

function statusFrom(count: number): FlagStatus {
  if (count >= 3) return "flagged";
  if (count >= 1) return "reported_unverified";
  return "clean_unknown";
}

function filePath(): string {
  return path.join(process.cwd(), ".data", "community-flags.json");
}

function loadLocal(): Db {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath(), "utf8")) as Db;
    if (!Array.isArray(parsed.reports) || !Array.isArray(parsed.disputes)) return memory;
    if (!Array.isArray(parsed.keys)) parsed.keys = [];
    memory = parsed;
    return parsed;
  } catch {
    return memory;
  }
}

function saveLocal(db: Db) {
  memory = db;
  try {
    fs.mkdirSync(path.dirname(filePath()), { recursive: true });
    fs.writeFileSync(filePath(), JSON.stringify(db));
  } catch {
    memory = db;
  }
}

function configured(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function rest(pathAndQuery: string, init?: RequestInit): Promise<Response | null> {
  const remote = configured();
  if (!remote) return null;
  try {
    return await fetch(`${remote.url}/rest/v1/${pathAndQuery}`, {
      ...init,
      headers: {
        apikey: remote.key,
        authorization: `Bearer ${remote.key}`,
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return null;
  }
}

export function reporterHash(ip: string): string {
  const salt = process.env.COMMUNITY_REPORTER_SALT?.trim() || "closcam-dev";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 24);
}

export async function addReport(input: NewReport): Promise<void> {
  const remote = await rest("community_reports", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({
      subject_type: input.type,
      subject_key: input.key,
      scam_type: input.scamType,
      description: input.description,
      has_evidence: input.hasEvidence,
      reporter_hash: input.reporterHash,
    }),
  });
  if (remote?.ok) return;
  const db = loadLocal();
  db.reports.push({ ...input, at: new Date().toISOString() });
  saveLocal(db);
}

export async function openDispute(type: SubjectType, key: string, note: string): Promise<void> {
  const remote = await rest("community_disputes", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ subject_type: type, subject_key: key, note }),
  });
  if (remote?.ok) return;
  const db = loadLocal();
  db.disputes.push({ type, key, note, at: new Date().toISOString() });
  saveLocal(db);
}

export async function lookupSubject(type: SubjectType, key: string): Promise<CommunityLookup> {
  const remote = await rest(
    `community_reports?subject_type=eq.${encodeURIComponent(type)}&subject_key=eq.${encodeURIComponent(key)}&select=reporter_hash`,
  );
  if (remote?.ok) {
    const rows = (await remote.json()) as { reporter_hash?: string; scam_type?: string; created_at?: string }[];
    const count = new Set(rows.map((row) => row.reporter_hash).filter(Boolean)).size;
    const disputes = await rest(
      `community_disputes?subject_type=eq.${encodeURIComponent(type)}&subject_key=eq.${encodeURIComponent(key)}&select=id&limit=1`,
    );
    const disputeRows = disputes?.ok ? ((await disputes.json()) as unknown[]) : [];
    const times = rows.map((row) => row.created_at).filter((item): item is string => Boolean(item));
    return {
      status: statusFrom(count),
      reportCount: count,
      scamTypes: [...new Set(rows.map((row) => row.scam_type).filter((item): item is string => Boolean(item)))],
      lastReported: times.sort().at(-1) ?? null,
      disputeOpen: disputeRows.length > 0,
    };
  }
  const db = loadLocal();
  const rows = db.reports.filter((row) => row.type === type && row.key === key);
  const hashes = new Set(rows.map((row) => row.reporterHash));
  const disputeOpen = db.disputes.some((row) => row.type === type && row.key === key);
  return {
    status: statusFrom(hashes.size),
    reportCount: hashes.size,
    scamTypes: [...new Set(rows.map((row) => row.scamType))],
    lastReported: rows.map((row) => row.at).sort().at(-1) ?? null,
    disputeOpen,
  };
}

export async function issueApiKey(label: string): Promise<string> {
  const raw = `closcam_${createHash("sha256").update(`${Date.now()}:${Math.random()}`).digest("hex").slice(0, 32)}`;
  const hash = createHash("sha256").update(raw).digest("hex");
  const remote = await rest("community_api_keys", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({ key_hash: hash, label: label.slice(0, 60) }),
  });
  if (!remote?.ok) {
    const db = loadLocal();
    db.keys.push({ hash, label: label.slice(0, 60), at: new Date().toISOString() });
    saveLocal(db);
  }
  return raw;
}

export async function validApiKey(raw: string): Promise<boolean> {
  const hash = createHash("sha256").update(raw).digest("hex");
  const remote = await rest(`community_api_keys?key_hash=eq.${hash}&select=id&limit=1`);
  if (remote?.ok) {
    const rows = (await remote.json()) as unknown[];
    return rows.length > 0;
  }
  return loadLocal().keys.some((row) => row.hash === hash);
}
