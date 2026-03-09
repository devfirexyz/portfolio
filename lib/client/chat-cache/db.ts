import Dexie, { type EntityTable } from "dexie";
import type { UIMessage } from "ai";

export interface LocalThread {
  id: string;
  viewerScope: string;
  threads?: string; // JSON.stringify(ChatThread[]) for threadlist:* records
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

class PortfolioChatDexie extends Dexie {
  localThreads!: EntityTable<LocalThread, "id">;
  localMessages!: EntityTable<LocalMessage, "id">;

  constructor() {
    super("portfolio-chat-cache");

    this.version(1).stores({
      localThreads: "id, viewerScope, updatedAt, [viewerScope+updatedAt], expiresAt",
      localMessages: "id, viewerScope, order, [viewerScope+order], updatedAt, expiresAt",
      outbox: "id, viewerScope, syncStatus, [viewerScope+syncStatus], createdAt, expiresAt",
      syncState: "key, viewerScope, updatedAt",
    });

    this.version(2).stores({
      localThreads: "id, viewerScope, updatedAt, expiresAt",
      localMessages: "id, viewerScope, order, [viewerScope+order], updatedAt, expiresAt",
      outbox: null,
      syncState: null,
    });
  }
}

export const chatCacheDb = new PortfolioChatDexie();

export const CHAT_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
