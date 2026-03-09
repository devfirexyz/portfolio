"use client";

import { useCallback, useEffect, useState } from "react";

type ViewerType = "guest" | "member" | "owner";
type ChatStatusReason = "ok" | "guest_prompt_used" | "lifetime_limit_reached";

export interface ChatStatusPayload {
  viewerType: ViewerType;
  identityKey: string;
  canSend: boolean;
  reason: ChatStatusReason;
  guestPromptUsed: boolean;
  lifetimeUsed: number | null;
  lifetimeLimit: number | null;
}

function guestUsedStorageKey(guestId: string): string {
  return `portfolio-chat-guest-used:${guestId}`;
}

export function useChatStatus(guestId: string) {
  const [statusSnapshot, setStatusSnapshot] = useState<ChatStatusPayload | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const refreshStatus = useCallback(async (): Promise<ChatStatusPayload | null> => {
    if (!guestId) {
      return null;
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
        const snapshot: ChatStatusPayload = {
          ...payload,
          canSend: false,
          reason: "guest_prompt_used",
          guestPromptUsed: true,
        };
        setStatusSnapshot(snapshot);
        return snapshot;
      } else {
        setStatusSnapshot(payload);
        return payload;
      }
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Failed to check chat status.");
      return null;
    }
  }, [guestId]);

  // Fetch on mount
  useEffect(() => {
    if (!guestId) {
      return;
    }
    void refreshStatus();
  }, [guestId, refreshStatus]);

  // Refresh on focus and visibility change (no polling)
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

  return { statusSnapshot, setStatusSnapshot, statusError, refreshStatus };
}
