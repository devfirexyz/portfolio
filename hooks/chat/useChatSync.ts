"use client";

import { useCallback, useEffect } from "react";
import type { UIMessage } from "ai";

import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import { createSyncLoop, flushOutbox } from "@/lib/client/chat-cache/sync-engine";
import { sortThreads } from "@/lib/client/chat-thread-utils";
import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";
import type { ChatThreadSummary } from "@/hooks/chat/useChatThreads";

interface UseChatSyncOptions {
  sessionScope: string | null;
  viewerType: "guest" | "member" | "owner" | undefined;
  guestId: string;
  activeThreadIdRef: React.RefObject<string | null>;
  setMessages: (updater: (prev: UIMessage[]) => UIMessage[]) => void;
  setThreads: (updater: (prev: ChatThreadSummary[]) => ChatThreadSummary[]) => void;
  setStatusSnapshot: (updater: (prev: ChatStatusPayload | null) => ChatStatusPayload | null) => void;
  onOpenContact: () => void;
}

export function useChatSync({
  sessionScope,
  viewerType,
  guestId,
  activeThreadIdRef,
  setMessages,
  setThreads,
  setStatusSnapshot,
  onOpenContact,
}: UseChatSyncOptions) {
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
                  syncedStatus.reason === "guest_prompt_used" ||
                  syncedStatus.reason === "lifetime_limit_reached"
                    ? syncedStatus.reason
                    : "ok",
                lifetimeUsed: syncedStatus.lifetimeUsed ?? previous.lifetimeUsed,
                lifetimeLimit: syncedStatus.lifetimeLimit ?? previous.lifetimeLimit,
              }
            : previous
        );
      },
    });
  }, [activeThreadIdRef, guestId, onOpenContact, sessionScope, setMessages, setStatusSnapshot, setThreads, viewerType]);

  useEffect(() => {
    if (!sessionScope || !viewerType || viewerType === "guest") {
      return;
    }
    const cleanup = createSyncLoop(runOutboxSync);
    void runOutboxSync();
    return cleanup;
  }, [runOutboxSync, sessionScope, viewerType]);

  return { runOutboxSync };
}
