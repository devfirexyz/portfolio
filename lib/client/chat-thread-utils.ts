"use client";

import type { UIMessage } from "ai";

import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";

export type ViewerType = "guest" | "member" | "owner";

export interface ChatThreadSummary {
  id: string;
  title: string;
  promptCount: number;
  locked: boolean;
  lastPreview: string;
  memory: string;
  createdAt: number;
  updatedAt: number;
}

export type HistoryMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  clientMessageId: string;
  threadClientId: string;
  createdAt: number;
  model: string | null;
};

export function getTextFromMessage(message: UIMessage): string {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  const textFromParts = parts
    .map((part) => {
      if (part && typeof part === "object" && "type" in part && "text" in part) {
        const typedPart = part as { type?: unknown; text?: unknown };
        if (typedPart.type === "text" && typeof typedPart.text === "string") {
          return typedPart.text;
        }
      }
      return "";
    })
    .filter(Boolean)
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

export function getLastUserPreview(messages: UIMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "user") {
      continue;
    }
    const text = getTextFromMessage(message).replace(/\s+/g, " ").trim();
    if (!text) {
      continue;
    }
    return text.length > 56 ? `${text.slice(0, 56)}...` : text;
  }
  return "";
}

export function buildCompactThreadMemory(messages: UIMessage[]): string {
  const items = messages
    .map((message) => {
      const text = getTextFromMessage(message);
      if (!text) {
        return null;
      }
      const prefix = message.role === "user" ? "User" : "Assistant";
      return `${prefix}: ${text.replace(/\s+/g, " ").trim()}`;
    })
    .filter((value): value is string => value !== null);

  return items.slice(-8).join("\n").slice(0, 1200);
}

export function buildGlobalMemory(threads: ChatThreadSummary[]): string {
  return sortThreads(threads)
    .map((thread) => thread.memory.trim())
    .filter(Boolean)
    .join("\n")
    .slice(-1200);
}

export function sortThreads(threads: ChatThreadSummary[]): ChatThreadSummary[] {
  return [...threads].sort((left, right) => right.updatedAt - left.updatedAt);
}

export function countUserPrompts(messages: UIMessage[]): number {
  return messages.reduce((count, message) => (message.role === "user" ? count + 1 : count), 0);
}

export function defaultThreadLabel(index: number): string {
  return `Thread ${index}`;
}

export function makeClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createThreadSummary(params: { viewerType: ViewerType; index: number }): ChatThreadSummary {
  const now = Date.now();
  return {
    id: makeClientId(),
    title: params.viewerType === "guest" ? "Guest Thread" : defaultThreadLabel(params.index),
    promptCount: 0,
    locked: false,
    lastPreview: "",
    memory: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function toUiMessageFromHistory(entry: HistoryMessage): UIMessage {
  return {
    id: entry.id || `${entry.clientMessageId}:${entry.role}`,
    role: entry.role,
    parts: [{ type: "text", text: entry.text }],
  } as UIMessage;
}

export function buildThreadsFromHistory(
  entries: HistoryMessage[],
  viewerType: ViewerType
): {
  threads: ChatThreadSummary[];
  messagesByThread: Map<string, UIMessage[]>;
} {
  const grouped = new Map<string, HistoryMessage[]>();

  for (const entry of entries) {
    const key = entry.threadClientId || "default";
    const bucket = grouped.get(key) ?? [];
    bucket.push(entry);
    grouped.set(key, bucket);
  }

  const resultThreads: ChatThreadSummary[] = [];
  const messagesByThread = new Map<string, UIMessage[]>();
  const sortedGroups = Array.from(grouped.entries()).sort((left, right) => {
    const leftTs = Math.max(...left[1].map((item) => item.createdAt));
    const rightTs = Math.max(...right[1].map((item) => item.createdAt));
    return rightTs - leftTs;
  });

  sortedGroups.forEach(([threadClientId, threadMessages], index) => {
    const sortedMessages = [...threadMessages].sort((a, b) => a.createdAt - b.createdAt);
    const uiMessages = sortedMessages.map(toUiMessageFromHistory);
    const promptCount = sortedMessages.filter((message) => message.role === "user").length;
    const updatedAt = sortedMessages.at(-1)?.createdAt ?? Date.now();
    const preview = getLastUserPreview(uiMessages);

    resultThreads.push({
      id: threadClientId,
      title: viewerType === "guest" ? "Guest Thread" : defaultThreadLabel(sortedGroups.length - index),
      promptCount,
      locked: viewerType === "guest" ? promptCount >= 1 : promptCount >= THREAD_PROMPT_LIMIT,
      lastPreview: preview,
      memory: buildCompactThreadMemory(uiMessages),
      createdAt: sortedMessages[0]?.createdAt ?? updatedAt,
      updatedAt,
    });
    messagesByThread.set(threadClientId, uiMessages);
  });

  return {
    threads: sortThreads(resultThreads),
    messagesByThread,
  };
}

export function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeWriteJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

export function safeReadString(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function safeWriteString(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

export function buildThreadListStorageKey(scope: string): string {
  return `portfolio-chat-threads:${scope}`;
}

export function buildActiveThreadStorageKey(scope: string): string {
  return `portfolio-chat-active-thread:${scope}`;
}

export function buildMemoryStorageKey(scope: string): string {
  return `portfolio-chat-memory:${scope}`;
}

export function buildThreadCacheScope(scope: string, threadClientId: string): string {
  return `${scope}:thread:${threadClientId}`;
}
