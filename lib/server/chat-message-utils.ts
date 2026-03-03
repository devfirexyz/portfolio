import type { UIMessage } from "ai";

export function extractLastUserPrompt(messages: UIMessage[]): string {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUserMessage) {
    return "";
  }

  const parts = (lastUserMessage.parts ?? []) as Array<Record<string, unknown>>;
  const textFromParts = parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => String(part.text))
    .join("\n")
    .trim();

  if (textFromParts) {
    return textFromParts;
  }

  const content = (lastUserMessage as { content?: unknown }).content;
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part) {
          const maybeText = (part as { text?: unknown }).text;
          return typeof maybeText === "string" ? maybeText : "";
        }

        return "";
      })
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

export function extractAssistantTextFromMessage(message: UIMessage): string {
  const parts = (message.parts ?? []) as Array<Record<string, unknown>>;

  const textFromParts = parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => String(part.text))
    .join("\n")
    .trim();

  if (textFromParts) {
    return textFromParts;
  }

  const content = (message as { content?: unknown }).content;
  if (typeof content === "string") {
    return content.trim();
  }

  return "";
}
