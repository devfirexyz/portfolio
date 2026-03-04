"use client";

export function parseUiMessageStreamText(raw: string): string {
  let text = "";
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data: ")) {
      continue;
    }
    const payload = line.slice(6).trim();
    if (!payload || payload === "[DONE]") {
      continue;
    }
    try {
      const parsed = JSON.parse(payload) as { type?: unknown; delta?: unknown };
      if (parsed.type === "text-delta" && typeof parsed.delta === "string") {
        text += parsed.delta;
      }
    } catch {
      // Ignore non-JSON stream lines.
    }
  }
  return text.trim();
}
