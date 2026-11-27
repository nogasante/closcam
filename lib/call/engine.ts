export type Persona = "security" | "prize" | "care";

export type Turn = { role: "user" | "scammer"; text: string };

const LINES: Record<Persona, string[]> = {
  security: [
    "Good day. This is PulseLink security. We see a sign-in we do not recognise. We sent a code by text. Read it back so we can protect the account.",
    "The text may look strange. Just read the digits. That confirms the line is yours.",
    "If you wait, they will message your family for money. Read the code now.",
  ],
  prize: [
    "Congratulations. You have won GHS 5,000. Send GHS 50 PulsePay to 055 200 7781, or give me the wallet PIN so I can credit you.",
    "The desk closes soon. The fee is the only way to release it.",
    "Read the PIN and I will push the prize through.",
  ],
  care: [
    "PulsePay Care. Your wallet will be blocked in 10 minutes unless you confirm the code we sent.",
    "I cannot see it on my side. Read the PIN or the code slowly.",
    "Last time. The code, or the block goes through.",
  ],
};

export function scriptedLine(persona: Persona, history: Turn[]): string {
  const said = history.filter((turn) => turn.role === "scammer").length;
  const lines = LINES[persona];
  return lines[Math.min(said, lines.length - 1)] ?? lines[0];
}

export function judgeUtterance(text: string): "win" | "loss" | "push" {
  const value = text.toLowerCase();
  if (
    /\b(hang up|stop|scam|i will not|i won't|won't|do not|don't|official|report)\b/.test(value) ||
    /^(no|nope)\b/.test(value)
  ) {
    return "win";
  }
  const digits = value.replace(/\D/g, "");
  if (/\b(pin|otp|password|code)\b/.test(value) || digits.length >= 4) {
    return "loss";
  }
  if (/\b(send|transfer|take it|go ahead|yes)\b/.test(value)) return "loss";
  return "push";
}

export function redact(text: string): string {
  return text.replace(/\d[\d\s-]{3,}/g, "[code]").slice(0, 400);
}

export function displayUtterance(text: string): string {
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 4 && digits !== "382194") {
    return "You entered a code. It was not saved.";
  }
  if (digits.includes("382194")) {
    return "You read back the code from the text.";
  }
  return text.trim().slice(0, 240);
}
