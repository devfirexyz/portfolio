"use client";

import {
  deleteOutboxItem,
  listPendingOutbox,
  markSyncSuccess,
  setOutboxStatus,
} from "@/lib/client/chat-cache/repository";

interface SyncAcceptedItem {
  clientMessageId: string;
  status: "accepted" | "duplicate";
  assistantText: string;
}

interface SyncRejectedItem {
  clientMessageId: string;
  status: "rejected_limit" | "rejected_guardrail" | "rejected_other";
  reason: string;
}

interface SyncResponsePayload {
  results: Array<SyncAcceptedItem | SyncRejectedItem>;
  status?: {
    canSend: boolean;
    reason: string;
    lifetimeUsed: number | null;
    lifetimeLimit: number | null;
  };
}

interface FlushOutboxOptions {
  viewerScope: string;
  guestId: string;
  onAccepted: (
    items: Array<{
      clientMessageId: string;
      prompt: string;
      assistantText: string;
      threadClientId: string;
      resultStatus: "accepted" | "duplicate";
    }>
  ) => void;
  onLimitReached: () => void;
  onStatusSync?: (status: SyncResponsePayload["status"]) => void;
}

export async function flushOutbox(options: FlushOutboxOptions): Promise<void> {
  const pending = await listPendingOutbox(options.viewerScope);
  if (pending.length === 0) {
    return;
  }

  const batch = pending.slice(0, 5);

  await Promise.all(batch.map((item) => setOutboxStatus(item.id, "syncing")));

  let response: Response;
  try {
    response = await fetch("/api/chat/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-chat-guest-id": options.guestId,
      },
      body: JSON.stringify({
        items: batch.map((item) => ({
          clientMessageId: item.id,
          text: item.text,
          threadClientId: item.threadClientId,
        })),
      }),
    });
  } catch (error) {
    await Promise.all(
      batch.map((item) => setOutboxStatus(item.id, "failed", String(error)))
    );
    return;
  }

  if (!response.ok) {
    const message = await response.text();
    await Promise.all(batch.map((item) => setOutboxStatus(item.id, "failed", message)));
    return;
  }

  const payload = (await response.json()) as SyncResponsePayload;
  const accepted: Array<{
    clientMessageId: string;
    prompt: string;
    assistantText: string;
    threadClientId: string;
    resultStatus: "accepted" | "duplicate";
  }> = [];
  let hitLimit = false;
  const handledIds = new Set<string>();

  for (const itemResult of payload.results) {
    const source = batch.find((item) => item.id === itemResult.clientMessageId);
    if (!source) {
      continue;
    }
    handledIds.add(source.id);

    if (itemResult.status === "accepted" || itemResult.status === "duplicate") {
      accepted.push({
        clientMessageId: source.id,
        prompt: source.text,
        assistantText: itemResult.assistantText,
        threadClientId: source.threadClientId,
        resultStatus: itemResult.status,
      });
      await deleteOutboxItem(source.id);
      continue;
    }

    if (itemResult.status === "rejected_limit") {
      await setOutboxStatus(source.id, "blocked_by_limit", itemResult.reason);
      options.onLimitReached();
      hitLimit = true;
      continue;
    }

    if ("reason" in itemResult) {
      await setOutboxStatus(source.id, "failed", itemResult.reason);
    }
  }

  if (accepted.length > 0) {
    options.onAccepted(accepted);
  }

  if (payload.status && options.onStatusSync) {
    options.onStatusSync(payload.status);
  }

  if (hitLimit) {
    await Promise.all(
      batch
        .filter((item) => !handledIds.has(item.id))
        .map((item) => setOutboxStatus(item.id, "blocked_by_limit", "lifetime_limit_reached"))
    );
  }

  await markSyncSuccess(options.viewerScope);
}

export function createSyncLoop(start: () => Promise<void>) {
  const onOnline = () => {
    void start();
  };

  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      void start();
    }
  };

  window.addEventListener("online", onOnline);
  document.addEventListener("visibilitychange", onVisibility);
  const intervalId = window.setInterval(() => {
    void start();
  }, 15_000);

  return () => {
    window.removeEventListener("online", onOnline);
    document.removeEventListener("visibilitychange", onVisibility);
    window.clearInterval(intervalId);
  };
}
