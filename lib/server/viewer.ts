import { randomUUID } from "node:crypto";

import type { ViewerIdentity } from "@/lib/server/chat-store";

function hasClerkEnv(): boolean {
  return Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

async function tryResolveClerkUserId(): Promise<string | null> {
  if (!hasClerkEnv()) {
    return null;
  }

  try {
    const { auth } = await import("@clerk/nextjs/server");
    const authState = await auth();
    return authState.userId ?? null;
  } catch {
    return null;
  }
}

function resolveDevViewerOverride(request: Request): ViewerIdentity | null {
  if (process.env.CHAT_ALLOW_DEV_VIEWER_HEADER !== "1") {
    return null;
  }

  const rawViewer = request.headers.get("x-chat-dev-viewer")?.trim();
  if (rawViewer !== "guest" && rawViewer !== "member" && rawViewer !== "owner") {
    return null;
  }

  if (rawViewer === "guest") {
    const guestId = request.headers.get("x-chat-guest-id")?.trim() || randomUUID();
    return {
      viewerType: "guest",
      identityKey: `guest:${guestId}`,
    };
  }

  const devUserId = request.headers.get("x-chat-dev-user-id")?.trim() || "dev-user";
  const viewerType = rawViewer;
  return {
    viewerType,
    identityKey: `${viewerType}:${devUserId}`,
    userId: devUserId,
  };
}

function resolveGuestId(request: Request): string {
  const fromHeader = request.headers.get("x-chat-guest-id")?.trim();
  if (fromHeader) {
    return fromHeader;
  }

  return randomUUID();
}

export async function resolveViewerIdentity(request: Request): Promise<ViewerIdentity> {
  const devOverride = resolveDevViewerOverride(request);
  if (devOverride) {
    return devOverride;
  }

  const clerkUserId = await tryResolveClerkUserId();
  const ownerIds = new Set(
    (process.env.CHAT_OWNER_IDS ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  );

  if (clerkUserId) {
    const viewerType = ownerIds.has(clerkUserId) ? "owner" : "member";
    return {
      viewerType,
      identityKey: `${viewerType === "owner" ? "owner" : "member"}:${clerkUserId}`,
      userId: clerkUserId,
    };
  }

  const guestId = resolveGuestId(request);

  return {
    viewerType: "guest",
    identityKey: `guest:${guestId}`,
  };
}
