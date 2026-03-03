import { ConvexHttpClient } from "convex/browser";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type ViewerType = "guest" | "member" | "owner";

export type ChatStatusReason = "ok" | "guest_prompt_used" | "lifetime_limit_reached";

export interface ViewerIdentity {
  viewerType: ViewerType;
  identityKey: string;
  userId?: string;
}

export interface ChatStatusSnapshot {
  viewerType: ViewerType;
  canSend: boolean;
  reason: ChatStatusReason;
  guestPromptUsed: boolean;
  lifetimeUsed: number | null;
  lifetimeLimit: number | null;
}

export interface ChatHistoryMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  clientMessageId: string;
  threadClientId: string;
  createdAt: number;
  model: string | null;
}

export interface PreparePromptArgs {
  viewer: ViewerIdentity;
  prompt: string;
  clientMessageId: string;
  threadClientId?: string;
  now: number;
}

export type PreparePromptResult =
  | {
      type: "blocked";
      reason: ChatStatusReason | "too_many_requests" | "thread_prompt_limit_reached";
      message: string;
      statusCode: number;
      status: ChatStatusSnapshot;
    }
  | {
      type: "guest-static";
      threadId: string;
      status: ChatStatusSnapshot;
      responseText: string;
    }
  | {
      type: "accepted";
      threadId: string;
      status: ChatStatusSnapshot;
    }
  | {
      type: "duplicate";
      threadId: string;
      status: ChatStatusSnapshot;
      assistantText: string | null;
      model: string | null;
    };

export interface PersistAssistantArgs {
  viewer: ViewerIdentity;
  threadId: string;
  clientMessageId: string;
  text: string;
  model: string;
  usedFallbackModel: boolean;
  now: number;
}

interface InMemoryUser {
  identityKey: string;
  viewerType: ViewerType;
  lifetimePromptCount: number;
  guestPromptUsed: boolean;
  recentPromptTimestamps: number[];
  createdAt: number;
  updatedAt: number;
}

interface InMemoryThread {
  id: string;
  identityKey: string;
  clientThreadId: string;
  promptCount: number;
  createdAt: number;
  updatedAt: number;
}

interface InMemoryMessage {
  id: string;
  threadId: string;
  identityKey: string;
  clientMessageId: string;
  role: "user" | "assistant";
  text: string;
  model: string | null;
  createdAt: number;
}

interface ProcessedPrompt {
  assistantText: string | null;
  model: string | null;
}

interface InMemoryState {
  users: Map<string, InMemoryUser>;
  threadsByKey: Map<string, InMemoryThread>;
  messagesByThread: Map<string, InMemoryMessage[]>;
  processedByClientMessageKey: Map<string, ProcessedPrompt>;
}

interface PersistedState {
  users: InMemoryUser[];
  threadsByKey: Array<[string, InMemoryThread]>;
  messagesByThread: Array<[string, InMemoryMessage[]]>;
  processedByClientMessageKey: Array<[string, ProcessedPrompt]>;
}

const GUEST_STATIC_RESPONSE =
  "Please log in to continue. Use the Log In button in chat. I can help with Piyush Raj's full work persona: experience, projects, blogs, skills, and career context.";
const LIFETIME_LIMIT = 30;
const THREAD_PROMPT_LIMIT = 10;
const BURST_WINDOW_MS = 10_000;
const BURST_LIMIT = 5;

function getOwnerIds(): Set<string> {
  const raw = process.env.CHAT_OWNER_IDS ?? "";
  return new Set(
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  );
}

function buildStatus(user: InMemoryUser): ChatStatusSnapshot {
  if (user.viewerType === "guest") {
    return {
      viewerType: "guest",
      canSend: !user.guestPromptUsed,
      reason: user.guestPromptUsed ? "guest_prompt_used" : "ok",
      guestPromptUsed: user.guestPromptUsed,
      lifetimeUsed: null,
      lifetimeLimit: null,
    };
  }

  if (user.viewerType === "owner") {
    return {
      viewerType: "owner",
      canSend: true,
      reason: "ok",
      guestPromptUsed: false,
      lifetimeUsed: user.lifetimePromptCount,
      lifetimeLimit: null,
    };
  }

  const reachedLimit = user.lifetimePromptCount >= LIFETIME_LIMIT;
  return {
    viewerType: "member",
    canSend: !reachedLimit,
    reason: reachedLimit ? "lifetime_limit_reached" : "ok",
    guestPromptUsed: false,
    lifetimeUsed: user.lifetimePromptCount,
    lifetimeLimit: LIFETIME_LIMIT,
  };
}

function createState(): InMemoryState {
  return {
    users: new Map(),
    threadsByKey: new Map(),
    messagesByThread: new Map(),
    processedByClientMessageKey: new Map(),
  };
}

function stateFilePath(): string {
  return process.env.CHAT_STORE_FILE_PATH || path.join(os.tmpdir(), "portfolio-chat-store.json");
}

function serializeState(state: InMemoryState): PersistedState {
  return {
    users: Array.from(state.users.values()),
    threadsByKey: Array.from(state.threadsByKey.entries()),
    messagesByThread: Array.from(state.messagesByThread.entries()),
    processedByClientMessageKey: Array.from(state.processedByClientMessageKey.entries()),
  };
}

function deserializeState(payload: PersistedState): InMemoryState {
  const legacyThreads = (payload as { threadsByIdentity?: Array<[string, InMemoryThread]> }).threadsByIdentity;
  return {
    users: new Map(payload.users.map((user) => [user.identityKey, user])),
    threadsByKey: new Map(payload.threadsByKey ?? legacyThreads ?? []),
    messagesByThread: new Map(payload.messagesByThread),
    processedByClientMessageKey: new Map(payload.processedByClientMessageKey),
  };
}

function readStateFromDisk(): InMemoryState | null {
  try {
    const raw = fs.readFileSync(stateFilePath(), "utf8");
    if (!raw.trim()) {
      return null;
    }
    const parsed = JSON.parse(raw) as PersistedState;
    return deserializeState(parsed);
  } catch {
    return null;
  }
}

function writeStateToDisk(state: InMemoryState) {
  try {
    fs.writeFileSync(stateFilePath(), JSON.stringify(serializeState(state)));
  } catch {
    // Best-effort persistence fallback; runtime memory will still work in single process.
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __portfolioChatStore: InMemoryState | undefined;
  // eslint-disable-next-line no-var
  var __portfolioConvexClient: ConvexHttpClient | undefined;
}

function getState(): InMemoryState {
  const diskState = readStateFromDisk();
  if (diskState) {
    globalThis.__portfolioChatStore = diskState;
    return diskState;
  }

  if (!globalThis.__portfolioChatStore) {
    globalThis.__portfolioChatStore = createState();
  }
  return globalThis.__portfolioChatStore;
}

function getConvexClient(): ConvexHttpClient | null {
  const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!deploymentUrl) {
    return null;
  }

  if (!globalThis.__portfolioConvexClient) {
    globalThis.__portfolioConvexClient = new ConvexHttpClient(deploymentUrl);
  }

  return globalThis.__portfolioConvexClient;
}

function ensureUser(state: InMemoryState, viewer: ViewerIdentity, now: number): InMemoryUser {
  const existing = state.users.get(viewer.identityKey);
  if (existing) {
    existing.viewerType = viewer.viewerType;
    existing.updatedAt = now;
    return existing;
  }

  const created: InMemoryUser = {
    identityKey: viewer.identityKey,
    viewerType: viewer.viewerType,
    lifetimePromptCount: 0,
    guestPromptUsed: false,
    recentPromptTimestamps: [],
    createdAt: now,
    updatedAt: now,
  };

  state.users.set(viewer.identityKey, created);
  return created;
}

function toThreadKey(identityKey: string, clientThreadId: string): string {
  return `${identityKey}::${clientThreadId}`;
}

function ensureThread(
  state: InMemoryState,
  identityKey: string,
  clientThreadId: string,
  now: number
): InMemoryThread {
  const threadKey = toThreadKey(identityKey, clientThreadId);
  const existing = state.threadsByKey.get(threadKey);
  if (existing) {
    existing.updatedAt = now;
    return existing;
  }

  const created: InMemoryThread = {
    id: `thread_${identityKey.replace(/[^a-zA-Z0-9_-]/g, "_")}_${clientThreadId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    identityKey,
    clientThreadId,
    promptCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  state.threadsByKey.set(threadKey, created);
  state.messagesByThread.set(created.id, []);
  return created;
}

function appendMessage(state: InMemoryState, message: InMemoryMessage) {
  const bucket = state.messagesByThread.get(message.threadId) ?? [];
  bucket.push(message);
  state.messagesByThread.set(message.threadId, bucket);
}

function toClientMessageKey(identityKey: string, clientMessageId: string): string {
  return `${identityKey}::${clientMessageId}`;
}

function trimBurstWindow(user: InMemoryUser, now: number) {
  user.recentPromptTimestamps = user.recentPromptTimestamps.filter(
    (timestamp) => now - timestamp <= BURST_WINDOW_MS
  );
}

function preparePromptLocal(args: PreparePromptArgs): PreparePromptResult {
  const state = getState();
  const user = ensureUser(state, args.viewer, args.now);
  const clientThreadId = args.threadClientId ?? "default";
  const thread = ensureThread(state, args.viewer.identityKey, clientThreadId, args.now);
  const messageKey = toClientMessageKey(args.viewer.identityKey, args.clientMessageId);

  const knownPrompt = state.processedByClientMessageKey.get(messageKey);
  if (knownPrompt) {
    return {
      type: "duplicate",
      threadId: thread.id,
      status: buildStatus(user),
      assistantText: knownPrompt.assistantText,
      model: knownPrompt.model,
    };
  }

  const effectiveBurstLimit =
    process.env.CHAT_TEST_DISABLE_BURST === "1" ? Number.MAX_SAFE_INTEGER : BURST_LIMIT;

  trimBurstWindow(user, args.now);
  if (user.recentPromptTimestamps.length >= effectiveBurstLimit) {
    return {
      type: "blocked",
      reason: "too_many_requests",
      message: "Too many requests in a short time. Please wait a few seconds and retry.",
      statusCode: 429,
      status: buildStatus(user),
    };
  }

  if (user.viewerType === "guest") {
    if (user.guestPromptUsed) {
      return {
        type: "blocked",
        reason: "guest_prompt_used",
        message: "Guest prompt already used. Please log in to continue.",
        statusCode: 403,
        status: buildStatus(user),
      };
    }

    user.guestPromptUsed = true;
    user.recentPromptTimestamps.push(args.now);
    thread.promptCount += 1;

    appendMessage(state, {
      id: `${args.clientMessageId}_user`,
      threadId: thread.id,
      identityKey: args.viewer.identityKey,
      clientMessageId: args.clientMessageId,
      role: "user",
      text: args.prompt,
      model: null,
      createdAt: args.now,
    });

    appendMessage(state, {
      id: `${args.clientMessageId}_assistant`,
      threadId: thread.id,
      identityKey: args.viewer.identityKey,
      clientMessageId: args.clientMessageId,
      role: "assistant",
      text: GUEST_STATIC_RESPONSE,
      model: null,
      createdAt: args.now,
    });

    state.processedByClientMessageKey.set(messageKey, {
      assistantText: GUEST_STATIC_RESPONSE,
      model: null,
    });
    writeStateToDisk(state);

    return {
      type: "guest-static",
      threadId: thread.id,
      status: buildStatus(user),
      responseText: GUEST_STATIC_RESPONSE,
    };
  }

  if (user.viewerType === "member" && user.lifetimePromptCount >= LIFETIME_LIMIT) {
    return {
      type: "blocked",
      reason: "lifetime_limit_reached",
      message: "You have reached the 30-message lifetime limit. Please contact me via email for deeper discussion.",
      statusCode: 403,
      status: buildStatus(user),
    };
  }

  if (thread.promptCount >= THREAD_PROMPT_LIMIT) {
    return {
      type: "blocked",
      reason: "thread_prompt_limit_reached",
      message: `This chat thread reached the ${THREAD_PROMPT_LIMIT}-prompt limit. Please create a new chat thread.`,
      statusCode: 403,
      status: buildStatus(user),
    };
  }

  user.recentPromptTimestamps.push(args.now);
  user.lifetimePromptCount += user.viewerType === "member" ? 1 : 0;
  thread.promptCount += 1;

  appendMessage(state, {
    id: `${args.clientMessageId}_user`,
    threadId: thread.id,
    identityKey: args.viewer.identityKey,
    clientMessageId: args.clientMessageId,
    role: "user",
    text: args.prompt,
    model: null,
    createdAt: args.now,
  });

  state.processedByClientMessageKey.set(messageKey, {
    assistantText: null,
    model: null,
  });
  writeStateToDisk(state);

  return {
    type: "accepted",
    threadId: thread.id,
    status: buildStatus(user),
  };
}

function persistAssistantLocal(args: PersistAssistantArgs) {
  const state = getState();
  const user = ensureUser(state, args.viewer, args.now);
  const messageKey = toClientMessageKey(args.viewer.identityKey, args.clientMessageId);

  appendMessage(state, {
    id: `${args.clientMessageId}_assistant`,
    threadId: args.threadId,
    identityKey: args.viewer.identityKey,
    clientMessageId: args.clientMessageId,
    role: "assistant",
    text: args.text,
    model: args.model,
    createdAt: args.now,
  });

  state.processedByClientMessageKey.set(messageKey, {
    assistantText: args.text,
    model: args.model,
  });

  user.updatedAt = args.now;
  writeStateToDisk(state);
}

function getStatusLocal(viewer: ViewerIdentity): ChatStatusSnapshot {
  const state = getState();
  const user = state.users.get(viewer.identityKey);

  if (!user) {
    return buildStatus({
      identityKey: viewer.identityKey,
      viewerType: viewer.viewerType,
      lifetimePromptCount: 0,
      guestPromptUsed: false,
      recentPromptTimestamps: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return buildStatus(user);
}

function getHistoryLocal(viewer: ViewerIdentity): ChatHistoryMessage[] {
  const state = getState();
  const threadsById = new Map(Array.from(state.threadsByKey.values()).map((thread) => [thread.id, thread]));
  const rawMessages = Array.from(state.messagesByThread.values()).flatMap((messages) =>
    messages.filter((message) => message.identityKey === viewer.identityKey)
  );
  return [...rawMessages]
    .sort((left, right) => left.createdAt - right.createdAt)
    .map((message) => ({
      id: message.id,
      role: message.role,
      text: message.text,
      clientMessageId: message.clientMessageId,
      threadClientId: threadsById.get(message.threadId)?.clientThreadId ?? "default",
      createdAt: message.createdAt,
      model: message.model,
    }));
}

async function queryConvexStatus(viewer: ViewerIdentity): Promise<ChatStatusSnapshot | null> {
  const client = getConvexClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.query("chat:getStatus" as any, {
      identityKey: viewer.identityKey,
      viewerType: viewer.viewerType,
      userId: viewer.userId,
      ownerIds: Array.from(getOwnerIds()),
    });

    return result as ChatStatusSnapshot;
  } catch {
    return null;
  }
}

async function queryConvexHistory(viewer: ViewerIdentity): Promise<ChatHistoryMessage[] | null> {
  const client = getConvexClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.query("chat:getHistory" as any, {
      identityKey: viewer.identityKey,
    });

    return result as ChatHistoryMessage[];
  } catch {
    return null;
  }
}

async function mutateConvexPrepare(args: PreparePromptArgs): Promise<PreparePromptResult | null> {
  const client = getConvexClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.mutation("chat:preparePrompt" as any, {
      identityKey: args.viewer.identityKey,
      viewerType: args.viewer.viewerType,
      userId: args.viewer.userId,
      prompt: args.prompt,
      clientMessageId: args.clientMessageId,
      threadClientId: args.threadClientId ?? "default",
      now: args.now,
      ownerIds: Array.from(getOwnerIds()),
      lifetimeLimit: LIFETIME_LIMIT,
      threadPromptLimit: THREAD_PROMPT_LIMIT,
      burstLimit: BURST_LIMIT,
      burstWindowMs: BURST_WINDOW_MS,
      guestStaticResponse: GUEST_STATIC_RESPONSE,
    });

    return result as PreparePromptResult;
  } catch {
    return null;
  }
}

async function mutateConvexPersistAssistant(args: PersistAssistantArgs): Promise<boolean> {
  const client = getConvexClient();
  if (!client) {
    return false;
  }

  try {
    await client.mutation("chat:persistAssistant" as any, {
      identityKey: args.viewer.identityKey,
      viewerType: args.viewer.viewerType,
      userId: args.viewer.userId,
      threadId: args.threadId,
      clientMessageId: args.clientMessageId,
      text: args.text,
      model: args.model,
      usedFallbackModel: args.usedFallbackModel,
      now: args.now,
    });

    return true;
  } catch {
    return false;
  }
}

export async function getChatStatus(viewer: ViewerIdentity): Promise<ChatStatusSnapshot> {
  const convexStatus = await queryConvexStatus(viewer);
  if (convexStatus) {
    return convexStatus;
  }
  return getStatusLocal(viewer);
}

export async function getChatHistory(viewer: ViewerIdentity): Promise<ChatHistoryMessage[]> {
  const convexHistory = await queryConvexHistory(viewer);
  if (convexHistory) {
    return convexHistory;
  }
  return getHistoryLocal(viewer);
}

export async function preparePromptRequest(args: PreparePromptArgs): Promise<PreparePromptResult> {
  const convexResult = await mutateConvexPrepare(args);
  if (convexResult) {
    return convexResult;
  }
  return preparePromptLocal(args);
}

export async function persistAssistantResponse(args: PersistAssistantArgs): Promise<void> {
  const persisted = await mutateConvexPersistAssistant(args);
  if (!persisted) {
    persistAssistantLocal(args);
  }
}

export const CHAT_LIMITS = {
  lifetimeLimit: LIFETIME_LIMIT,
  threadPromptLimit: THREAD_PROMPT_LIMIT,
  burstLimit: BURST_LIMIT,
  burstWindowMs: BURST_WINDOW_MS,
  guestStaticResponse: GUEST_STATIC_RESPONSE,
} as const;
