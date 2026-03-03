"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { chatCacheDb, type OutboxItem } from "@/lib/client/chat-cache/db";

export function useOutboxItems(viewerScope: string): OutboxItem[] {
  return (
    useLiveQuery(async () => {
      return chatCacheDb.outbox
        .where("viewerScope")
        .equals(viewerScope)
        .sortBy("createdAt");
    }, [viewerScope], []) ?? []
  );
}

export function useOutboxCount(viewerScope: string): number {
  return (
    useLiveQuery(async () => {
      return chatCacheDb.outbox.where("viewerScope").equals(viewerScope).count();
    }, [viewerScope], 0) ?? 0
  );
}
