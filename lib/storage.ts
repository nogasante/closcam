import { useSyncExternalStore } from "react";
import type { Progress } from "./types";

export const PROGRESS_KEY = "closcam-progress";
export const CONSENT_KEY = "closcam-consent";
export const LAST_CHOICE_KEY = "closcam-last-choice";
export const LAST_DRILL_KEY = "closcam-last-drill";

const PROGRESS_EVENT = "closcam-progress";
const CONSENT_EVENT = "closcam-consent";

const EMPTY_PROGRESS: Progress = { results: {} };

function canUseBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readProgress(): Progress {
  if (!canUseBrowser()) {
    return EMPTY_PROGRESS;
  }
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  if (!raw) {
    return EMPTY_PROGRESS;
  }
  try {
    const parsed = JSON.parse(raw) as Progress;
    if (!parsed || typeof parsed !== "object" || !parsed.results) {
      return EMPTY_PROGRESS;
    }
    return { results: parsed.results };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function recordFirstTry(id: string, correct: boolean): void {
  const progress = readProgress();
  if (progress.results[id]) {
    return;
  }
  progress.results[id] = { correct, at: new Date().toISOString() };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function clearProgress(): void {
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(PROTECT_STEPS_KEY);
  window.localStorage.removeItem(PROTECT_KEY);
  window.dispatchEvent(new Event(PROGRESS_EVENT));
  window.dispatchEvent(new Event(EXTRA_EVENT));
}

export function hasConsent(): boolean {
  if (!canUseBrowser()) {
    return false;
  }
  return window.localStorage.getItem(CONSENT_KEY) === "yes";
}

export function setConsent(): void {
  window.localStorage.setItem(CONSENT_KEY, "yes");
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function rememberChoice(scenarioId: string, choiceId: string): void {
  window.sessionStorage.setItem(
    LAST_CHOICE_KEY,
    JSON.stringify({ scenarioId, choiceId }),
  );
}

export function readRememberedChoice(scenarioId: string): string | null {
  if (!canUseBrowser()) {
    return null;
  }
  const raw = window.sessionStorage.getItem(LAST_CHOICE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { scenarioId?: string; choiceId?: string };
    if (parsed.scenarioId === scenarioId && parsed.choiceId) {
      return parsed.choiceId;
    }
  } catch {
    return null;
  }
  return null;
}

export function rememberDrill(scenarioId: string): void {
  window.sessionStorage.setItem(LAST_DRILL_KEY, scenarioId);
}

export function readRememberedDrill(): string | null {
  if (!canUseBrowser()) {
    return null;
  }
  return window.sessionStorage.getItem(LAST_DRILL_KEY);
}

function subscribeProgress(onStoreChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useProgress(): Progress {
  const raw = useSyncExternalStore(
    subscribeProgress,
    () => window.localStorage.getItem(PROGRESS_KEY) ?? "",
    () => "",
  );
  if (!raw) {
    return EMPTY_PROGRESS;
  }
  try {
    const parsed = JSON.parse(raw) as Progress;
    if (!parsed?.results) {
      return EMPTY_PROGRESS;
    }
    return parsed;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function useConsent(): boolean {
  const raw = useSyncExternalStore(
    subscribeConsent,
    () => window.localStorage.getItem(CONSENT_KEY) ?? "",
    () => "",
  );
  return raw === "yes";
}

function subscribeMounted() {
  return () => {};
}

export function useMounted(): boolean {
  return useSyncExternalStore(subscribeMounted, () => true, () => false);
}

const CALL_KEY = "closcam-call";
const PROTECT_KEY = "closcam-protect";
const EXTRA_EVENT = "closcam-extra";

export function recordCall(correct: boolean): void {
  if (window.localStorage.getItem(CALL_KEY)) return;
  window.localStorage.setItem(
    CALL_KEY,
    JSON.stringify({ correct, at: new Date().toISOString() }),
  );
  window.dispatchEvent(new Event(EXTRA_EVENT));
}

export function recordProtect(): void {
  window.localStorage.setItem(PROTECT_KEY, "done");
  window.dispatchEvent(new Event(EXTRA_EVENT));
}

const PROTECT_STEPS_KEY = "closcam-protect-steps";

export type ProtectStepResult = { correct: boolean; at: string };

export function readProtectSteps(): Record<string, ProtectStepResult> {
  if (!canUseBrowser()) return {};
  const raw = window.localStorage.getItem(PROTECT_STEPS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { results?: Record<string, ProtectStepResult> };
    return parsed.results ?? {};
  } catch {
    return {};
  }
}

export function recordProtectStep(id: string, correct: boolean): void {
  const results = readProtectSteps();
  if (results[id]) return;
  results[id] = { correct, at: new Date().toISOString() };
  window.localStorage.setItem(PROTECT_STEPS_KEY, JSON.stringify({ results }));
  window.dispatchEvent(new Event(EXTRA_EVENT));
}

export function useProtectSteps(): Record<string, ProtectStepResult> {
  const raw = useSyncExternalStore(
    subscribeExtra,
    () => window.localStorage.getItem(PROTECT_STEPS_KEY) ?? "",
    () => "",
  );
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { results?: Record<string, ProtectStepResult> };
    return parsed.results ?? {};
  } catch {
    return {};
  }
}

function subscribeExtra(onStoreChange: () => void) {
  window.addEventListener(EXTRA_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(EXTRA_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useExtras(): { call: boolean | null; protect: boolean } {
  const raw = useSyncExternalStore(
    subscribeExtra,
    () =>
      `${window.localStorage.getItem(CALL_KEY) ?? ""}|${window.localStorage.getItem(PROTECT_KEY) ?? ""}`,
    () => "|",
  );
  const [callRaw, protectRaw] = raw.split("|");
  let call: boolean | null = null;
  if (callRaw) {
    try {
      call = Boolean((JSON.parse(callRaw) as { correct?: boolean }).correct);
    } catch {
      call = null;
    }
  }
  return { call, protect: protectRaw === "done" };
}
