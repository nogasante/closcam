"use client";

import Link from "next/link";
import { useState } from "react";
import { recordProtect } from "@/lib/storage";
import { PageShell } from "@/components/PageShell";
import { ReportStrip } from "@/components/ReportStrip";

const STEPS = [
  {
    title: "A text you cannot read",
    body: "【WhatsApp】你的验证码是 382-194，请勿告诉他人。",
    prompt: "What do you do with this text?",
    options: [
      { id: "forward", label: "Forward it to the person who asked", correct: false },
      { id: "keep", label: "Do not forward it. I cannot read it.", correct: true },
    ],
    why: "The scammer started WhatsApp registration on a phone set to Chinese, so the SMS arrived in Chinese. In English it says not to tell anyone the code. Forwarding it gives them the account.",
  },
  {
    title: "Two-step verification",
    body: "Path: WhatsApp, Settings, Account, Two-step verification, Enable. The PIN stays with you.",
    prompt: "What do you do with that PIN?",
    options: [
      { id: "share", label: "Read it to a caller who says they are security", correct: false },
      { id: "keep", label: "Turn it on, and never share it", correct: true },
    ],
    why: "Two-step verification means a registration code alone is not enough. No caller, friend, or agent needs that PIN.",
  },
  {
    title: "A strange request in an old chat",
    body: "A saved contact asks for money to a number you do not save for them, and says not to call.",
    prompt: "How do you check?",
    options: [
      { id: "reply", label: "Reply in the same chat", correct: false },
      { id: "call", label: "Call the number I already save for them", correct: true },
    ],
    why: "The chat can belong to someone else. A normal call to the saved line is the check. Do not use the new wallet number.",
  },
  {
    title: "If the account is already gone",
    body: "You cannot open your chat, and friends say you asked them for money.",
    prompt: "What do you do first?",
    options: [
      { id: "pay", label: "Pay the number in the chat so they stop", correct: false },
      { id: "warn", label: "Recover the account and warn your contacts it was not you", correct: true },
    ],
    why: "Use the official recovery steps. Tell family and friends the account is not you. Do not send money to numbers that chat gives out.",
  },
];

export function ProtectDrill() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const current = STEPS[step];
  const choice = current?.options.find((item) => item.id === picked) ?? null;
  const done = step >= STEPS.length;

  return (
    <PageShell>
      <p className="text-[12px] tracking-wide text-muted uppercase">Protection {done ? "" : `${step + 1} of ${STEPS.length}`}</p>
      {done ? (
        <div className="mt-3 grid gap-4">
          <h1 className="text-[28px] font-medium tracking-tight">That is the lock.</h1>
          <p className="text-[15px] text-muted">
            Do not forward a code. Turn on two-step verification. Call the saved line. If the account is gone, recover it and warn your contacts.
          </p>
          <ReportStrip />
          <Link href="/" className="btn btn-primary">
            Back to the junction
          </Link>
        </div>
      ) : current ? (
        <div className="mt-3 grid gap-4">
          <h1 className="text-[28px] font-medium tracking-tight">{current.title}</h1>
          <p className="border border-line px-3 py-3 text-[15px] leading-relaxed">{current.body}</p>
          <p className="text-[15px]">{current.prompt}</p>
          <div className="grid gap-2">
            {current.options.map((item) => (
              <button
                key={item.id}
                type="button"
                className="btn btn-choice"
                onClick={() => {
                  setPicked(item.id);
                  if (step === STEPS.length - 1) recordProtect();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {choice ? (
            <div className="grid gap-3">
              <p className="text-[13px] tracking-wide text-muted uppercase">
                {choice.correct ? "That is the move" : "Not that one"}
              </p>
              <p className="text-[15px]">{current.why}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setPicked(null);
                  setStep((value) => value + 1);
                }}
              >
                {step === STEPS.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}
