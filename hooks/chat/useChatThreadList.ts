"use client";

import { useCallback, useEffect, useState } from "react";

import type { ChatThread } from "@/lib/chat-types";
import { getCachedThreadList, setCachedThreadList } from "@/lib/client/chat-cache/repository";

export function useChatThreadList(guestId: string, sessionScope: string | null) {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  const refresh = useCallback(async () => {
    if (!sessionScope) {
      return;
    }
    // 1. Dexie-first: instant display
    const cached = await getCachedThreadList(sessionScope);
    if (cached.length > 0) {
      setThreads(cached);
    }
    // 2. Fetch fresh from server, update Dexie
    try {
      const res = await fetch("/api/chat/threads", {
        headers: { "x-chat-guest-id": guestId },
        cache: "no-store",
      });
      if (!res.ok) {
        return;
      }
      const { threads: fresh } = (await res.json()) as { threads: ChatThread[] };
      setThreads(fresh);
      await setCachedThreadList(sessionScope, fresh);
    } catch {
      // Keep showing cached threads if server fetch fails
    }
  }, [guestId, sessionScope]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { threads, refresh };
}
