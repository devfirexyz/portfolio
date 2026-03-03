export const MAX_PROMPT_CHARS = 4800;
export const MAX_PROMPT_ESTIMATED_TOKENS = 1200;

export type ChatGuardrailReason =
  | "input_too_long"
  | "unsafe_input"
  | "ok";

export interface ChatGuardrailResult {
  ok: boolean;
  reason: ChatGuardrailReason;
  message?: string;
}

const UNSAFE_PATTERNS: RegExp[] = [
  /<\s*script/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /ignore\s+all\s+previous\s+instructions/gi,
  /reveal\s+(the\s+)?(system|developer)\s+prompt/gi,
  /\b(?:kill|attack|explosive|bomb|weapon)\b/gi,
];

export function estimatePromptTokens(input: string): number {
  return Math.ceil(input.length / 4);
}

export function validatePromptInput(input: string): ChatGuardrailResult {
  const normalized = input.trim();

  if (!normalized) {
    return { ok: false, reason: "unsafe_input", message: "Prompt cannot be empty." };
  }

  if (normalized.length > MAX_PROMPT_CHARS || estimatePromptTokens(normalized) > MAX_PROMPT_ESTIMATED_TOKENS) {
    return {
      ok: false,
      reason: "input_too_long",
      message: `Please keep prompts under ${MAX_PROMPT_CHARS} characters (~${MAX_PROMPT_ESTIMATED_TOKENS} tokens).`,
    };
  }

  if (UNSAFE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return {
      ok: false,
      reason: "unsafe_input",
      message: "Your message violates chat safety rules. Please rephrase and try again.",
    };
  }

  return { ok: true, reason: "ok" };
}
