"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, MessageCircle, PhoneCall } from "lucide-react";
import { useConsent } from "@/lib/storage";
import { SiteFooter } from "@/components/SiteHeader";
import { CountUp } from "@/components/motion/CountUp";
import { HeroStage } from "./HeroStage";

const STEPS = [
  { icon: MessageCircle, title: "The chat", text: "A saved contact asks for money or a code. You answer in the thread." },
  { icon: PhoneCall, title: "The call", text: "PulseLink security wants the text read back. Decline, or stay on the line." },
  { icon: ShieldCheck, title: "The lock", text: "Two-step verification, the saved line, then 292 or 18555." },
];

export function Landing() {
  const reduce = useReducedMotion();
  const consent = useConsent();
  const start = consent ? "/hub" : "/disclaimer";
  const rise = reduce ? { opacity: 1, y: 0 } : undefined;
  const heroCta = useRef<HTMLAnchorElement>(null);
  const [navCta, setNavCta] = useState(false);

  useEffect(() => {
    const node = heroCta.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setNavCta(!entry?.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-dvh bg-[#2D2E32]">
      <header className="nav-frost">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <p className="display text-[17px] font-extrabold">CloScam</p>
          <div className="flex items-center gap-4">
          <Link href="/tools" className="inline-flex min-h-11 items-center text-sm font-semibold">
            Tools
          </Link>
          <Link
            href={start}
            className={`nav-cta btn btn-primary ${navCta ? "is-on" : ""}`}
            tabIndex={navCta ? 0 : -1}
            aria-hidden={navCta ? undefined : true}
          >
            Start training
          </Link>
          </div>
        </div>
      </header>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-8 lg:pt-16">
        <div>
          <motion.h1
            className="t-display max-w-[12ch]"
            initial={reduce ? false : { opacity: 0.7, y: 8 }}
            animate={rise ?? { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Shut scammers out before they get in.
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl text-lg text-[#d5dbe4]"
            initial={reduce ? false : { opacity: 0.7, y: 8 }}
            animate={rise ?? { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Nothing real is sent.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={reduce ? false : { opacity: 0.7, y: 8 }}
            animate={rise ?? { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link ref={heroCta} href={start} className="btn btn-primary sm:w-auto sm:px-6">
              Start training
            </Link>
          </motion.div>
          <motion.div
            className="mt-8 grid max-w-xl grid-cols-3 gap-3"
            initial={reduce ? false : { opacity: 0.7, y: 8 }}
            animate={rise ?? { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stat value={24124} label="incidents, 2025" />
            <Stat value={37} prefix="GH¢" label="million at risk" />
            <Stat value={187} label="takeover reports" />
          </motion.div>
          <p className="mt-3 text-sm text-[#d5dbe4]">
            <Link href="/sources" className="underline">
              Sources for the figures
            </Link>
          </p>
        </div>
        <HeroStage />
      </section>
      <section className="mx-auto mt-16 grid w-full max-w-6xl gap-10 px-4 pb-4 md:grid-cols-3 lg:px-8">
        {STEPS.map((step) => (
          <motion.article
            key={step.title}
            initial={reduce ? false : { opacity: 0.7, y: 8 }}
            animate={rise ?? { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <step.icon size={22} className="text-green" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-extrabold">{step.title}</h2>
            <p className="mt-1 text-sm text-[#d5dbe4]">{step.text}</p>
          </motion.article>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ value, label, prefix = "" }: { value: number; label: string; prefix?: string }) {
  return (
    <p>
      <span className="block text-xl font-extrabold tracking-tight sm:text-2xl">
        {prefix}
        <CountUp to={value} />
      </span>
      <span className="mt-1 block text-xs text-[#d5dbe4]">{label}</span>
    </p>
  );
}
