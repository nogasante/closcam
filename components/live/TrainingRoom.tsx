"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scanFlags } from "@/lib/flags";
import { getRoom, TRAINING_BALANCE, type Follow, type Incoming, type Room } from "@/lib/live/rooms";
import { blip, lossTone, markTone } from "@/lib/live/sound";
import { nextScenarioId } from "@/lib/scenarios";
import { shuffleChoices } from "@/lib/shuffle";
import { recordFirstTry, useProgress } from "@/lib/storage";
import type { Scenario } from "@/lib/types";
import { ConsoleFrame, LeaveLink, type FlagEntry } from "@/components/console/ConsoleFrame";
import { StatusBar } from "@/components/phone/StatusBar";
import { CheckCheck, ChevronLeft, Info, Phone, Video } from "lucide-react";

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
  const [shake, setShake] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [headsUp, setHeadsUp] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const hideTimer = useRef(0);

  const armHeadsUp = useCallback(() => {
    setHeadsUp(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setHeadsUp(false), reduce ? 1600 : 4500);
  }, [reduce]);

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
    return () => window.clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    if (phase !== "incoming") return;
    if (shown >= room.incoming.length) return;
    const wait = reduce ? 0 : room.incoming[shown]?.kind === "sms" ? 1400 : 1100;
    const timer = window.setTimeout(() => {
      blip();
      if (!reduce && navigator.vibrate) navigator.vibrate(12);
      if (room.incoming[shown]?.kind === "sms") armHeadsUp();
      setShown((count) => count + 1);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [phase, shown, room.incoming, reduce, armHeadsUp]);

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
    const wait = reduce ? 0 : event.kind === "chat" ? 900 : 700;
    const timer = window.setTimeout(() => {
      if (event.kind === "balance") {
        setBalance((value) => value + event.delta);
        setHit(true);
        lossTone();
        window.setTimeout(() => setHit(false), 400);
      } else {
        blip();
        if (event.kind === "sms") armHeadsUp();
      }
      setTrail((items) => [...items, event]);
      setFollowShown((count) => count + 1);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [phase, playingSite, followShown, siteDone, picked, reduce, room.options, armHeadsUp]);

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
  const bannerSms = [...visibleIncoming, ...trail].reverse().find((item) => item.kind === "sms");
  const smsKey = bannerSms && bannerSms.kind === "sms" ? bannerSms.text : "";
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
    if (next.correct) {
      markTone();
    } else {
      lossTone();
      if (!reduce && navigator.vibrate) navigator.vibrate([18, 40, 18]);
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
    }
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
  const immersive = room.surface === "chat" || room.surface === "sms";
  const followQueue = playingAfter ? afterSite : beforeSite;

  return (
    <ConsoleFrame
      phoneMode={immersive}
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
      <div className={`device flex flex-col ${immersive ? "min-h-dvh lg:min-h-[680px]" : "min-h-[calc(100dvh-132px)]"} ${hit ? "ring-2 ring-danger" : ""} ${shake ? "shake" : ""}`}>
        <div className="device-screen chat-wall relative min-h-0 flex-1">
          <StatusBar />
          <p className="pointer-events-none absolute top-1 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/80">
            Simulation
          </p>
          <header className="relative z-10 flex items-center gap-1 bg-[#1a242c] px-1 py-1.5 text-[#f7f4ee]">
            <Link href="/hub" className="inline-flex h-11 w-10 items-center justify-center" aria-label="Back to rooms">
              <ChevronLeft size={26} />
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c4a574] text-sm font-extrabold text-[#1a1408]">
              {room.contact.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[16px] leading-tight font-semibold">{room.contact}</span>
              <span className="block text-[12px] text-[#d5dde6]">online</span>
            </span>
            <span className="inline-flex h-11 w-10 items-center justify-center text-[#d5dde6]" aria-hidden="true">
              <Video size={20} />
            </span>
            <span className="inline-flex h-11 w-10 items-center justify-center text-[#d5dde6]" aria-hidden="true">
              <Phone size={18} />
            </span>
            <button type="button" className="inline-flex h-11 w-10 items-center justify-center" aria-label="Room info" onClick={() => setInfoOpen(true)}>
              <Info size={18} />
            </button>
          </header>
          {headsUp && bannerSms && bannerSms.kind === "sms" && !smsOpen ? (
            <motion.button
              type="button"
              key={bannerSms.text}
              initial={reduce ? false : { y: -88, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="absolute top-8 right-2 left-2 z-30 flex gap-3 rounded-2xl bg-[#2a3036] px-3 py-2 text-left text-[#f7f4ee] shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
              onClick={() => setSmsOpen(true)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3ddc84] text-[11px] font-extrabold text-[#062216]">
                Msg
              </span>
              <span>
                <span className="block text-[13px] font-bold">{bannerSms.sender}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-[#d5dde6]">{bannerSms.text}</span>
              </span>
            </motion.button>
          ) : null}
          <div ref={scroller} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {!headsUp && smsKey && !smsOpen && bannerSms && bannerSms.kind === "sms" ? (
              <button
                type="button"
                className="mx-auto flex min-h-11 items-center gap-2 rounded-full bg-[#243038] px-3 text-[13px] font-semibold text-[#f7f4ee]"
                onClick={armHeadsUp}
              >
                Open the text
              </button>
            ) : null}
            <p className="mx-auto w-fit rounded-lg bg-[#182229]/90 px-2 py-1 text-[11px] text-white/80">Today</p>
            {room.history?.map((line) => (
              <p
                key={line.text}
                className={`bubble ${line.from === "you" ? "bubble-you" : "bubble-them"}`}
              >
                <span className="mb-1 block text-[11px] text-muted">{line.when}</span>
                {line.text}
              </p>
            ))}
            {visibleIncoming.map((line, index) => (
              <Message key={`in-${index}`} line={line} />
            ))}
            {phase === "incoming" && shown < room.incoming.length ? <Typing /> : null}
            {phase === "follow" && !playingSite && followQueue[followShown]?.kind === "chat" ? <Typing /> : null}
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
          {infoOpen ? (
            <div className="absolute inset-0 z-40 flex items-start justify-center bg-black/50 p-3" onClick={() => setInfoOpen(false)}>
              <div className="mt-10 w-full rounded-2xl bg-[#1f2c34] p-4 text-white" onClick={(event) => event.stopPropagation()}>
                <p className="text-xs font-bold tracking-wide text-white/60 uppercase">Room info</p>
                <p className="mt-2 text-[15px]">{room.objective}</p>
                <p className={`mono mt-3 inline-flex rounded-full bg-black/30 px-3 py-1 text-[12px] ${hit ? "text-miss" : ""}`}>
                  Training balance {money(balance)}
                </p>
                <p className="mt-3 text-sm text-white/70">
                  {flags.length} flag{flags.length === 1 ? "" : "s"} logged.
                  {flags[0] ? ` ${flags[flags.length - 1]?.label}.` : ""}
                </p>
                <button type="button" className="btn btn-secondary mt-4" onClick={() => setInfoOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          ) : null}
          {smsOpen && bannerSms && bannerSms.kind === "sms" ? (
            <div className="absolute inset-0 z-40 flex flex-col bg-[#111] text-white">
              <header className="flex items-center gap-2 bg-[#1b1b1b] px-2 py-2">
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center" onClick={() => setSmsOpen(false)} aria-label="Back to chat">
                  <ChevronLeft />
                </button>
                <span className="font-semibold">Messages</span>
              </header>
              <div className="px-4 py-6">
                <p className="text-xs text-white/50">{bannerSms.sender}</p>
                <p className="mt-2 max-w-[90%] rounded-2xl rounded-tl-sm bg-[#2c2c2e] px-3 py-2 text-[16px] leading-relaxed">
                  {bannerSms.text}
                </p>
              </div>
            </div>
          ) : null}
          <div className="reply-sheet shrink-0 px-2 py-2">
            {phase === "choose" ? (
              <motion.div
                className="grid max-h-[42dvh] gap-2 overflow-y-auto"
                initial={reduce ? false : { y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              >
                {ordered.map((item) => (
                  <button key={item.id} type="button" className="reply-choice" onClick={() => choose(item.id)}>
                    {item.text}
                  </button>
                ))}
                <form onSubmit={onDraft} className="grid gap-2">
                  <label className="sr-only" htmlFor="reply">
                    What you would reply
                  </label>
                  <input
                    id="reply"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    autoComplete="off"
                    placeholder="What you would reply"
                    className="say-field"
                  />
                </form>
              </motion.div>
            ) : null}
            {phase === "debrief" ? (
              <Debrief scenario={scenario} correct={option?.correct ?? false} nextId={nextId} />
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
  if (line.kind === "sms") return null;
  if (line.from === "note") {
    return (
      <Arrive>
        <p className="bubble bubble-system">{line.text}</p>
      </Arrive>
    );
  }
  return (
    <Arrive>
      <p className={`bubble ${line.from === "you" ? "bubble-you" : "bubble-them"}`}>
        {line.text}
        <span className="bubble-time mt-1 flex items-center justify-end gap-1 text-[11px]">
          <span className="mono">14:03</span>
          {line.from === "you" ? <CheckCheck size={12} aria-hidden="true" /> : null}
        </span>
      </p>
    </Arrive>
  );
}

function FollowView({ event }: { event: Follow }) {
  if (event.kind === "balance") {
    return <p className="bubble bubble-system">{event.label}</p>;
  }
  if (event.kind === "site") return null;
  if (event.kind === "sms") return null;
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
      <p className="mt-2 text-sm">Do not type a real PIN.</p>
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

function Debrief({
  scenario,
  correct,
  nextId,
}: {
  scenario: Scenario;
  correct: boolean;
  nextId: string | null;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="lift grid gap-3 px-3 py-3"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28 }}
    >
      <p className="text-lg font-extrabold">{correct ? "Met" : "Missed"}</p>
      <p>{scenario.lesson}</p>
      <ul className="grid gap-2">
        {scenario.redFlags.slice(0, 3).map((flag) => (
          <li key={flag} className="border-l border-line pl-3 text-[14px]">
            {flag}
          </li>
        ))}
      </ul>
      <div className="grid gap-2">
        {nextId ? (
          <Link href={`/drills/${nextId}`} className="btn btn-primary">
            Next room
          </Link>
        ) : (
          <Link href="/score" className="btn btn-primary">
            See results
          </Link>
        )}
      </div>
    </motion.div>
  );
}
