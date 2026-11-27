import { generateText } from "ai";
import { redact, scriptedLine, type Persona, type Turn } from "@/lib/call/engine";
import { gatewayModel, geminiLanguageModel, providerOrder } from "@/lib/server/gemini";

export const runtime = "nodejs";

const SYSTEM = `You are inside CloScam, a training simulation. You play one fictional caller. You are not a real company and you are not a real person.

Personas:
- security: PulseLink security. You claim a strange sign-in and you want the person to read back a text code. That code is a WhatsApp registration code sent because you started registration on a phone set to another language. Do not explain that unless the scene already ended.
- prize: a prize desk. You want a fee or a wallet PIN.
- care: PulsePay Care. You want a PIN or a one-time code, with a short deadline.

Rules:
- At most two short sentences.
- Fictional names only: PulseLink and PulsePay.
- Never claim to be a real network, a bank, the Bank of Ghana, the Cyber Security Authority, or the Police.
- Never ask for a real name, a real phone number, or a real PIN. The only code in this scene is a training code.
- Do not teach how to run this trick outside the call.
- Output only the spoken line.`;

function personaOf(value: unknown): Persona {
  if (value === "prize" || value === "care" || value === "security") return value;
  return "security";
}

export async function POST(request: Request) {
  let persona: Persona = "security";
  let history: Turn[] = [];
  try {
    const body = (await request.json()) as {
      persona?: unknown;
      history?: { role?: string; text?: string }[];
    };
    persona = personaOf(body.persona);
    if (Array.isArray(body.history)) {
      history = body.history.slice(-8).map((turn) => ({
        role: turn.role === "user" ? "user" : "scammer",
        text: redact(String(turn.text ?? "")),
      }));
    }
  } catch {
    return Response.json({ line: scriptedLine("security", []), source: "script" });
  }

  const fallback = scriptedLine(persona, history);
  const google = geminiLanguageModel();
  const gateway = gatewayModel();
  const order = providerOrder(Boolean(google), Boolean(gateway));
  const model = order === "gemini" ? google : order === "gateway" ? gateway : null;
  if (!model) {
    return Response.json({ line: fallback, source: "script" });
  }

  try {
    const transcript = history.map((turn) => `${turn.role}: ${turn.text}`).join("\n");
    const { text } = await generateText({
      model,
      system: SYSTEM,
      prompt: `Persona: ${persona}.\n\n${transcript || "(call just connected)"}\n\nNext line.`,
      maxOutputTokens: 80,
      temperature: 0.4,
    });
    const line = text.replace(/\s+/g, " ").trim().slice(0, 320);
    if (!line) return Response.json({ line: fallback, source: "script" });
    return Response.json({ line, source: "model" });
  } catch {
    return Response.json({ line: fallback, source: "script" });
  }
}
