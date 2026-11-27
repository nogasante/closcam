"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, MessageCircle, PhoneCall } from "lucide-react";
import { useConsent } from "@/lib/storage";
import { StatusBar } from "@/components/phone/StatusBar";
import { SiteFooter } from "@/components/SiteHeader";

const LINES = [
  { from: "them", text: "20GB for GHS 15. Official price is much higher." },
  { from: "them", text: "Send the GHS 15 to 055 441 9088 first. Then I send the redeem link." },
  { from: "you", text: "No. I buy data from the official menu." },
];

export function Landing() {
  const reduce = useReducedMotion();
  const consent = useConsent();
  const start = consent ? "/hub" : "/disclaimer";

  return (
    <div className="min-h-dvh">
      <header className="nav-frost">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <p className="display text-[17px] font-extrabold">CloScam</p>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href={start} className="btn btn-primary hidden w-auto px-4 sm:flex">
            Start training
          </Link>
        </nav>
        </div>
      </header>
      <section className="mx-auto mt-16 grid w-full max-w-6xl items-center gap-16 px-4 lg:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <h1 className="text-4xl leading-tight font-extrabold sm:text-6xl">
            Shut scammers out before they get in.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Practise the texts, chats, and calls people in Ghana actually get. You keep the phone. Nothing real is sent.
          </p>
          <div className="mt-8">
            <Link href={start} className="btn btn-primary sm:w-auto sm:px-6">
              Start training
            </Link>
          </div>
          <p className="mt-10 max-w-xl text-sm text-muted">
            24,124 electronic fraud incidents in 2025. PSP value at risk of GH¢37 million, not proven losses. 187 WhatsApp takeover reports by April 2024, equal to all of 2023.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-[400px]">
          <div className="absolute inset-x-8 top-10 h-64 rounded-full bg-[#f0b429]/25 blur-3xl" aria-hidden="true" />
          <div className="device device-hero relative mx-auto">
          <div className="device-screen chat-wall min-h-[520px]">
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
        </div>
      </section>
      <section className="mx-auto mt-28 grid w-full max-w-6xl gap-12 px-4 md:grid-cols-3 lg:px-8">
        <Step icon={<MessageCircle size={22} />} title="The chat" text="A saved contact asks for money or a code. You answer in the thread." />
        <Step icon={<PhoneCall size={22} />} title="The call" text="PulseLink security wants the text read back. Decline, or stay on the line." />
        <Step icon={<ShieldCheck size={22} />} title="The lock" text="Two-step verification, the saved line, then 292 or 18555." />
      </section>
      <p className="mx-auto mt-20 mb-4 w-full max-w-6xl px-4 text-sm text-muted lg:px-8">
        <Link href="/sources" className="underline">
          Sources for the figures
        </Link>
      </p>
      <SiteFooter />
    </div>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article>
      <div className="text-green">{icon}</div>
      <h2 className="mt-3 text-lg font-extrabold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </article>
  );
}
