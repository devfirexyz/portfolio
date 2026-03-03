"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Loader2,
  MessageSquareDashed,
  Plus,
  SendHorizontal,
  StopCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

import { ChatAuthControls } from "@/components/chat/ChatAuthControls";
import { NeoButton } from "@/components/neo/NeoButton";
import { useOutboxItems } from "@/lib/client/chat-cache/live";
import {
  getCachedMessages,
  pruneExpiredCache,
  replaceCachedMessages,
  upsertOutboxItem,
} from "@/lib/client/chat-cache/repository";
import { createSyncLoop, flushOutbox } from "@/lib/client/chat-cache/sync-engine";
import { cn } from "@/lib/utils";

const ProjectCardsWidget = dynamic(
  () =>
    import("@/components/chat/widgets/ProjectCardsWidget").then((mod) => ({
      default: mod.ProjectCardsWidget,
    })),
  { ssr: false, loading: () => null }
);

const BlogCardsWidget = dynamic(
  () =>
    import("@/components/chat/widgets/BlogCardsWidget").then((mod) => ({
      default: mod.BlogCardsWidget,
    })),
  { ssr: false, loading: () => null }
);

type ViewerType = "guest" | "member" | "owner";
type ChatStatusReason = "ok" | "guest_prompt_used" | "lifetime_limit_reached";

interface ChatStatusPayload {
  viewerType: ViewerType;
  canSend: boolean;
  reason: ChatStatusReason;
  guestPromptUsed: boolean;
  lifetimeUsed: number | null;
  lifetimeLimit: number | null;
}

interface ChatHistoryPayload {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    text: string;
    clientMessageId: string;
    threadClientId: string;
    createdAt: number;
    model: string | null;
  }>;
}

interface ProjectWidgetOutput {
  kind: "projects";
  items: Array<{
    id: string;
    title: string;
    description: string;
    href: string | null;
    tags: string[];
    meta: {
      impact: string;
      impactMetric: string;
      status: string;
      liveUnavailable?: boolean;
    };
  }>;
}

interface BlogWidgetOutput {
  kind: "blogs";
  items: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    tags: string[];
    meta: {
      publishedAt: string;
      readingTime: number;
      category: string | null;
      featured?: boolean;
    };
  }>;
}

interface ChatThreadSummary {
  id: string;
  title: string;
  promptCount: number;
  locked: boolean;
  lastPreview: string;
  memory: string;
  createdAt: number;
  updatedAt: number;
}

interface PortfolioChatSurfaceProps {
  onOpenContact: () => void;
}

const GUEST_ID_STORAGE_KEY = "portfolio-chat-guest-id";
const THREAD_PROMPT_LIMIT = 10;
const MAX_PROMPT_CHARS = 4800;

function buildThreadListStorageKey(scope: string): string {
  return `portfolio-chat-threads:${scope}`;
}

function buildActiveThreadStorageKey(scope: string): string {
  return `portfolio-chat-active-thread:${scope}`;
}

function buildMemoryStorageKey(scope: string): string {
  return `portfolio-chat-memory:${scope}`;
}

function buildThreadCacheScope(scope: string, threadClientId: string): string {
  return `${scope}:thread:${threadClientId}`;
}

function guestUsedStorageKey(guestId: string): string {
  return `portfolio-chat-guest-used:${guestId}`;
}

function defaultThreadLabel(index: number): string {
  return `Thread ${index}`;
}

function safeReadJson<T>(key: string, fallback: T): T {
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

function safeWriteJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

function safeReadString(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function safeWriteString(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

function makeClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function createThreadSummary(params: { viewerType: ViewerType; index: number }): ChatThreadSummary {
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

function sortThreads(threads: ChatThreadSummary[]): ChatThreadSummary[] {
  return [...threads].sort((left, right) => right.updatedAt - left.updatedAt);
}

function countUserPrompts(messages: UIMessage[]): number {
  return messages.reduce((count, message) => (message.role === "user" ? count + 1 : count), 0);
}

function getTextFromMessage(message: UIMessage): string {
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

function getLastUserPreview(messages: UIMessage[]): string {
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

function buildCompactThreadMemory(messages: UIMessage[]): string {
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

function buildGlobalMemory(threads: ChatThreadSummary[]): string {
  return sortThreads(threads)
    .map((thread) => thread.memory.trim())
    .filter(Boolean)
    .join("\n")
    .slice(-1200);
}

function getProjectWidgets(message: UIMessage): ProjectWidgetOutput[] {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  return parts
    .map((part) => {
      const typedPart = part as {
        type?: unknown;
        state?: unknown;
        output?: unknown;
      };
      if (typedPart.type !== "tool-get_projects" || typedPart.state !== "output-available") {
        return null;
      }
      const output = typedPart.output as ProjectWidgetOutput | undefined;
      if (!output || output.kind !== "projects" || !Array.isArray(output.items)) {
        return null;
      }
      return output;
    })
    .filter((value): value is ProjectWidgetOutput => value !== null);
}

function getBlogWidgets(message: UIMessage): BlogWidgetOutput[] {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  return parts
    .map((part) => {
      const typedPart = part as {
        type?: unknown;
        state?: unknown;
        output?: unknown;
      };
      if (typedPart.type !== "tool-get_blogs" || typedPart.state !== "output-available") {
        return null;
      }
      const output = typedPart.output as BlogWidgetOutput | undefined;
      if (!output || output.kind !== "blogs" || !Array.isArray(output.items)) {
        return null;
      }
      return output;
    })
    .filter((value): value is BlogWidgetOutput => value !== null);
}

function buildUsageLabel(status: ChatStatusPayload | null): string {
  if (!status) {
    return "Checking usage policy...";
  }
  if (status.viewerType === "guest") {
    return status.guestPromptUsed ? "1 / 1 guest prompt used" : "0 / 1 guest prompt used";
  }
  if (status.lifetimeLimit === null) {
    return `${status.lifetimeUsed ?? 0} prompts used (owner mode)`;
  }
  return `${status.lifetimeUsed ?? 0} / ${status.lifetimeLimit} lifetime prompts used`;
}

function toUiMessageFromHistory(entry: ChatHistoryPayload["messages"][number]): UIMessage {
  return {
    id: entry.id || `${entry.clientMessageId}:${entry.role}`,
    role: entry.role,
    parts: [{ type: "text", text: entry.text }],
  } as UIMessage;
}

function parseUiMessageStreamText(raw: string): string {
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

function buildThreadsFromHistory(entries: ChatHistoryPayload["messages"], viewerType: ViewerType): {
  threads: ChatThreadSummary[];
  messagesByThread: Map<string, UIMessage[]>;
} {
  const grouped = new Map<string, ChatHistoryPayload["messages"]>();

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

function guardPrompt(prompt: string): { ok: true } | { ok: false; message: string } {
  if (prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      message: `Prompt is too long. Keep it under ${MAX_PROMPT_CHARS} characters.`,
    };
  }
  return { ok: true };
}

export function PortfolioChatSurface({ onOpenContact }: PortfolioChatSurfaceProps) {
  const [guestId, setGuestId] = useState("");
  const [composerText, setComposerText] = useState("");
  const [statusSnapshot, setStatusSnapshot] = useState<ChatStatusPayload | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [requiresFreshThread, setRequiresFreshThread] = useState(false);
  const [threads, setThreads] = useState<ChatThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const promptFormRef = useRef<HTMLFormElement | null>(null);
  const guestIdRef = useRef("");
  const previousViewerTypeRef = useRef<ViewerType | null>(null);
  const limitModalOpenedRef = useRef(false);
  const hydratedScopeRef = useRef<string | null>(null);
  const activeThreadIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setIsOnline(window.navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let existing = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
    if (!existing) {
      existing = makeClientId();
      window.localStorage.setItem(GUEST_ID_STORAGE_KEY, existing);
    }
    setGuestId(existing);
  }, []);

  useEffect(() => {
    guestIdRef.current = guestId;
  }, [guestId]);

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: () => {
          const currentGuestId = guestIdRef.current;
          const headers: Record<string, string> = {};
          if (currentGuestId) {
            headers["x-chat-guest-id"] = currentGuestId;
          }
          return headers;
        },
        prepareSendMessagesRequest: async ({ messages, requestMetadata }) => ({
          body: {
            messages,
            requestMetadata,
          },
        }),
      }),
    []
  );

  const refreshStatus = useCallback(async () => {
    if (!guestId) {
      return;
    }
    setStatusError(null);
    try {
      const response = await fetch("/api/chat/status", {
        headers: { "x-chat-guest-id": guestId },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Status request failed (${response.status})`);
      }
      const payload = (await response.json()) as ChatStatusPayload;
      const locallyUsed =
        payload.viewerType === "guest" &&
        typeof window !== "undefined" &&
        Boolean(window.localStorage.getItem(guestUsedStorageKey(guestId)));

      if (locallyUsed) {
        setStatusSnapshot({
          ...payload,
          canSend: false,
          reason: "guest_prompt_used",
          guestPromptUsed: true,
        });
      } else {
        setStatusSnapshot(payload);
      }
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Failed to check chat status.");
    }
  }, [guestId]);

  const { messages, sendMessage, setMessages, status, stop, error } = useChat<UIMessage>({
    transport,
    onFinish: () => {
      void refreshStatus();
    },
    onError: () => {
      void refreshStatus();
    },
  });

  const sessionScope = useMemo(() => {
    if (!statusSnapshot || !guestId) {
      return null;
    }
    if (statusSnapshot.viewerType === "guest") {
      return `guest:${guestId}`;
    }
    if (statusSnapshot.viewerType === "owner") {
      return "owner";
    }
    return "member";
  }, [guestId, statusSnapshot]);

  const threadCacheScope = useMemo(() => {
    if (!sessionScope || !activeThreadId) {
      return null;
    }
    return buildThreadCacheScope(sessionScope, activeThreadId);
  }, [activeThreadId, sessionScope]);

  const outboxItems = useOutboxItems(sessionScope ?? "__none__");
  const outboxPendingIds = useMemo(() => new Set(outboxItems.map((item) => item.id)), [outboxItems]);
  const viewerType = statusSnapshot?.viewerType;

  const globalMemoryContext = useMemo(() => buildGlobalMemory(threads), [threads]);
  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  );
  const activeHistoryItems = useMemo(() => {
    const items = messages
      .map((message, index) => {
        if (message.role !== "user") {
          return null;
        }
        const text = getTextFromMessage(message);
        if (!text) {
          return null;
        }
        return {
          id: message.id,
          preview: text.length > 64 ? `${text.slice(0, 64)}...` : text,
          order: index,
        };
      })
      .filter((value): value is { id: string; preview: string; order: number } => value !== null);
    return items.reverse();
  }, [messages]);

  const updateThreadSnapshot = useCallback(
    (threadId: string, nextMessages: UIMessage[], options?: { forceLocked?: boolean }) => {
      const promptCount = countUserPrompts(nextMessages);
      const lastPreview = getLastUserPreview(nextMessages);
      const memory = buildCompactThreadMemory(nextMessages);
      const now = Date.now();

      setThreads((previous) => {
        const existing = previous.find((thread) => thread.id === threadId);
        if (!existing) {
          return previous;
        }
        const lockedByCount = promptCount >= THREAD_PROMPT_LIMIT;
        const lockedByGuest =
          statusSnapshot?.viewerType === "guest" && statusSnapshot.guestPromptUsed && promptCount >= 1;
        const updated: ChatThreadSummary = {
          ...existing,
          promptCount,
          locked: options?.forceLocked ?? (existing.locked || lockedByCount || lockedByGuest),
          lastPreview: lastPreview || existing.lastPreview,
          memory,
          updatedAt: now,
        };
        return sortThreads([updated, ...previous.filter((thread) => thread.id !== threadId)]);
      });
    },
    [statusSnapshot?.guestPromptUsed, statusSnapshot?.viewerType]
  );

  const ensureSessionThread = useCallback(
    async (scope: string, viewerType: ViewerType, preferredThreadId?: string): Promise<string> => {
      const rawStoredThreads = safeReadJson<ChatThreadSummary[]>(buildThreadListStorageKey(scope), []);
      let nextThreads = rawStoredThreads.filter((thread) => typeof thread.id === "string");

      if (nextThreads.length === 0) {
        try {
          const response = await fetch("/api/chat/history", {
            cache: "no-store",
            headers: { "x-chat-guest-id": guestId },
          });
          if (response.ok) {
            const payload = (await response.json()) as ChatHistoryPayload;
            if (Array.isArray(payload.messages) && payload.messages.length > 0) {
              const { threads: historyThreads, messagesByThread } = buildThreadsFromHistory(
                payload.messages,
                viewerType
              );
              nextThreads = historyThreads;
              for (const [threadId, threadMessages] of messagesByThread.entries()) {
                await replaceCachedMessages(buildThreadCacheScope(scope, threadId), threadMessages);
              }
            }
          }
        } catch {
          // Ignore history hydration errors.
        }
      }

      if (nextThreads.length === 0) {
        nextThreads = [createThreadSummary({ viewerType, index: 1 })];
      } else {
        nextThreads = sortThreads(nextThreads);
      }

      const storedActive = safeReadString(buildActiveThreadStorageKey(scope));
      const resolvedActive =
        preferredThreadId && nextThreads.some((thread) => thread.id === preferredThreadId)
          ? preferredThreadId
          : nextThreads.some((thread) => thread.id === storedActive)
            ? storedActive
            : nextThreads[0].id;

      safeWriteJson(buildThreadListStorageKey(scope), nextThreads);
      safeWriteString(buildActiveThreadStorageKey(scope), resolvedActive);
      safeWriteString(buildMemoryStorageKey(scope), buildGlobalMemory(nextThreads));
      setThreads(nextThreads);
      setActiveThreadId(resolvedActive);
      return resolvedActive;
    },
    [guestId]
  );

  useEffect(() => {
    if (!guestId) {
      return;
    }
    void refreshStatus();
  }, [guestId, refreshStatus]);

  useEffect(() => {
    if (!guestId) {
      return;
    }
    const intervalId = window.setInterval(() => {
      void refreshStatus();
    }, 8_000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [guestId, refreshStatus]);

  useEffect(() => {
    if (!guestId) {
      return;
    }
    const onFocus = () => {
      void refreshStatus();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshStatus();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [guestId, refreshStatus]);

  useEffect(() => {
    const currentViewerType = statusSnapshot?.viewerType;
    if (!currentViewerType) {
      return;
    }
    const previousViewerType = previousViewerTypeRef.current;
    if (previousViewerType === "guest" && currentViewerType !== "guest") {
      setRequiresFreshThread(true);
      setInlineNotice("Guest thread is locked after login. Create a new chat to continue.");
    }
    previousViewerTypeRef.current = currentViewerType;
  }, [statusSnapshot?.viewerType]);

  useEffect(() => {
    if (statusSnapshot?.reason !== "lifetime_limit_reached") {
      return;
    }
    if (limitModalOpenedRef.current) {
      return;
    }
    limitModalOpenedRef.current = true;
    onOpenContact();
  }, [onOpenContact, statusSnapshot?.reason]);

  useEffect(() => {
    if (!sessionScope || !statusSnapshot) {
      return;
    }
    if (hydratedScopeRef.current === sessionScope) {
      return;
    }
    let cancelled = false;
    void (async () => {
      await pruneExpiredCache();
      const activeThread = await ensureSessionThread(sessionScope, statusSnapshot.viewerType);
      if (cancelled) {
        return;
      }
      const initialMessages = await getCachedMessages(buildThreadCacheScope(sessionScope, activeThread));
      if (cancelled) {
        return;
      }
      setMessages(initialMessages);
      hydratedScopeRef.current = sessionScope;
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureSessionThread, sessionScope, setMessages, statusSnapshot]);

  useEffect(() => {
    if (!threadCacheScope || !activeThreadId) {
      return;
    }
    let cancelled = false;
    void (async () => {
      const cached = await getCachedMessages(threadCacheScope);
      if (cancelled) {
        return;
      }
      if (cached.length > 0) {
        setMessages(cached);
        return;
      }

      if (!sessionScope || !statusSnapshot) {
        setMessages([]);
        return;
      }

      try {
        const response = await fetch("/api/chat/history", {
          cache: "no-store",
          headers: { "x-chat-guest-id": guestId },
        });
        if (!response.ok) {
          setMessages([]);
          return;
        }
        const payload = (await response.json()) as ChatHistoryPayload;
        if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
          setMessages([]);
          return;
        }

        const { threads: historyThreads, messagesByThread } = buildThreadsFromHistory(
          payload.messages,
          statusSnapshot.viewerType
        );
        setThreads((previous) => {
          const existingIds = new Set(previous.map((thread) => thread.id));
          const merged = [
            ...previous,
            ...historyThreads.filter((thread) => !existingIds.has(thread.id)),
          ];
          return sortThreads(merged);
        });

        for (const [historyThreadId, threadMessages] of messagesByThread.entries()) {
          await replaceCachedMessages(buildThreadCacheScope(sessionScope, historyThreadId), threadMessages);
        }

        if (cancelled) {
          return;
        }
        setMessages(messagesByThread.get(activeThreadId) ?? []);
      } catch {
        setMessages([]);
      }

      if (cancelled) {
        return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeThreadId, guestId, sessionScope, setMessages, statusSnapshot, threadCacheScope]);

  useEffect(() => {
    if (!sessionScope) {
      return;
    }
    safeWriteJson(buildThreadListStorageKey(sessionScope), threads);
    safeWriteString(buildMemoryStorageKey(sessionScope), globalMemoryContext);
  }, [globalMemoryContext, sessionScope, threads]);

  useEffect(() => {
    if (!sessionScope || !activeThreadId) {
      return;
    }
    safeWriteString(buildActiveThreadStorageKey(sessionScope), activeThreadId);
  }, [activeThreadId, sessionScope]);

  useEffect(() => {
    if (!threadCacheScope) {
      return;
    }
    const shouldPersist =
      status === "ready" || status === "error" || (statusSnapshot?.viewerType === "guest" && messages.length > 0);
    if (!shouldPersist) {
      return;
    }
    void replaceCachedMessages(threadCacheScope, messages);
  }, [messages, status, statusSnapshot?.viewerType, threadCacheScope]);

  useEffect(() => {
    if (!activeThreadId) {
      return;
    }
    if (status !== "ready" && status !== "error") {
      return;
    }
    updateThreadSnapshot(activeThreadId, messages);
  }, [activeThreadId, messages, status, updateThreadSnapshot]);

  const runOutboxSync = useCallback(async () => {
    if (!sessionScope || !viewerType || viewerType === "guest" || !window.navigator.onLine) {
      return;
    }
    await flushOutbox({
      viewerScope: sessionScope,
      guestId,
      onAccepted: (acceptedItems) => {
        for (const accepted of acceptedItems) {
          if (accepted.threadClientId !== activeThreadIdRef.current) {
            continue;
          }
          setMessages((previous) => {
            const next = [...previous];
            if (!next.some((message) => message.id === accepted.clientMessageId)) {
              next.push({
                id: accepted.clientMessageId,
                role: "user",
                parts: [{ type: "text", text: accepted.prompt }],
              } as UIMessage);
            }
            const assistantId = `${accepted.clientMessageId}:assistant`;
            if (!next.some((message) => message.id === assistantId)) {
              next.push({
                id: assistantId,
                role: "assistant",
                parts: [{ type: "text", text: accepted.assistantText }],
              } as UIMessage);
            }
            return next;
          });
          if (accepted.resultStatus === "accepted") {
            setThreads((previous) => {
              const existing = previous.find((thread) => thread.id === accepted.threadClientId);
              if (!existing) {
                return previous;
              }
              const nextPromptCount = existing.promptCount + 1;
              const updated: ChatThreadSummary = {
                ...existing,
                promptCount: nextPromptCount,
                locked: existing.locked || nextPromptCount >= THREAD_PROMPT_LIMIT,
                lastPreview: accepted.prompt.slice(0, 56),
                updatedAt: Date.now(),
              };
              return sortThreads([updated, ...previous.filter((thread) => thread.id !== accepted.threadClientId)]);
            });
          }
        }
      },
      onLimitReached: () => {
        setStatusSnapshot((previous) =>
          previous
            ? {
                ...previous,
                canSend: false,
                reason: "lifetime_limit_reached",
              }
            : previous
        );
        onOpenContact();
      },
      onStatusSync: (syncedStatus) => {
        if (!syncedStatus) {
          return;
        }
        setStatusSnapshot((previous) =>
          previous
            ? {
                ...previous,
                canSend: syncedStatus.canSend,
                reason:
                  syncedStatus.reason === "guest_prompt_used" || syncedStatus.reason === "lifetime_limit_reached"
                    ? syncedStatus.reason
                    : "ok",
                lifetimeUsed: syncedStatus.lifetimeUsed ?? previous.lifetimeUsed,
                lifetimeLimit: syncedStatus.lifetimeLimit ?? previous.lifetimeLimit,
              }
            : previous
        );
      },
    });
  }, [activeThreadIdRef, guestId, onOpenContact, sessionScope, setMessages, viewerType]);

  useEffect(() => {
    if (!sessionScope || !viewerType || viewerType === "guest") {
      return;
    }
    const cleanup = createSyncLoop(runOutboxSync);
    void runOutboxSync();
    return cleanup;
  }, [runOutboxSync, sessionScope, viewerType]);

  useEffect(() => {
    if (!messageViewportRef.current) {
      return;
    }
    messageViewportRef.current.scrollTo({
      top: messageViewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, outboxItems.length, status]);

  const createNewThread = useCallback(async () => {
    if (!statusSnapshot || !sessionScope) {
      return;
    }
    if (statusSnapshot.viewerType === "guest" && statusSnapshot.guestPromptUsed) {
      setInlineNotice("Guest prompt is consumed. Please log in for a new chat.");
      return;
    }

    if (activeThreadId && messages.length > 0) {
      updateThreadSnapshot(activeThreadId, messages);
    }

    const indexBase = threads.filter((thread) => !thread.title.toLowerCase().includes("guest")).length + 1;
    const created = createThreadSummary({
      viewerType: statusSnapshot.viewerType,
      index: indexBase,
    });

    setThreads((previous) => sortThreads([created, ...previous]));
    setActiveThreadId(created.id);
    setMessages([]);
    setComposerText("");
    setInlineNotice(null);
    setRequiresFreshThread(false);
    await replaceCachedMessages(buildThreadCacheScope(sessionScope, created.id), []);
  }, [activeThreadId, messages, sessionScope, setMessages, statusSnapshot, threads, updateThreadSnapshot]);

  const jumpToMessage = useCallback((messageId: string) => {
    const target = document.getElementById(`chat-msg-${messageId}`);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const canSend = statusSnapshot?.canSend ?? false;
  const isSubmitting = status === "submitted" || status === "streaming";
  const isGuestOffline = statusSnapshot?.viewerType === "guest" && !isOnline;
  const isStatusLoading = statusSnapshot === null;
  const threadPromptLimitReached = Boolean(activeThread && activeThread.promptCount >= THREAD_PROMPT_LIMIT);
  const isComposerDisabled =
    isSubmitting || isStatusLoading || !canSend || isGuestOffline || requiresFreshThread || threadPromptLimitReached;
  const lifetimeLimitReached = statusSnapshot?.reason === "lifetime_limit_reached";
  const isGuestUsed = statusSnapshot?.viewerType === "guest" && statusSnapshot.guestPromptUsed;

  const onComposerKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    promptFormRef.current?.requestSubmit();
  }, []);

  const submitPrompt = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setInlineNotice(null);

      const prompt = composerText.trim();
      if (!prompt) {
        return;
      }
      if (!statusSnapshot || !activeThreadId) {
        setInlineNotice("Chat is still loading. Please wait a moment.");
        return;
      }

      const promptGuard = guardPrompt(prompt);
      if (!promptGuard.ok) {
        setInlineNotice(promptGuard.message);
        return;
      }

      if (requiresFreshThread) {
        setInlineNotice("Create a new chat thread to continue after login.");
        return;
      }
      if (threadPromptLimitReached) {
        setInlineNotice("This thread reached 10 prompts. Create a new chat thread.");
        return;
      }
      if (!statusSnapshot.canSend) {
        if (statusSnapshot.reason === "lifetime_limit_reached") {
          onOpenContact();
          setInlineNotice("Lifetime limit reached. Continue through the contact form.");
          return;
        }
        setInlineNotice("Guest prompt already used. Please log in to continue.");
        return;
      }

      const clientMessageId = makeClientId();
      const requestMetadata = {
        clientMessageId,
        threadClientId: activeThreadId,
        threadMemory: globalMemoryContext,
      };

      if (!isOnline && statusSnapshot.viewerType !== "guest" && sessionScope) {
        const optimisticUser = {
          id: clientMessageId,
          role: "user",
          parts: [{ type: "text", text: prompt }],
        } as UIMessage;
        const nextMessages = [...messages, optimisticUser];

        setMessages(nextMessages);
        setComposerText("");
        updateThreadSnapshot(activeThreadId, nextMessages);

        await upsertOutboxItem({
          id: clientMessageId,
          viewerScope: sessionScope,
          text: prompt,
          threadClientId: activeThreadId,
        });
        setInlineNotice("Message queued offline. It will sync when you're online.");
        return;
      }

      if (!isOnline && statusSnapshot.viewerType === "guest") {
        setInlineNotice("Guest prompt requires internet access.");
        return;
      }

      if (statusSnapshot.viewerType === "guest") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(guestUsedStorageKey(guestId), "1");
        }
        setStatusSnapshot((previous) =>
          previous
            ? {
                ...previous,
                guestPromptUsed: true,
                canSend: false,
                reason: "guest_prompt_used",
              }
            : previous
        );

        const userMessage = {
          id: clientMessageId,
          role: "user",
          parts: [{ type: "text", text: prompt }],
        } as UIMessage;
        const optimisticMessages = [...messages, userMessage];
        setComposerText("");
        setMessages(optimisticMessages);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-chat-guest-id": guestId,
            },
            body: JSON.stringify({
              messages: [
                {
                  id: `${clientMessageId}:user`,
                  role: "user",
                  parts: [{ type: "text", text: prompt }],
                },
              ],
              requestMetadata,
            }),
          });

          const raw = await response.text();
          const assistantText = parseUiMessageStreamText(raw) || "Please log in to continue.";
          const assistantId = `${clientMessageId}:assistant`;
          const nextMessages = [
            ...optimisticMessages,
            {
              id: assistantId,
              role: "assistant",
              parts: [{ type: "text", text: assistantText }],
            } as UIMessage,
          ];
          setMessages(nextMessages);
          updateThreadSnapshot(activeThreadId, nextMessages, { forceLocked: true });
        } catch (submitError) {
          setInlineNotice(submitError instanceof Error ? submitError.message : "Failed to send message.");
        } finally {
          await refreshStatus();
        }

        return;
      }

      try {
        await sendMessage(
          { text: prompt },
          {
            metadata: requestMetadata,
          }
        );
        setComposerText("");
      } catch (submitError) {
        setInlineNotice(submitError instanceof Error ? submitError.message : "Failed to send message.");
      } finally {
        await refreshStatus();
      }
    },
    [
      activeThreadId,
      composerText,
      globalMemoryContext,
      guestId,
      isOnline,
      messages,
      onOpenContact,
      refreshStatus,
      requiresFreshThread,
      sendMessage,
      sessionScope,
      setMessages,
      statusSnapshot,
      threadPromptLimitReached,
      updateThreadSnapshot,
    ]
  );

  const lastMessageId = messages.at(-1)?.id;
  const activeThreadPromptCount = activeThread?.promptCount ?? 0;
  const threadCounterLabel =
    statusSnapshot?.viewerType === "guest"
      ? "Guest thread"
      : `Thread ${activeThreadPromptCount} / ${THREAD_PROMPT_LIMIT}`;

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:shadow-[10px_10px_0px_0px_var(--nb-shadow-color)]">
      <aside className="hidden min-h-0 w-72 shrink-0 border-r-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-3 lg:flex lg:flex-col lg:gap-3">
        <NeoButton size="sm" variant="ghost" onClick={() => void createNewThread()} disabled={isGuestUsed}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Chat
        </NeoButton>

        <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          {buildUsageLabel(statusSnapshot)}
        </div>
        <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          {isOnline ? "Online" : "Offline"}
        </div>
        {statusSnapshot?.viewerType !== "guest" && activeThread ? (
          <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
            Thread {activeThread.promptCount} / {THREAD_PROMPT_LIMIT}
          </div>
        ) : null}
        {outboxItems.length > 0 ? (
          <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-inverse)]">
            {outboxItems.length} queued
          </div>
        ) : null}

        <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
          <div className="border-b-2 border-[var(--nb-border)] px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
            Threads
          </div>
          <div className="max-h-48 overflow-y-auto p-2">
            <div className="space-y-2">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full border-2 px-2 py-2 text-left shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] transition-transform hover:-translate-y-[1px]",
                    thread.id === activeThreadId
                      ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                      : "border-[var(--nb-border)] bg-[var(--nb-background)] text-[var(--nb-foreground)]"
                  )}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.12em]">
                    {thread.title} {thread.locked ? "(locked)" : ""}
                  </p>
                  <p className="mt-1 text-[11px] font-bold">{thread.promptCount} prompts</p>
                  {thread.lastPreview ? (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] opacity-80">{thread.lastPreview}</p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
          <div className="border-b-2 border-[var(--nb-border)] px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
            History
          </div>
          <div className="max-h-full overflow-y-auto p-2">
            {activeHistoryItems.length === 0 ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
                No prompts yet.
              </p>
            ) : (
              <div className="space-y-2">
                {activeHistoryItems.map((item, index) => (
                  <button
                    key={`${item.id}:${index}`}
                    type="button"
                    onClick={() => jumpToMessage(item.id)}
                    className="w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-2 py-2 text-left shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] transition-transform hover:-translate-y-[1px]"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                      Prompt {activeHistoryItems.length - index}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-[var(--nb-foreground)]">{item.preview}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <ChatAuthControls onFallbackContact={onOpenContact} />
          <NeoButton size="sm" variant="secondary" onClick={onOpenContact}>
            Contact Me
          </NeoButton>
        </div>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]">
                Portfolio Chat
              </p>
              <h1 className="text-balance text-base font-black uppercase leading-tight tracking-[0.08em] text-[var(--nb-foreground)] sm:text-lg">
                Ask About Piyush&apos;s Work Persona
              </h1>
              <p className="mt-1 break-words text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
                {buildUsageLabel(statusSnapshot)}
              </p>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
              <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] lg:hidden">
                {isOnline ? <Wifi className="mr-1 h-3.5 w-3.5" /> : <WifiOff className="mr-1 h-3.5 w-3.5" />}
                {isOnline ? "Online" : "Offline"}
              </span>
              <div className="lg:hidden">
                <ChatAuthControls onFallbackContact={onOpenContact} />
              </div>
              <NeoButton size="sm" variant="secondary" className="lg:hidden" onClick={onOpenContact}>
                Contact
              </NeoButton>
              <Link
                href="/"
                className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="space-y-2 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-3 lg:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <NeoButton size="sm" variant="ghost" onClick={() => void createNewThread()} disabled={isGuestUsed}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Chat
            </NeoButton>
            <span className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
              {threadCounterLabel}
            </span>
          </div>
          <div className="overflow-x-auto pb-1 [scrollbar-gutter:stable]">
            <div className="flex min-w-max gap-2">
              {threads.map((thread) => (
                <button
                  key={`mobile-thread-${thread.id}`}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  disabled={isSubmitting}
                  className={cn(
                    "inline-flex h-9 items-center border-2 px-3 text-[11px] font-black uppercase tracking-[0.1em] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]",
                    thread.id === activeThreadId
                      ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                      : "border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)]"
                  )}
                >
                  {thread.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={messageViewportRef}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-b-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 [scrollbar-gutter:stable] sm:p-5"
        >
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center border-2 border-dashed border-[var(--nb-border-subtle)] bg-[var(--nb-surface)] p-6 text-center">
                <div>
                  <MessageSquareDashed className="mx-auto mb-3 h-7 w-7 text-[var(--nb-foreground-muted)]" />
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
                    Ask about experience, projects, blogs, skills, and career track.
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
                    Enter to send. Shift+Enter for new line.
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = getTextFromMessage(message);
              const projectWidgets = getProjectWidgets(message);
              const blogWidgets = getBlogWidgets(message);
              const isQueued = isUser && outboxPendingIds.has(message.id);
              const showStreamingPlaceholder =
                !isUser && status === "streaming" && message.id === lastMessageId && text.length === 0;

              return (
                <article
                  id={`chat-msg-${message.id}`}
                  key={message.id}
                  className={cn("flex w-full min-w-0", isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "min-w-0 w-fit max-w-[min(100%,44rem)] border-2 p-3 shadow-[5px_5px_0px_0px_var(--nb-shadow-color)]",
                      isUser
                        ? "sm:min-w-[10rem] border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                        : "sm:min-w-[14rem] border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)]"
                    )}
                  >
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                      {isUser ? "You" : "Piyush Assistant"}
                    </p>
                    {text ? <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{text}</p> : null}

                    {showStreamingPlaceholder ? (
                      <div className="inline-flex items-center text-xs uppercase tracking-[0.12em] text-[var(--nb-foreground-subtle)]">
                        <span className="mr-2 inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)]" />
                          <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)] [animation-delay:120ms]" />
                          <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)] [animation-delay:240ms]" />
                        </span>
                        Streaming
                      </div>
                    ) : null}

                    {!isUser &&
                      projectWidgets.map((payload, index) => (
                        <ProjectCardsWidget key={`${message.id}:projects:${index}`} items={payload.items} />
                      ))}
                    {!isUser &&
                      blogWidgets.map((payload, index) => (
                        <BlogCardsWidget key={`${message.id}:blogs:${index}`} items={payload.items} />
                      ))}

                    {isQueued ? (
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.11em] text-white/90">
                        Queued for sync
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}

            {isSubmitting ? (
              <div className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-2 text-xs font-bold uppercase tracking-[0.11em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Streaming…
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 space-y-3 bg-[var(--nb-surface)] p-3 sm:p-5">
          {statusError ? (
            <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Policy check failed: {statusError}
            </p>
          ) : null}

          {error ? (
            <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Chat error: {error.message}
            </p>
          ) : null}

          {inlineNotice ? (
            <p
              aria-live="polite"
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]"
            >
              {inlineNotice}
            </p>
          ) : null}

          {lifetimeLimitReached ? (
            <div className="flex flex-col gap-3 border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-3 text-[var(--nb-border)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-black uppercase tracking-[0.12em]">
                Lifetime limit reached. Continue on email.
              </p>
              <NeoButton size="sm" variant="secondary" onClick={onOpenContact}>
                Open Contact Form
              </NeoButton>
            </div>
          ) : null}

          {requiresFreshThread ? (
            <div className="flex items-center justify-between border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)]">
                Guest thread locked. Start a new logged-in chat.
              </p>
              <NeoButton size="sm" variant="secondary" onClick={() => void createNewThread()}>
                New Chat
              </NeoButton>
            </div>
          ) : null}

          {threadPromptLimitReached ? (
            <div className="flex items-center justify-between border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)]">
                Thread limit reached. Create a new thread to continue.
              </p>
              <NeoButton size="sm" variant="secondary" onClick={() => void createNewThread()}>
                New Thread
              </NeoButton>
            </div>
          ) : null}

          <form
            ref={promptFormRef}
            className="flex flex-col gap-3 border-t-2 border-[var(--nb-border)] pt-3 sm:flex-row"
            onSubmit={submitPrompt}
          >
            <textarea
              id="portfolio-chat-prompt"
              name="prompt"
              aria-label="Chat prompt"
              rows={2}
              value={composerText}
              disabled={isComposerDisabled}
              onChange={(event) => setComposerText(event.target.value)}
              onKeyDown={onComposerKeyDown}
              placeholder={
                lifetimeLimitReached
                  ? "Prompt limit reached. Use the contact form."
                  : "Ask about experience, projects, blogs, skills…"
              }
              className={cn(
                "w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]",
                isComposerDisabled ? "cursor-not-allowed opacity-70" : ""
              )}
            />

            <div className="flex shrink-0 gap-2 sm:flex-col">
              <NeoButton type="submit" size="sm" className="w-full sm:w-auto" disabled={isComposerDisabled}>
                <SendHorizontal className="mr-1.5 h-4 w-4" />
                Send
              </NeoButton>
              {isSubmitting ? (
                <NeoButton type="button" size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => void stop()}>
                  <StopCircle className="mr-1.5 h-4 w-4" />
                  Stop
                </NeoButton>
              ) : null}
            </div>
          </form>

          {statusSnapshot?.viewerType === "guest" ? (
            <div className="border-t-2 border-[var(--nb-border)] pt-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
                Guest mode allows one prompt. Log in for the full 30 prompt chat.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
