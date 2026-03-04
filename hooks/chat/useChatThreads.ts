"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UIMessage } from "ai";

import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import {
  buildActiveThreadStorageKey,
  buildCompactThreadMemory,
  buildGlobalMemory,
  buildMemoryStorageKey,
  buildThreadCacheScope,
  buildThreadListStorageKey,
  buildThreadsFromHistory,
  type ChatThreadSummary,
  countUserPrompts,
  createThreadSummary,
  defaultThreadLabel,
  getLastUserPreview,
  safeReadJson,
  safeReadString,
  safeWriteJson,
  safeWriteString,
  sortThreads,
  type ViewerType,
  type HistoryMessage,
} from "@/lib/client/chat-thread-utils";
import { replaceCachedMessages } from "@/lib/client/chat-cache/repository";

import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";

interface ChatHistoryPayload {
  messages: HistoryMessage[];
}

interface UseChatThreadsOptions {
  sessionScope: string | null;
  guestId: string;
  statusSnapshot: ChatStatusPayload | null;
  setMessages: (messages: UIMessage[]) => void;
}

export function useChatThreads({
  sessionScope,
  guestId,
  statusSnapshot,
  setMessages,
}: UseChatThreadsOptions) {
  const [threads, setThreads] = useState<ChatThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [requiresFreshThread, setRequiresFreshThread] = useState(false);
  const previousViewerTypeRef = useRef<ViewerType | null>(null);

  const globalMemoryContext = useMemo(() => buildGlobalMemory(threads), [threads]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  );

  // Detect guest → member transition
  useEffect(() => {
    const currentViewerType = statusSnapshot?.viewerType;
    if (!currentViewerType) {
      return;
    }
    const previousViewerType = previousViewerTypeRef.current;
    if (previousViewerType === "guest" && currentViewerType !== "guest") {
      setRequiresFreshThread(true);
    }
    previousViewerTypeRef.current = currentViewerType;
  }, [statusSnapshot?.viewerType]);

  // Persist threads and memory to localStorage when they change
  useEffect(() => {
    if (!sessionScope) {
      return;
    }
    safeWriteJson(buildThreadListStorageKey(sessionScope), threads);
    safeWriteString(buildMemoryStorageKey(sessionScope), globalMemoryContext);
  }, [globalMemoryContext, sessionScope, threads]);

  // Persist active thread to localStorage
  useEffect(() => {
    if (!sessionScope || !activeThreadId) {
      return;
    }
    safeWriteString(buildActiveThreadStorageKey(sessionScope), activeThreadId);
  }, [activeThreadId, sessionScope]);

  const updateThreadSnapshot = useCallback(
    (
      threadId: string,
      nextMessages: UIMessage[],
      options?: { forceLocked?: boolean; autoName?: boolean }
    ) => {
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

        // Auto-name: if title is the default label and we have a user message, rename it
        let title = existing.title;
        if (options?.autoName && existing.title.match(/^Thread \d+$|^Guest Thread$/)) {
          const firstUserMsg = nextMessages.find((m) => m.role === "user");
          if (firstUserMsg) {
            const firstText = getLastUserPreview([firstUserMsg]);
            if (firstText) {
              title = firstText.length > 40 ? `${firstText.slice(0, 40)}…` : firstText;
            }
          }
        }

        const updated: ChatThreadSummary = {
          ...existing,
          title,
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

  const createNewThread = useCallback(
    async (onNotice?: (msg: string) => void) => {
      if (!statusSnapshot || !sessionScope) {
        return;
      }
      if (statusSnapshot.viewerType === "guest" && statusSnapshot.guestPromptUsed) {
        onNotice?.("Guest prompt is consumed. Please log in for a new chat.");
        return;
      }

      const indexBase = threads.filter((thread) => !thread.title.toLowerCase().includes("guest")).length + 1;
      const created = createThreadSummary({
        viewerType: statusSnapshot.viewerType,
        index: indexBase,
      });

      setThreads((previous) => sortThreads([created, ...previous]));
      setActiveThreadId(created.id);
      setMessages([]);
      setRequiresFreshThread(false);
      await replaceCachedMessages(buildThreadCacheScope(sessionScope, created.id), []);
    },
    [sessionScope, setMessages, statusSnapshot, threads]
  );

  return {
    threads,
    setThreads,
    activeThreadId,
    setActiveThreadId,
    activeThread,
    requiresFreshThread,
    setRequiresFreshThread,
    globalMemoryContext,
    updateThreadSnapshot,
    ensureSessionThread,
    createNewThread,
  };
}

export type { ChatThreadSummary, ViewerType };
