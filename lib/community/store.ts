import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

function remote(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function reporterHash(ip: string): string {
  const salt = process.env.COMMUNITY_REPORTER_SALT?.trim() || "closcam-dev";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 24);
}

export async function addReport(input: NewReport): Promise<void> {
  const db = remote();
  if (db) {
    const { error } = await db.rpc("submit_report", {
      p_subject_type: input.type,
      p_subject_key: input.key,
      p_scam_type: input.scamType,
      p_description: input.description,
      p_has_evidence: input.hasEvidence,
      p_reporter_hash: input.reporterHash,
    });
    if (error) throw new Error("Report was not stored.");
    return;
  }
  const local = loadLocal();
  if (!local.reports.some((row) => row.type === input.type && row.key === input.key && row.reporterHash === input.reporterHash)) {
    local.reports.push({ ...input, at: new Date().toISOString() });
    saveLocal(local);
  }
}

export async function openDispute(type: SubjectType, key: string, note: string, reporterHashValue: string): Promise<void> {
  const db = remote();
  if (db) {
    const { error } = await db.rpc("submit_dispute", {
      p_subject_type: type,
      p_subject_key: key,
      p_note: note,
      p_reporter_hash: reporterHashValue,
    });
    if (error) throw new Error("Dispute was not stored.");
    return;
  }
  const local = loadLocal();
  if (!local.disputes.some((row) => row.type === type && row.key === key && row.note === note)) {
    local.disputes.push({ type, key, note, at: new Date().toISOString() });
    saveLocal(local);
  }
}

export async function lookupSubject(type: SubjectType, key: string): Promise<CommunityLookup> {
  const db = remote();
  if (db) {
    const { data, error } = await db.rpc("lookup_flag", {
      p_subject_type: type,
      p_subject_key: key,
    });
    if (error || !data || typeof data !== "object") throw new Error("Lookup failed.");
    const row = data as CommunityLookup;
    return {
      status: row.status,
      reportCount: row.reportCount,
      scamTypes: row.scamTypes ?? [],
      lastReported: row.lastReported,
      disputeOpen: Boolean(row.disputeOpen),
    };
  }
  const local = loadLocal();
  const rows = local.reports.filter((row) => row.type === type && row.key === key);
  const hashes = new Set(rows.map((row) => row.reporterHash));
  const disputeOpen = local.disputes.some((row) => row.type === type && row.key === key);
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
  const db = remote();
  if (db) {
    const { error } = await db.rpc("issue_api_key", { p_key_hash: hash, p_label: label.slice(0, 60) });
    if (error) throw new Error("Key was not stored.");
    return raw;
  }
  const local = loadLocal();
  local.keys.push({ hash, label: label.slice(0, 60), at: new Date().toISOString() });
  saveLocal(local);
  return raw;
}

export async function validApiKey(raw: string): Promise<boolean> {
  const hash = createHash("sha256").update(raw).digest("hex");
  const db = remote();
  if (db) {
    const { data, error } = await db.rpc("verify_api_key", { p_key_hash: hash });
    if (error) return false;
    return data === true;
  }
  return loadLocal().keys.some((row) => row.hash === hash);
}
