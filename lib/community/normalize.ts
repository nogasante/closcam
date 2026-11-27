export type SubjectType = "phone" | "url" | "business" | "message";

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+233${digits.slice(1)}`;
  if (digits.length === 9) return `+233${digits}`;
  return null;
}

export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withScheme);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return `${host}${path}`.slice(0, 180);
  } catch {
    return null;
  }
}

export function normalizeBusiness(input: string): string | null {
  const value = input.trim().toLowerCase().replace(/\s+/g, " ");
  if (value.length < 2 || value.length > 80) return null;
  return value;
}

export function normalizeSubject(type: SubjectType, input: string): string | null {
  if (type === "phone") return normalizePhone(input);
  if (type === "url") return normalizeUrl(input);
  if (type === "business") return normalizeBusiness(input);
  const text = input.trim().replace(/\s+/g, " ");
  return text.length >= 8 ? text.slice(0, 280) : null;
}

export function stripPersonal(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/(?:\+?\d[\d\s-]{7,}\d)/g, "[number]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}
