import Dexie, { type EntityTable } from "dexie";
import type { UIMessage } from "ai";

export type OutboxSyncStatus = "pending" | "syncing" | "synced" | "failed" | "blocked_by_limit";

export interface LocalThread {
  id: string;
  viewerScope: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface LocalMessage {
  id: string;
  viewerScope: string;
  order: number;
  message: UIMessage;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface OutboxItem {
  id: string;
  viewerScope: string;
  threadClientId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: OutboxSyncStatus;
  attempts: number;
  expiresAt: number;
}

export interface SyncState {
  key: string;
  viewerScope: string;
  lastSyncAt?: number;
  nextRetryAt?: number;
  lastError?: string;
  updatedAt: number;
}

class PortfolioChatDexie extends Dexie {
  localThreads!: EntityTable<LocalThread, "id">;
  localMessages!: EntityTable<LocalMessage, "id">;
  outbox!: EntityTable<OutboxItem, "id">;
  syncState!: EntityTable<SyncState, "key">;

  constructor() {
    super("portfolio-chat-cache");

    this.version(1).stores({
      localThreads: "id, viewerScope, updatedAt, [viewerScope+updatedAt], expiresAt",
      localMessages:
        "id, viewerScope, order, [viewerScope+order], updatedAt, expiresAt",
      outbox: "id, viewerScope, syncStatus, [viewerScope+syncStatus], createdAt, expiresAt",
      syncState: "key, viewerScope, updatedAt",
    });
  }
}

export const chatCacheDb = new PortfolioChatDexie();

export const CHAT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
