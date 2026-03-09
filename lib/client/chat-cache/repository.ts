import Dexie from "dexie";
import type { UIMessage } from "ai";

import type { ChatThread } from "@/lib/chat-types";
import { CHAT_CACHE_TTL_MS, chatCacheDb } from "@/lib/client/chat-cache/db";

function withExpiry(now: number): number {
  return now + CHAT_CACHE_TTL_MS;
}

export async function pruneExpiredCache(now = Date.now()): Promise<void> {
  await chatCacheDb.transaction(
    "rw",
    chatCacheDb.localThreads,
    chatCacheDb.localMessages,
    async () => {
      await chatCacheDb.localThreads.where("expiresAt").below(now).delete();
      await chatCacheDb.localMessages.where("expiresAt").below(now).delete();
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
    async () => {
      await chatCacheDb.localThreads.where("viewerScope").equals(viewerScope).delete();
      await chatCacheDb.localMessages.where("viewerScope").equals(viewerScope).delete();
    }
  );
}

export async function getCachedThreadList(viewerScope: string): Promise<ChatThread[]> {
  const record = await chatCacheDb.localThreads.get(`threadlist:${viewerScope}`);
  if (!record?.threads) {
    return [];
  }
  try {
    return JSON.parse(record.threads) as ChatThread[];
  } catch {
    return [];
  }
}

export async function setCachedThreadList(viewerScope: string, threads: ChatThread[]): Promise<void> {
  const now = Date.now();
  await chatCacheDb.localThreads.put({
    id: `threadlist:${viewerScope}`,
    viewerScope,
    threads: JSON.stringify(threads),
    createdAt: now,
    updatedAt: now,
    expiresAt: withExpiry(now),
  });
}
