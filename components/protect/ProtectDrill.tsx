"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBar } from "@/components/phone/StatusBar";
import { recordProtect, recordProtectStep, useProtectSteps } from "@/lib/storage";

const STEPS = [
  {
    id: "p-pin",
    title: "Two-step verification",
    correct: "Set a PIN and add an email. I will not share the PIN.",
    wrong: "Skip it. A caller can turn it on for me.",
    lesson: "The PIN and the email stay with you.",
  },
  {
    id: "p-code",
    title: "A code to forward",
    correct: "Do not send it. I cannot read that text.",
    wrong: "Send the code to Ama.",
    lesson: "A registration code is not for forwarding.",
  },
  {
    id: "p-call",
    title: "Call the saved number",
    correct: "Call 024 318 2201, the number I already saved.",
    wrong: "Send the money to 055 111 4488.",
    lesson: "Call the number you already saved.",
  },
  {
    id: "p-recover",
    title: "The account is gone",
    correct: "Reinstall, verify my number, warn contacts, and remove linked devices.",
    wrong: "Pay the number in the chat so they stop.",
    lesson: "Recover the account in the app and remove devices you do not recognise.",
  },
] as const;

export function ProtectDrill() {
  const saved = useProtectSteps();
  const [index, setIndex] = useState(0);
  const [menu, setMenu] = useState<"root" | "account" | "choose">("root");
  const [picked, setPicked] = useState<boolean | null>(null);
  const step = STEPS[index];
  const done = index >= STEPS.length;
  const correctCount = STEPS.filter((item) => saved[item.id]?.correct).length;

  function choose(correct: boolean) {
    if (!step || picked !== null) return;
    recordProtectStep(step.id, correct);
    setPicked(correct);
    const next = { ...saved, [step.id]: { correct, at: "" } };
    if (STEPS.every((item) => next[item.id])) recordProtect();
  }

  function advance() {
    setPicked(null);
    setMenu("root");
    setIndex((value) => value + 1);
  }

  return (
    <div className="min-h-dvh bg-[#1a1d21]">
      <div className="device mx-auto flex min-h-dvh flex-col lg:min-h-[720px] lg:py-6">
        <div className="device-screen flex min-h-0 flex-1 flex-col bg-[#0c1116] text-[#f7f4ee]">
          <StatusBar />
          <header className="flex items-center gap-2 bg-[#1a242c] px-2 py-2">
            <Link href="/hub" className="inline-flex min-h-11 items-center px-2 text-sm" aria-label="Back to rooms">
              Back
            </Link>
            <p className="font-extrabold">{done ? "Protection" : step?.title}</p>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {done ? (
              <div className="grid gap-4">
                <h1 className="nums">Protection {correctCount} / {STEPS.length}</h1>
                <ul className="grid gap-2 text-sm">
                  {STEPS.map((item) => (
                    <li key={item.id}>
                      {item.title}: {saved[item.id] ? (saved[item.id]?.correct ? "Met" : "Missed") : "Open"}
                    </li>
                  ))}
                </ul>
              </div>
            ) : step ? (
              <StepBody stepId={step.id} menu={menu} setMenu={setMenu} />
            ) : null}
          </div>
          {!done && step && (step.id !== "p-pin" || menu === "choose") ? (
            <div className="reply-sheet grid gap-2 px-3 py-3">
              {picked === null ? (
                <>
                  <button type="button" className="reply-choice" onClick={() => choose(true)}>
                    {step.correct}
                  </button>
                  <button type="button" className="reply-choice" onClick={() => choose(false)}>
                    {step.wrong}
                  </button>
                </>
              ) : (
                <div className="lift grid gap-3 px-3 py-3">
                  <p className="text-lg font-extrabold">{picked ? "Met" : "Missed"}</p>
                  <p>{step.lesson}</p>
                  <button type="button" className="btn btn-primary" onClick={advance}>
                    {index === STEPS.length - 1 ? "See the score" : "Next step"}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StepBody({
  stepId,
  menu,
  setMenu,
}: {
  stepId: string;
  menu: "root" | "account" | "choose";
  setMenu: (value: "root" | "account" | "choose") => void;
}) {
  if (stepId === "p-pin") {
    if (menu === "root") {
      return (
        <div className="grid gap-2">
          <p className="text-sm text-muted">Settings</p>
          <MenuRow label="Account" onClick={() => setMenu("account")} />
          <MenuRow label="Chats" />
          <MenuRow label="Notifications" />
        </div>
      );
    }
    if (menu === "account") {
      return (
        <div className="grid gap-2">
          <p className="text-sm text-muted">Account</p>
          <MenuRow label="Two-step verification" onClick={() => setMenu("choose")} />
          <MenuRow label="Privacy" />
        </div>
      );
    }
    return (
      <div className="grid gap-3">
        <p>Set a PIN. Add an email. Do not share either.</p>
      </div>
    );
  }
  if (stepId === "p-code") {
    return (
      <div className="grid gap-3">
        <p className="rounded-2xl bg-[#243038] px-3 py-2 text-sm">
          Ama: Please help me vote. I sent a code by mistake. Send it to me.
        </p>
        <p className="rounded-2xl bg-[#1c1c1e] px-3 py-2 text-sm">
          Text message: 【WhatsApp】你的验证码是 382-194，请勿告诉他人。
        </p>
      </div>
    );
  }
  if (stepId === "p-call") {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-muted">Saved for Kofi</p>
        <p className="text-xl font-extrabold">024 318 2201</p>
        <p className="rounded-2xl bg-[#243038] px-3 py-2 text-sm">
          The chat asks for GHS 800 at 055 111 4488 and says not to call.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      <p>The account is gone. Friends were asked for money.</p>
    </div>
  );
}

function MenuRow({ label, onClick }: { label: string; onClick?: () => void }) {
  if (!onClick) {
    return <p className="min-h-12 rounded-xl bg-[#1a242c] px-3 py-3 text-[#d5dde6]">{label}</p>;
  }
  return (
    <button type="button" className="min-h-12 rounded-xl bg-[#243038] px-3 text-left font-semibold" onClick={onClick}>
      {label}
    </button>
  );
}
