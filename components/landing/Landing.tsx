"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, MessageCircle, PhoneCall } from "lucide-react";
import { useConsent } from "@/lib/storage";
import { StatusBar } from "@/components/phone/StatusBar";

const LINES = [
  { from: "them", text: "Send the GHS 15 first. Then I send the redeem link." },
  { from: "you", text: "No. I buy data from the official menu." },
];

export function Landing() {
  const reduce = useReducedMotion();
  const consent = useConsent();
  const start = consent ? "/hub" : "/disclaimer";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-5 lg:px-8">
      <header className="flex items-center justify-between">
        <p className="display text-xl font-extrabold">CloScam</p>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/sources" className="min-h-11 inline-flex items-center">
            Sources
          </Link>
          <Link href={start} className="btn btn-primary hidden w-auto px-4 sm:flex">
            Start training
          </Link>
        </nav>
      </header>
      <section className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold tracking-wide text-green uppercase">Ghana mobile money</p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
            Shut scammers out before they get in.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Practise the texts, chats, and calls people in Ghana actually get. You keep the phone. Nothing real is sent.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={start} className="btn btn-primary sm:w-auto sm:px-6">
              Start training
            </Link>
            <Link href="/hub" className="btn btn-secondary sm:w-auto sm:px-6">
              See the rooms
            </Link>
          </div>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat value="24,124" label="Electronic fraud incidents in 2025, Bank of Ghana." />
            <Stat value="GH¢37m" label="PSP value at risk in 2025, not proven losses." />
            <Stat value="187" label="WhatsApp takeover reports by April 2024, equal to all of 2023." />
          </dl>
        </div>
        <div className="device mx-auto">
          <div className="device-screen chat-wall">
            <StatusBar />
            <div className="border-b border-white/10 px-3 py-2">
              <p className="text-sm font-bold">SwiftBundle</p>
              <p className="text-xs text-muted">Chat simulation</p>
            </div>
            <div className="space-y-2 px-3 py-4">
              {LINES.map((line, index) => (
                <motion.p
                  key={line.text}
                  className={`bubble ${line.from === "you" ? "bubble-you" : "bubble-them"}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.2 + index * 0.25, type: "spring", stiffness: 380, damping: 28 }}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-14 grid gap-4 md:grid-cols-3">
        <Step icon={<MessageCircle size={22} />} title="Live the chat" text="Messages arrive in a phone. You answer before the money moves." />
        <Step icon={<PhoneCall size={22} />} title="Take the call" text="A PulseLink security caller wants a code. Hang up, or read it and see what follows." />
        <Step icon={<ShieldCheck size={22} />} title="Leave with the lock" text="Two-step verification, the saved line, and the report numbers 292, 18555 or 191." />
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="lift px-4 py-3">
      <dt className="display text-2xl font-extrabold text-green">{value}</dt>
      <dd className="mt-1 text-sm text-muted">{label}</dd>
    </div>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="lift px-4 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a2414] text-green">{icon}</div>
      <h2 className="mt-3 text-lg font-extrabold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </article>
  );
}
