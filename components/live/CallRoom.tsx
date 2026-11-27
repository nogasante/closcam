"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  displayUtterance,
  judgeUtterance,
  scriptedLine,
  type Persona,
  type Turn,
} from "@/lib/call/engine";
import { blip, startRing, stopRing } from "@/lib/live/sound";
import { recordCall } from "@/lib/storage";
import { ConsoleFrame, LeaveLink, MobileBrief, type FlagEntry } from "@/components/console/ConsoleFrame";
import { ReportStrip } from "@/components/ReportStrip";

const OTP = "【WhatsApp】你的验证码是 382-194，请勿告诉他人。";

const PERSONAS: { id: Persona; label: string }[] = [
  { id: "security", label: "PulseLink security" },
  { id: "prize", label: "Prize desk" },
  { id: "care", label: "PulsePay Care" },
];

export function CallRoom() {
  const reduce = useReducedMotion();
  const [persona, setPersona] = useState<Persona>("security");
  const [ringing, setRinging] = useState(false);
  const [active, setActive] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState<"script" | "model" | null>(null);
  const [ended, setEnded] = useState<"win" | "loss" | null>(null);
  const [listening, setListening] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!ringing) {
      stopRing();
      return;
    }
    startRing();
    return () => stopRing();
  }, [ringing]);

  useEffect(() => {
    if (!active || ended || reduce) return;
    const timer = window.setInterval(() => setSeconds((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [active, ended, reduce]);

  const flags: FlagEntry[] = [];
  if (persona === "security" && active) {
    flags.push({
      label: "Unfamiliar language",
      detail: "A registration text arrived. You cannot read it.",
    });
  }
  if (turns.some((turn) => turn.role === "scammer" && /pin|code|fee/i.test(turn.text))) {
    flags.push({
      label: "Asks for a PIN or code",
      detail: "The caller wants a code, a PIN, or a fee.",
    });
  }

  async function reply(raw: string) {
    const shown = displayUtterance(raw);
    const verdict = judgeUtterance(raw);
    const history = [...turns, { role: "user" as const, text: shown }];
    setTurns(history);
    setDraft("");
    setWaiting(true);
    if (verdict === "win") {
      setWaiting(false);
      recordCall(true);
      setEnded("win");
      return;
    }
    if (verdict === "loss") {
      setWaiting(false);
      recordCall(false);
      setEnded("loss");
      return;
    }
    let line = scriptedLine(persona, history);
    let from: "script" | "model" = "script";
    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          persona,
          history: history.map((turn) => ({ role: turn.role, text: turn.text })),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { line?: string; source?: "script" | "model" };
        if (data.line) line = data.line;
        if (data.source === "model") from = "model";
      }
    } catch {
      from = "script";
    }
    setSource(from);
    setWaiting(false);
    blip();
    setTurns((current) => [...current, { role: "scammer", text: line }]);
    speak(line, reduce);
  }

  function speak(line: string, quiet: boolean | null) {
    if (quiet || !window.speechSynthesis) return;
    if (window.localStorage.getItem("closcam-sound") === "off") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  function listen() {
    const Speech = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Speech) return;
    const recognition = new Speech();
    recognition.lang = "en-GH";
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      setListening(false);
      if (text) void reply(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  function hangUp() {
    stopRing();
    window.speechSynthesis?.cancel();
    recordCall(true);
    setEnded("win");
    setRinging(false);
    setActive(false);
  }

  return (
    <ConsoleFrame
      kicker="Live call"
      title="Route A. A security call"
      brief="Someone claiming to be PulseLink security says they sent a code to protect your account. The text is in Chinese because the registration was started on a phone set to Chinese. The code is a WhatsApp registration code. Route B is a friend's chat asking you to send that same kind of code."
      objective="Hang up, or refuse. Do not read a code to a caller."
      pressureLabel="They want the code on this call"
      pressureLeft={(seconds / 45) * 100}
      flags={flags}
      progress={source ? `Caller line: ${source === "model" ? "model" : "scripted fallback"}.` : "Scripted fallback is always available."}
      action={<LeaveLink />}
    >
      <div className="lg:hidden">
        <MobileBrief objective="Hang up. Do not read a code to a caller." flags={flags} />
      </div>
      <div className="flex min-h-[calc(100dvh-120px)] flex-col lg:phone lg:min-h-[680px]">
        <div className="phone-screen min-h-0 flex-1 lg:min-h-[640px]">
          <header className="border-b border-line px-3 py-3">
            <p className="text-[12px] text-muted">AI simulation. Never share a real PIN or a real code.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PERSONAS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={active || ringing}
                  className={`min-h-11 border px-3 text-[13px] ${persona === item.id ? "border-accent text-ink" : "border-line text-muted"}`}
                  onClick={() => setPersona(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {!ringing && !active && !ended ? (
              <button type="button" className="btn btn-primary" onClick={() => setRinging(true)}>
                Start the incoming call
              </button>
            ) : null}
            {ringing ? (
              <div>
                <p className="text-[13px] tracking-wide text-muted uppercase">Incoming</p>
                <p className="mt-2 text-[28px] leading-none font-medium tracking-tight">
                  {PERSONAS.find((item) => item.id === persona)?.label}
                </p>
                <p className="mono mt-2 text-[13px] text-muted">+233 24 550 0193</p>
                <div className="mt-6 grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      stopRing();
                      setRinging(false);
                      setActive(true);
                      const opening = scriptedLine(persona, []);
                      setTurns([{ role: "scammer", text: opening }]);
                      setSource("script");
                      speak(opening, reduce);
                    }}
                  >
                    Answer
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={hangUp}>
                    Decline
                  </button>
                </div>
              </div>
            ) : null}
            {active || ended ? (
              <div className="grid gap-2">
                {persona === "security" ? (
                  <div className="border border-line px-3 py-3">
                    <p className="text-[11px] tracking-wide text-muted uppercase">Text message</p>
                    <p className="mt-2 text-[15px] leading-relaxed">{OTP}</p>
                  </div>
                ) : null}
                {turns.map((turn, index) => (
                  <p key={`${turn.role}-${index}`} className={`bubble ${turn.role === "user" ? "bubble-you" : "bubble-them"}`}>
                    {turn.text}
                  </p>
                ))}
                {waiting ? <p className="text-[13px] text-muted">They are talking.</p> : null}
              </div>
            ) : null}
            {ended ? (
              <div className="border-t border-line pt-3">
                <p className="text-[13px] tracking-wide text-muted uppercase">
                  {ended === "win" ? "Objective met" : "Objective missed"}
                </p>
                <p className="lesson mt-2">
                  {ended === "win"
                    ? "You did not give the caller a code."
                    : "Reading that code finishes the registration. They can then message your contacts for money."}
                </p>
                {persona === "security" ? (
                  <p className="mt-3 text-[14px] text-muted">
                    The text is Chinese because the scammer started WhatsApp registration on a phone set to Chinese. WhatsApp sends the SMS in the language of that phone. In English it says: your verification code is 382-194, and you should not tell anyone else.
                  </p>
                ) : null}
                <p className="mt-3 text-[14px]">
                  The other door is a saved contact asking you to send the same kind of code. That room is the verification code trap.
                </p>
              </div>
            ) : null}
          </div>
          {active && !ended ? (
            <form
              className="grid gap-2 border-t border-line px-3 py-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.trim()) void reply(draft);
              }}
            >
              <label htmlFor="call-reply" className="sr-only">
                What you would say
              </label>
              <input
                id="call-reply"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoComplete="off"
                placeholder="What you would say"
                className="min-h-12 w-full border border-line bg-paper px-3 text-[16px]"
              />
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="btn btn-secondary" onClick={listen}>
                  {listening ? "Listening" : "Speak"}
                </button>
                <button type="submit" className="btn btn-secondary">
                  Send
                </button>
              </div>
              <button type="button" className="btn btn-primary" onClick={hangUp}>
                Hang up
              </button>
            </form>
          ) : null}
          {ended ? (
            <div className="border-t border-line px-3 py-3">
              <ReportStrip />
            </div>
          ) : null}
        </div>
      </div>
    </ConsoleFrame>
  );
}
