import { createGoogleGenerativeAI } from "@ai-sdk/google";

const MODEL_ID = "gemini-2.5-flash";

/** Server only. Never log the return value or print the environment. */
export function readGeminiKey(): string | undefined {
  const named = process.env.closcam_gemini_api ?? process.env.GEMINI_API_KEY;
  if (typeof named !== "string") return undefined;
  const key = named.trim();
  return key.length > 0 ? key : undefined;
}

export function geminiLanguageModel() {
  const apiKey = readGeminiKey();
  if (!apiKey) return null;
  const google = createGoogleGenerativeAI({ apiKey });
  return google(MODEL_ID);
}

export function gatewayModel(): string | null {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) return null;
  return process.env.AI_GATEWAY_MODEL ?? "google/gemini-2.5-flash";
}
