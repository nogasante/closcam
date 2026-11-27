import type { Scenario, Step } from "./types";

function stepText(step: Step): string {
  switch (step.type) {
    case "chat":
    case "sms":
      return step.messages.map((message) => `${message.sender}: ${message.text}`).join("\n");
    case "sms_preview":
      return `${step.sender}: ${step.text}`;
    case "call":
      return step.lines.map((line) => `${step.callerLabel}: ${line}`).join("\n");
    case "payment_page":
      return [
        step.title,
        step.merchant,
        step.amount,
        step.url,
        step.buttonLabel,
        step.finePrint,
      ].join(". ");
    case "scene":
      return `${step.speaker}: ${step.line}`;
    case "prompt":
      return `${step.title}. ${step.body} Pay ${step.amount} to ${step.destination}.`;
    default: {
      const unreachable: never = step;
      return unreachable;
    }
  }
}

export function scenarioScript(scenario: Scenario): string {
  return scenario.steps.map((step) => stepText(step)).join("\n\n");
}
