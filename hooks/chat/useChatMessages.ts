"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";

import {
  buildThreadCacheScope,
  buildThreadsFromHistory,
  type HistoryMessage,
  type ViewerType,
} from "@/lib/client/chat-thread-utils";
import {
  getCachedMessages,
  pruneExpiredCache,
  replaceCachedMessages,
} from "@/lib/client/chat-cache/repository";
import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";
import type { ChatThreadSummary } from "@/hooks/chat/useChatThreads";

interface ChatHistoryPayload {
  messages: HistoryMessage[];
}

interface UseChatMessagesOptions {
  sessionScope: string | null;
  activeThreadId: string | null;
  threads: ChatThreadSummary[];
  guestId: string;
  statusSnapshot: ChatStatusPayload | null;
  messages: UIMessage[];
  status: string;
  setMessages: (messages: UIMessage[] | ((prev: UIMessage[]) => UIMessage[])) => void;
  setThreads: (updater: (prev: ChatThreadSummary[]) => ChatThreadSummary[]) => void;
  updateThreadSnapshot: (threadId: string, messages: UIMessage[], opts?: { autoName?: boolean }) => void;
  ensureSessionThread: (scope: string, viewerType: ViewerType, preferredId?: string) => Promise<string>;
}

export function useChatMessages({
  sessionScope,
  activeThreadId,
  guestId,
  statusSnapshot,
  messages,
  status,
  setMessages,
  setThreads,
  updateThreadSnapshot,
  ensureSessionThread,
}: UseChatMessagesOptions) {
  const hydratedScopeRef = useRef<string | null>(null);
  const threadCacheScope =
    sessionScope && activeThreadId ? buildThreadCacheScope(sessionScope, activeThreadId) : null;

  // Initial hydration: load threads and messages when scope first becomes available
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

  // Load messages when active thread changes
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
          return [...merged].sort((a, b) => b.updatedAt - a.updatedAt);
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
  }, [activeThreadId, guestId, sessionScope, setMessages, setThreads, statusSnapshot, threadCacheScope]);

  // Persist messages to Dexie only when streaming is complete (not on every token)
  useEffect(() => {
    if (!threadCacheScope) {
      return;
    }
    if (status !== "ready" && status !== "error") {
      return;
    }
    void replaceCachedMessages(threadCacheScope, messages);
  }, [messages, status, threadCacheScope]);

  // Update thread snapshot (with auto-naming) after streaming finishes
  useEffect(() => {
    if (!activeThreadId) {
      return;
    }
    if (status !== "ready" && status !== "error") {
      return;
    }
    updateThreadSnapshot(activeThreadId, messages, { autoName: true });
  }, [activeThreadId, messages, status, updateThreadSnapshot]);

  return { threadCacheScope };
}
