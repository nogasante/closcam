"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StatusBar } from "@/components/phone/StatusBar";

const LINES = [
  "20GB for GHS 15. Official price is much higher.",
  "Send the GHS 15 to 055 441 9088 first. Then I send the redeem link.",
];

const HOLDS = [700, 500, 900, 600, 2400];

export function HeroPhone() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 4 : 0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => {
      setStep((current) => (current + 1) % 5);
    }, HOLDS[step] ?? 800);
    return () => window.clearTimeout(timer);
  }, [step, reduce]);

  const shown = reduce ? 2 : step >= 3 ? 2 : step >= 1 ? 1 : 0;
  const typing = !reduce && (step === 0 || step === 2);
  const stamped = reduce || step === 4;

  return (
    <div className="device device-hero">
      <div className="device-screen chat-wall">
        <StatusBar />
        <div className="border-b border-white/10 px-3 py-2">
          <p className="text-sm font-bold">SwiftBundle</p>
          <p className="text-xs text-[#d5dde6]">online</p>
        </div>
        <div className="space-y-2 px-3 py-3">
          {LINES.slice(0, shown).map((text, index) => (
            <motion.p
              key={text}
              className="bubble bubble-them"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {text}
              {index === 1 && stamped ? (
                <motion.span
                  className="stamp mt-2"
                  initial={reduce ? false : { scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Scam spotted
                </motion.span>
              ) : null}
            </motion.p>
          ))}
          {typing ? (
            <p className="bubble bubble-them w-14 tracking-[0.3em]" aria-label="Typing">
              ...
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
