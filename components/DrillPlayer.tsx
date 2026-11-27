"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Choice, Scenario, Step } from "@/lib/types";
import { recordFirstTry, rememberChoice, rememberDrill, useProgress } from "@/lib/storage";
import { CallScript } from "./CallScript";
import { ChatThread } from "./ChatThread";
import { ChoiceList } from "./ChoiceList";
import { PageShell } from "./PageShell";
import { PaymentPageFrame } from "./PaymentPageFrame";
import { PromptCard } from "./PromptCard";
import { SceneCard } from "./SceneCard";
import { SmsPreview, SmsThread } from "./SmsThread";

function stepCount(step: Step): number {
  if (step.type === "chat" || step.type === "sms") {
    return step.messages.length;
  }
  if (step.type === "call") {
    return step.lines.length;
  }
  return 1;
}

function nextLabel(step: Step): string {
  if (step.type === "call") {
    return "Next line";
  }
  if (step.type === "chat" || step.type === "sms") {
    return "Next message";
  }
  return "Continue";
}

export function DrillPlayer({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const progress = useProgress();
  const [phase, setPhase] = useState<"setup" | "surface">("setup");
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const [note, setNote] = useState<string | null>(null);

  const step = scenario.steps[stepIndex];
  const total = step ? stepCount(step) : 1;
  const revealed = visible >= total;
  const last = stepIndex >= scenario.steps.length - 1;
  const already = progress.results[scenario.id];

  useEffect(() => {
    rememberDrill(scenario.id);
  }, [scenario.id]);

  function openSurface() {
    rememberDrill(scenario.id);
    setPhase("surface");
    setStepIndex(0);
    setVisible(1);
    setNote(null);
  }

  function revealMore() {
    if (!step) {
      return;
    }
    if (!revealed) {
      setVisible((count) => count + 1);
      return;
    }
    if (!last) {
      setStepIndex((index) => index + 1);
      setVisible(1);
      setNote(null);
    }
  }

  function select(choice: Choice) {
    recordFirstTry(scenario.id, choice.correct);
    rememberChoice(scenario.id, choice.id);
    router.push(`/feedback/${scenario.id}`);
  }

  function showChoices() {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("choices")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  const leave = (
    <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold">
      Leave drill
    </Link>
  );

  if (!step) {
    return null;
  }

  return (
    <PageShell action={leave} banner={phase === "surface"}>
      <p className="text-sm font-semibold text-muted">
        Drill {scenario.number} of 10
        {scenario.headline ? " · Start here" : ""}
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{scenario.title}</h1>

      {phase === "setup" ? (
        <div className="mt-4 rounded-2xl border border-line bg-card px-4 py-4">
          <p>{scenario.setup}</p>
          <p className="mt-3 text-sm font-semibold text-banner">This is a simulation.</p>
          <button type="button" className="btn btn-primary mt-4" onClick={openSurface}>
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {scenario.steps.length > 1 ? (
            <p className="mb-2 text-sm font-semibold text-muted">
              Part {stepIndex + 1} of {scenario.steps.length}
            </p>
          ) : null}
          {already ? (
            <p className="mb-3 rounded-xl bg-[#f6f1e8] px-3 py-2 text-sm">
              You already answered this drill. Your first answer is the one that counts.
            </p>
          ) : null}
          <Surface
            step={step}
            visible={visible}
            note={note}
            onCancel={() => {
              setNote(
                "You pressed Cancel on the fake prompt. Pick the matching choice below. That is what gets scored.",
              );
              showChoices();
            }}
            onApprove={() => {
              setNote(
                "PIN entry is turned off. If you would have entered a PIN, pick that choice below.",
              );
              showChoices();
            }}
          />
          {revealed && last ? (
            <ChoiceList scenarioId={scenario.id} choices={scenario.choices} onSelect={select} />
          ) : (
            <button type="button" className="btn btn-primary mt-4" onClick={revealMore}>
              {revealed ? "Continue" : nextLabel(step)}
            </button>
          )}
        </div>
      )}
    </PageShell>
  );
}

function Surface({
  step,
  visible,
  note,
  onCancel,
  onApprove,
}: {
  step: Step;
  visible: number;
  note: string | null;
  onCancel: () => void;
  onApprove: () => void;
}) {
  switch (step.type) {
    case "chat":
      return <ChatThread contact={step.contact} messages={step.messages} visible={visible} />;
    case "sms":
      return <SmsThread sender={step.sender} messages={step.messages} visible={visible} />;
    case "sms_preview":
      return <SmsPreview sender={step.sender} text={step.text} />;
    case "call":
      return (
        <CallScript
          callerId={step.callerId}
          callerLabel={step.callerLabel}
          lines={step.lines}
          visible={visible}
        />
      );
    case "payment_page":
      return <PaymentPageFrame step={step} onApprove={onApprove} note={note} />;
    case "scene":
      return <SceneCard place={step.place} speaker={step.speaker} line={step.line} />;
    case "prompt":
      return <PromptCard step={step} onCancel={onCancel} onApprove={onApprove} note={note} />;
    default: {
      const unreachable: never = step;
      return unreachable;
    }
  }
}
