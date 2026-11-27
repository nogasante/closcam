"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
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
import { ConsoleFrame, LeaveLink, type FlagEntry } from "@/components/console/ConsoleFrame";
import { ReportStrip } from "@/components/ReportStrip";
import { StatusBar } from "@/components/phone/StatusBar";

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
  const [callSeconds, setCallSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [pad, setPad] = useState(false);

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
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
      setCallSeconds((value) => value + 1);
    }, 1000);
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

  const callerLabel = PERSONAS.find((item) => item.id === persona)?.label ?? "Caller";

  function answer() {
    stopRing();
    setRinging(false);
    setActive(true);
    setCallSeconds(0);
    const opening = scriptedLine(persona, []);
    setTurns([{ role: "scammer", text: opening }]);
    setSource("script");
    speak(opening, reduce);
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
      phoneMode
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
      <div className="mb-3 hidden flex-wrap gap-2 lg:flex">
        {PERSONAS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={active || ringing}
            className={`min-h-11 rounded-full border px-3 text-[13px] font-bold ${persona === item.id ? "border-green bg-[#2a2414] text-green" : "border-line text-muted"}`}
            onClick={() => setPersona(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="device flex min-h-dvh flex-col lg:min-h-[680px]">
        <div className="device-screen relative min-h-0 flex-1 bg-[#0c1220] text-white">
          <StatusBar />
          {!ringing && !active && !ended ? (
            <div className="flex flex-1 items-center px-4">
              <button type="button" className="btn btn-primary" onClick={() => setRinging(true)}>
                Start the incoming call
              </button>
            </div>
          ) : null}
          {ringing ? <IncomingCall label={callerLabel} onAnswer={answer} onDecline={hangUp} /> : null}
          {active || ended ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="px-4 pt-4 text-center">
                <Initials label={callerLabel} />
                <p className="mt-3 text-lg font-extrabold">{callerLabel}</p>
                <p className="mono text-sm text-white/70">{clock(callSeconds)}</p>
              </div>
              <div className="mt-3 flex-1 space-y-2 overflow-y-auto px-3">
                {persona === "security" ? (
                  <p className="rounded-2xl bg-white px-3 py-2 text-sm text-[#121a2b]">{OTP}</p>
                ) : null}
                {turns.map((turn, index) => (
                  <p key={`${turn.role}-${index}`} className="text-sm leading-snug text-white/90">
                    <span className="font-bold">{turn.role === "user" ? "You" : "Caller"}: </span>
                    {turn.text}
                  </p>
                ))}
                {waiting ? <p className="text-sm text-white/60">They are talking.</p> : null}
                {ended ? (
                  <div className="pt-2">
                    <p className="text-sm font-extrabold">{ended === "win" ? "You kept the code." : "That code opened the account."}</p>
                    {persona === "security" ? (
                      <p className="mt-2 text-sm text-white/70">
                        The text is Chinese because registration started on a phone set to Chinese. In English it says not to share 382-194.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {pad && !ended ? (
                <div className="grid grid-cols-3 gap-2 px-6 py-2 text-center text-lg">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                    <button key={key} type="button" className="min-h-11" onClick={() => setDraft((value) => value + key)}>
                      {key}
                    </button>
                  ))}
                </div>
              ) : null}
              {active && !ended ? (
                <form
                  className="grid gap-2 px-3 pb-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (draft.trim()) void reply(draft);
                  }}
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    autoComplete="off"
                    placeholder="What you would say"
                    className="min-h-11 rounded-full bg-white/10 px-4 text-[16px]"
                    aria-label="What you would say"
                  />
                  <div className="flex items-center justify-between px-2 pb-3">
                    <Round icon={muted ? <MicOff size={18} /> : <Mic size={18} />} label={muted ? "Muted" : "Mute"} onClick={() => setMuted((value) => !value)} />
                    <Round icon={<span className="text-sm font-bold">123</span>} label={pad ? "Hide pad" : "Keypad"} onClick={() => setPad((value) => !value)} />
                    <Round icon={<Volume2 size={18} />} label={speaker ? "Speaker on" : "Speaker off"} onClick={() => setSpeaker((value) => !value)} />
                    <button type="button" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e23b3b]" onClick={hangUp} aria-label="Hang up">
                      <PhoneOff size={22} />
                    </button>
                  </div>
                  <button type="submit" className="btn btn-secondary">
                    {listening ? "Listening" : "Send reply"}
                  </button>
                  <button type="button" className="min-h-11 text-sm" onClick={listen}>
                    Speak instead
                  </button>
                </form>
              ) : null}
            </div>
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

function clock(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function Initials({ label }: { label: string }) {
  return (
    <span className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <span className="ring-pulse absolute inset-0 rounded-full bg-white/20" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#f0b429] text-2xl font-extrabold text-[#1a1408]">
        {label.slice(0, 1)}
      </span>
    </span>
  );
}

function IncomingCall({
  label,
  onAnswer,
  onDecline,
}: {
  label: string;
  onAnswer: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 py-10">
      <div className="text-center">
        <Initials label={label} />
        <p className="mt-6 text-2xl font-extrabold">{label}</p>
        <p className="mono mt-1 text-sm text-white/70">+233 24 550 0193</p>
        <p className="mt-2 text-sm text-white/60">Incoming call</p>
      </div>
      <div className="flex w-full max-w-xs items-center justify-between">
        <button type="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3dce7c]" onClick={onAnswer} aria-label="Answer">
          <Phone size={26} />
        </button>
        <button type="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e23b3b]" onClick={onDecline} aria-label="Decline">
          <PhoneOff size={26} />
        </button>
      </div>
    </div>
  );
}

function Round({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10" onClick={onClick} aria-label={label}>
      {icon}
    </button>
  );
}
