import Dexie from "dexie";
import type { UIMessage } from "ai";

import {
  CHAT_CACHE_TTL_MS,
  chatCacheDb,
  type OutboxItem,
  type OutboxSyncStatus,
} from "@/lib/client/chat-cache/db";

function withExpiry(now: number): number {
  return now + CHAT_CACHE_TTL_MS;
}

export async function pruneExpiredCache(now = Date.now()): Promise<void> {
  await chatCacheDb.transaction(
    "rw",
    chatCacheDb.localThreads,
    chatCacheDb.localMessages,
    chatCacheDb.outbox,
    async () => {
      await chatCacheDb.localThreads.where("expiresAt").below(now).delete();
      await chatCacheDb.localMessages.where("expiresAt").below(now).delete();
      await chatCacheDb.outbox.where("expiresAt").below(now).delete();
    }
  );
}

export async function getCachedMessages(viewerScope: string): Promise<UIMessage[]> {
  const rows = await chatCacheDb.localMessages
    .where("[viewerScope+order]")
    .between([viewerScope, Dexie.minKey], [viewerScope, Dexie.maxKey])
    .sortBy("order");

  return rows.map((row) => row.message);
}

export async function replaceCachedMessages(viewerScope: string, messages: UIMessage[]): Promise<void> {
  const now = Date.now();

  await chatCacheDb.transaction(
    "rw",
    chatCacheDb.localThreads,
    chatCacheDb.localMessages,
    async () => {
      await chatCacheDb.localMessages.where("viewerScope").equals(viewerScope).delete();

      if (messages.length > 0) {
        await chatCacheDb.localMessages.bulkAdd(
          messages.map((message, order) => ({
            id: `${viewerScope}:${message.id}:${order}`,
            viewerScope,
            order,
            message,
            createdAt: now,
            updatedAt: now,
            expiresAt: withExpiry(now),
          }))
        );
      }

      await chatCacheDb.localThreads.put({
        id: viewerScope,
        viewerScope,
        createdAt: now,
        updatedAt: now,
        expiresAt: withExpiry(now),
      });
    }
  );
}

export async function clearScope(viewerScope: string): Promise<void> {
  await chatCacheDb.transaction(
    "rw",
    chatCacheDb.localThreads,
    chatCacheDb.localMessages,
    chatCacheDb.outbox,
    chatCacheDb.syncState,
    async () => {
      await chatCacheDb.localThreads.where("viewerScope").equals(viewerScope).delete();
      await chatCacheDb.localMessages.where("viewerScope").equals(viewerScope).delete();
      await chatCacheDb.outbox.where("viewerScope").equals(viewerScope).delete();
      await chatCacheDb.syncState.where("viewerScope").equals(viewerScope).delete();
    }
  );
}

export async function upsertOutboxItem(input: {
  id: string;
  viewerScope: string;
  text: string;
  threadClientId: string;
}): Promise<void> {
  const now = Date.now();

  await chatCacheDb.outbox.put({
    id: input.id,
    viewerScope: input.viewerScope,
    text: input.text,
    threadClientId: input.threadClientId,
    createdAt: now,
    updatedAt: now,
    syncStatus: "pending",
    attempts: 0,
    expiresAt: withExpiry(now),
  });
}

export async function resetStuckSyncing(viewerScope: string): Promise<void> {
  const stuck = await chatCacheDb.outbox
    .where("[viewerScope+syncStatus]")
    .equals([viewerScope, "syncing"])
    .toArray();

  if (stuck.length > 0) {
    const now = Date.now();
    await chatCacheDb.outbox.bulkPut(
      stuck.map((item) => ({ ...item, syncStatus: "pending" as const, updatedAt: now }))
    );
  }
}

export async function listPendingOutbox(viewerScope: string): Promise<OutboxItem[]> {
  const [pending, syncing] = await Promise.all([
    chatCacheDb.outbox
      .where("[viewerScope+syncStatus]")
      .equals([viewerScope, "pending"])
      .toArray(),
    chatCacheDb.outbox
      .where("[viewerScope+syncStatus]")
      .equals([viewerScope, "syncing"])
      .toArray(),
  ]);

  return [...pending, ...syncing].sort((a, b) => a.createdAt - b.createdAt);
}

export async function setOutboxStatus(
  id: string,
  status: OutboxSyncStatus,
  viewerScope: string,
  error?: string
): Promise<void> {
  const now = Date.now();
  const existing = await chatCacheDb.outbox.get(id);

  await chatCacheDb.outbox.update(id, {
    syncStatus: status,
    updatedAt: now,
    attempts: (existing?.attempts ?? 0) + 1,
    expiresAt: withExpiry(now),
  });

  if (status === "failed") {
    await chatCacheDb.syncState.put({
      key: "sync-state",
      viewerScope,
      lastError: error,
      updatedAt: now,
      nextRetryAt: now + 5_000,
    });
  }
}

export async function deleteOutboxItem(id: string): Promise<void> {
  await chatCacheDb.outbox.delete(id);
}

export async function markSyncSuccess(viewerScope: string): Promise<void> {
  await chatCacheDb.syncState.put({
    key: "sync-state",
    viewerScope,
    lastSyncAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function getOutboxCount(viewerScope: string): Promise<number> {
  return chatCacheDb.outbox.where("viewerScope").equals(viewerScope).count();
}
