"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scanFlags } from "@/lib/flags";
import { getRoom, TRAINING_BALANCE, type Follow, type Incoming, type Room } from "@/lib/live/rooms";
import { blip, lossTone } from "@/lib/live/sound";
import { nextScenarioId } from "@/lib/scenarios";
import { shuffleChoices } from "@/lib/shuffle";
import { recordFirstTry, useProgress } from "@/lib/storage";
import type { Scenario } from "@/lib/types";
import { ConsoleFrame, LeaveLink, MobileBrief, type FlagEntry } from "@/components/console/ConsoleFrame";
import { HighlightedBody } from "@/components/HighlightedText";
import { ReportStrip } from "@/components/ReportStrip";

function money(value: number): string {
  return `GHS ${value.toFixed(2)}`;
}

function collect(lines: { text: string; log?: string }[]): FlagEntry[] {
  const entries: FlagEntry[] = [];
  for (const line of lines) {
    if (line.log) entries.push({ label: "Noted", detail: line.log });
    for (const hit of scanFlags(line.text).labels) {
      entries.push({ label: hit.label, detail: hit.detail });
    }
  }
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.label}:${entry.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function TrainingRoom({ scenario }: { scenario: Scenario }) {
  const room = getRoom(scenario.id);
  if (!room) return null;
  return <RoomPlay key={room.id} room={room} scenario={scenario} />;
}

function RoomPlay({ room, scenario }: { room: Room; scenario: Scenario }) {
  const reduce = useReducedMotion();
  const progress = useProgress();
  const [shown, setShown] = useState(0);
  const [followShown, setFollowShown] = useState(0);
  const [trail, setTrail] = useState<Follow[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [siteDone, setSiteDone] = useState(false);
  const [balance, setBalance] = useState(TRAINING_BALANCE);
  const [hit, setHit] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [draft, setDraft] = useState("");
  const [typingOpen, setTypingOpen] = useState(false);
  const [answered, setAnswered] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const option = room.options.find((item) => item.id === picked) ?? null;
  const follow = option?.follow ?? [];
  const siteIndex = follow.findIndex((event) => event.kind === "site");
  const beforeSite = siteIndex === -1 ? follow : follow.slice(0, siteIndex);
  const afterSite = siteIndex === -1 ? [] : follow.slice(siteIndex + 1);
  const playingSite = Boolean(option) && followShown >= beforeSite.length && siteIndex !== -1 && !siteDone;
  const playingAfter = siteDone;
  const followDone =
    Boolean(option) &&
    !playingSite &&
    (playingAfter ? followShown >= afterSite.length : followShown >= beforeSite.length && siteIndex === -1);

  const phase = !option ? (shown >= room.incoming.length ? "choose" : "incoming") : followDone ? "debrief" : "follow";

  useEffect(() => {
    if (phase !== "incoming") return;
    if (shown >= room.incoming.length) return;
    const wait = reduce ? 0 : room.incoming[shown]?.kind === "sms" ? 700 : 480;
    const timer = window.setTimeout(() => {
      blip();
      if (!reduce && navigator.vibrate) navigator.vibrate(12);
      setShown((count) => count + 1);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [phase, shown, room.incoming, reduce]);

  useEffect(() => {
    if (phase !== "follow" || playingSite || !picked) return;
    const chosen = room.options.find((item) => item.id === picked);
    if (!chosen) return;
    const events = chosen.follow;
    const index = events.findIndex((event) => event.kind === "site");
    const before = index === -1 ? events : events.slice(0, index);
    const after = index === -1 ? [] : events.slice(index + 1);
    const queue = siteDone ? after : before;
    if (followShown >= queue.length) return;
    const event = queue[followShown];
    if (!event) return;
    const wait = reduce ? 0 : 420;
    const timer = window.setTimeout(() => {
      if (event.kind === "balance") {
        setBalance((value) => value + event.delta);
        setHit(true);
        lossTone();
        window.setTimeout(() => setHit(false), 400);
      } else {
        blip();
      }
      setTrail((items) => [...items, event]);
      setFollowShown((count) => count + 1);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [phase, playingSite, followShown, siteDone, picked, reduce, room.options]);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [shown, trail.length, phase, playingSite, reduce]);

  useEffect(() => {
    if (phase === "debrief" || reduce) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, reduce]);

  const ordered = useMemo(
    () =>
      shuffleChoices(
        room.id,
        room.options.map((item) => ({ id: item.id, text: item.label, correct: item.correct })),
      ),
    [room.id, room.options],
  );

  const visibleIncoming = room.incoming.slice(0, shown);
  const visibleFollow = trail.filter((event) => event.kind !== "balance");
  const flags = collect([
    ...visibleIncoming.map((line) => ({ text: line.text, log: line.log })),
    ...visibleFollow.map((line) =>
      line.kind === "chat" || line.kind === "sms"
        ? { text: line.text, log: line.log }
        : { text: "", log: undefined },
    ),
  ]);

  const cleared = Object.keys(progress.results).length;
  const site = follow.find((event) => event.kind === "site");

  function choose(id: string) {
    if (picked) return;
    const next = room.options.find((item) => item.id === id);
    if (!next) return;
    if (!progress.results[room.id]) recordFirstTry(room.id, next.correct);
    setAnswered(true);
    setPicked(id);
    setFollowShown(0);
    setSiteDone(false);
  }

  function onDraft(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim().toLowerCase();
    setDraft("");
    if (!text) return;
    const digits = text.replace(/\D/g, "");
    if (digits.length >= 4 || /\b(pin|otp|code)\b/.test(text)) {
      const leak = room.options.find((item) => !item.correct && /pin|code|otp/i.test(item.label));
      choose(leak?.id ?? room.options.find((item) => !item.correct)?.id ?? "");
      return;
    }
    if (/\b(send|transfer|yes|ok|okay|paid)\b/.test(text) && !/\b(not|don't|do not|won't)\b/.test(text)) {
      const send = room.options.find((item) => !item.correct && /send|pay|approve|enter|give/i.test(item.label));
      choose(send?.id ?? "");
      return;
    }
    if (/\b(no|stop|scam|hang|official|menu|won't|will not|do not|don't|call)\b/.test(text)) {
      const safe = room.options.find((item) => item.correct);
      if (safe) choose(safe.id);
    }
  }

  const nextId = nextScenarioId(room.id);

  return (
    <ConsoleFrame
      kicker={`Room ${scenario.number} of 10`}
      title={scenario.title}
      brief={room.brief}
      objective={room.objective}
      pressureLabel={room.pressure}
      pressureLeft={(seconds / 45) * 100}
      flags={flags}
      progress={`${cleared} of 10 rooms have a first answer. This room ${progress.results[room.id] ? "is recorded" : "is open"}.`}
      action={<LeaveLink />}
    >
      <div className="lg:hidden">
        <MobileBrief objective={room.objective} flags={flags} />
      </div>
      <div className={`flex min-h-[calc(100dvh-120px)] flex-col lg:min-h-[680px] ${hit ? "phone-hit" : ""} lg:phone`}>
        <div className="phone-screen min-h-0 flex-1 rounded-none lg:min-h-[640px] lg:rounded-[18px]">
          <header className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
            <div>
              <p className="text-[15px] font-medium">{room.contact}</p>
              <p className="mono text-[12px] text-muted">{room.detail}</p>
            </div>
            <p className={`mono text-[12px] ${hit ? "text-miss" : "text-muted"}`}>{money(balance)}</p>
          </header>
          <div className="pressure">
            <span style={{ width: `${(seconds / 45) * 100}%` }} />
          </div>
          <div ref={scroller} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {room.history?.map((line) => (
              <p
                key={line.text}
                className={`bubble ${line.from === "you" ? "bubble-you" : "bubble-them"} opacity-60`}
              >
                <span className="mb-1 block text-[11px] text-muted">{line.when}</span>
                {line.text}
              </p>
            ))}
            {visibleIncoming.map((line, index) => (
              <Message key={`in-${index}`} line={line} />
            ))}
            {phase === "incoming" && shown < room.incoming.length ? <Typing /> : null}
            {trail.map((event, index) => (
              <FollowView key={`f-${index}`} event={event} />
            ))}
            {playingSite && site && site.kind === "site" ? (
              <SiteCard
                url={site.url}
                title={site.title}
                body={site.body}
                onClose={() => {
                  setSiteDone(true);
                  setFollowShown(0);
                }}
              />
            ) : null}
          </div>
          <div className="shrink-0 border-t border-line px-3 py-3">
            {phase === "choose" ? (
              <div className="grid gap-2">
                {ordered.map((item) => (
                  <button key={item.id} type="button" className="btn btn-choice" onClick={() => choose(item.id)}>
                    {item.text}
                  </button>
                ))}
                <button
                  type="button"
                  className="min-h-11 text-left text-[13px] text-muted lg:hidden"
                  onClick={() => setTypingOpen((open) => !open)}
                >
                  {typingOpen ? "Hide the reply box" : "Type what you would say"}
                </button>
                <form onSubmit={onDraft} className={`gap-2 ${typingOpen ? "grid" : "hidden lg:grid"}`}>
                  <label className="sr-only" htmlFor="reply">
                    What you would reply
                  </label>
                  <input
                    id="reply"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    autoComplete="off"
                    placeholder="What you would reply"
                    className="min-h-12 w-full border border-line bg-paper px-3 text-[16px]"
                  />
                </form>
              </div>
            ) : null}
            {phase === "debrief" ? (
              <Debrief
                room={room}
                scenario={scenario}
                correct={option?.correct ?? false}
                nextId={nextId}
                already={Boolean(progress.results[room.id] && !answered)}
                lines={[...visibleIncoming.map((line) => line.text), ...trail.flatMap((event) => (event.kind === "chat" || event.kind === "sms" ? [event.text] : []))]}
              />
            ) : null}
            {phase === "follow" && !playingSite ? (
              <p className="text-[13px] text-muted">Watch what happens next.</p>
            ) : null}
          </div>
        </div>
      </div>
    </ConsoleFrame>
  );
}

function Typing() {
  return (
    <p className="bubble bubble-them w-16 text-[13px] tracking-[0.3em] text-muted" aria-label="Typing">
      ...
    </p>
  );
}

function Arrive({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Message({ line }: { line: Incoming }) {
  if (line.kind === "sms") {
    return (
      <Arrive>
        <div className="border border-line bg-card px-3 py-3">
          <p className="text-[11px] tracking-wide text-muted uppercase">New text</p>
          <p className="mt-1 text-[13px]">{line.sender}</p>
          <p className="mt-2 text-[15px] leading-relaxed">{line.text}</p>
        </div>
      </Arrive>
    );
  }
  if (line.from === "note") {
    return (
      <Arrive>
        <p className="bubble bubble-system">{line.text}</p>
      </Arrive>
    );
  }
  return (
    <Arrive>
      <p className={`bubble ${line.from === "you" ? "bubble-you" : "bubble-them"}`}>{line.text}</p>
    </Arrive>
  );
}

function FollowView({ event }: { event: Follow }) {
  if (event.kind === "balance") {
    return <p className="bubble bubble-system">{event.label}</p>;
  }
  if (event.kind === "site") return null;
  if (event.kind === "sms") {
    return (
      <div className="border border-line px-3 py-3">
        <p className="text-[11px] tracking-wide text-muted uppercase">Text</p>
        <p className="mt-2">{event.text}</p>
      </div>
    );
  }
  if (event.from === "note") return <p className="bubble bubble-system">{event.text}</p>;
  return <p className={`bubble ${event.from === "you" ? "bubble-you" : "bubble-them"}`}>{event.text}</p>;
}

function SiteCard({
  url,
  title,
  body,
  onClose,
}: {
  url: string;
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="border border-danger bg-card px-3 py-3">
      <p className="mono text-[12px] text-miss">{url}</p>
      <p className="mt-2 font-medium">{title}</p>
      <p className="mt-2 text-[14px] text-muted">{body}</p>
      <p className="mt-2 text-[13px]">Training only. Do not type a real PIN. Nothing you enter is saved.</p>
      <div className="mt-3 grid gap-2">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Enter a code, then leave
        </button>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Close the site
        </button>
      </div>
    </div>
  );
}

function ReplayLine({ text }: { text: string }) {
  const report = scanFlags(text);
  if (report.matches.length === 0) return text;
  return <HighlightedBody text={text} report={report} />;
}

function Debrief({
  room,
  scenario,
  correct,
  nextId,
  already,
  lines,
}: {
  room: Room;
  scenario: Scenario;
  correct: boolean;
  nextId: string | null;
  already: boolean;
  lines: string[];
}) {
  return (
    <div className="grid gap-3">
      <p className="text-[13px] tracking-wide text-muted uppercase">{correct ? "Objective met" : "Objective missed"}</p>
      <p className="lesson">{scenario.lesson}</p>
      {lines.length > 0 ? (
        <div className="grid gap-2">
          <p className="text-[12px] tracking-wide text-muted uppercase">Replay</p>
          {lines.map((line, index) => (
            <div key={`${index}-${line.slice(0, 24)}`} className="border-l border-line pl-3 text-[14px] leading-relaxed">
              <ReplayLine text={line} />
            </div>
          ))}
        </div>
      ) : null}
      {already ? <p className="text-[13px] text-muted">Your first answer is the one on the record.</p> : null}
      {room.reveal ? (
        <div className="border border-line px-3 py-3">
          <p className="text-[12px] tracking-wide text-muted uppercase">What the text said</p>
          <p className="mt-2 text-[15px]">{room.reveal.original}</p>
          <p className="mt-2 text-[15px]">{room.reveal.english}</p>
          <p className="mt-2 text-[14px] text-muted">{room.reveal.why}</p>
        </div>
      ) : null}
      <ul className="grid gap-2">
        {scenario.redFlags.map((flag) => (
          <li key={flag} className="border-l border-line pl-3 text-[14px]">
            {flag}
          </li>
        ))}
      </ul>
      <div className="grid gap-2">
        {room.related?.map((link) => (
          <Link key={link.href} href={link.href} className="min-h-11 text-[14px] text-green">
            {link.label}
          </Link>
        ))}
        {nextId ? (
          <Link href={`/drills/${nextId}`} className="btn btn-primary">
            Next room
          </Link>
        ) : (
          <Link href="/score" className="btn btn-primary">
            Practice score
          </Link>
        )}
        <Link href={`/drills/${room.id}`} className="btn btn-secondary">
          Run this room again
        </Link>
      </div>
      <ReportStrip />
    </div>
  );
}
