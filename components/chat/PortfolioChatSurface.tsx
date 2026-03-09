"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

import type { ChatHistoryMessage } from "@/lib/server/chat-store";
import { getCachedMessages, pruneExpiredCache, replaceCachedMessages } from "@/lib/client/chat-cache/repository";
import { MAX_PROMPT_CHARS, THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import type { ChatThread } from "@/lib/chat-types";

import { useChatStatus } from "@/hooks/chat/useChatStatus";
import { useChatThreadList } from "@/hooks/chat/useChatThreadList";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader, ChatMobileThreadBar } from "@/components/chat/ChatStatusBar";

const GUEST_ID_STORAGE_KEY = "portfolio-chat-guest-id";

function makeClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function parseStreamText(raw: string): string {
  let text = "";
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    const payload = line.slice(6).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const parsed = JSON.parse(payload) as { type?: unknown; delta?: unknown };
      if (parsed.type === "text-delta" && typeof parsed.delta === "string") {
        text += parsed.delta;
      }
    } catch {
      // Ignore non-JSON stream lines.
    }
  }
  return text.trim();
}

function toUIMessage(entry: ChatHistoryMessage): UIMessage {
  return {
    id: entry.id || `${entry.clientMessageId}:${entry.role}`,
    role: entry.role,
    parts: [{ type: "text", text: entry.text }],
  } as UIMessage;
}

function guardPrompt(prompt: string): { ok: true } | { ok: false; message: string } {
  if (prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      message: `Prompt is too long. Keep it under ${MAX_PROMPT_CHARS} characters.`,
    };
  }
  return { ok: true };
}

function buildThreadCacheScope(sessionScope: string, threadClientId: string): string {
  return `${sessionScope}:thread:${threadClientId}`;
}

interface PortfolioChatSurfaceProps {
  onOpenContact: () => void;
}

export function PortfolioChatSurface({ onOpenContact }: PortfolioChatSurfaceProps) {
  const [guestId, setGuestId] = useState("");
  const [composerText, setComposerText] = useState("");
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const promptFormRef = useRef<HTMLFormElement | null>(null);
  const guestIdRef = useRef("");
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limitModalOpenedRef = useRef(false);
  const hasAutoSelectedRef = useRef(false);
  const pendingThreadLoadRef = useRef<string | null>(null);

  const showNotice = useCallback((msg: string) => {
    setInlineNotice(msg);
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = setTimeout(() => {
      setInlineNotice(null);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  // Initialize guestId from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    let existing = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
    if (!existing) {
      existing = makeClientId();
      window.localStorage.setItem(GUEST_ID_STORAGE_KEY, existing);
    }
    setGuestId(existing);
  }, []);

  useEffect(() => {
    guestIdRef.current = guestId;
  }, [guestId]);

  // Online/offline tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(window.navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: () => {
          const currentGuestId = guestIdRef.current;
          const headers: Record<string, string> = {};
          if (currentGuestId) {
            headers["x-chat-guest-id"] = currentGuestId;
          }
          return headers;
        },
        prepareSendMessagesRequest: async ({ messages, requestMetadata }) => ({
          body: { messages, requestMetadata },
        }),
      }),
    []
  );

  const { statusSnapshot, setStatusSnapshot, statusError, refreshStatus } = useChatStatus(guestId);

  const sessionScope = useMemo(() => {
    if (!statusSnapshot || !guestId) return null;
    if (statusSnapshot.viewerType === "guest") {
      return `guest:${guestId}`;
    }
    return statusSnapshot.identityKey ?? statusSnapshot.viewerType;
  }, [guestId, statusSnapshot]);

  const { threads, refresh: refreshThreads } = useChatThreadList(guestId, sessionScope);

  const { messages, sendMessage, setMessages, status, stop, error } = useChat<UIMessage>({
    transport,
    onFinish: () => {
      void refreshThreads();
      void refreshStatus();
    },
    onError: () => {
      void refreshStatus();
    },
  });

  // Prune expired cache on first load
  useEffect(() => {
    void pruneExpiredCache();
  }, []);

  // Persist messages to Dexie when streaming completes
  useEffect(() => {
    if (status !== "ready" && status !== "error") return;
    if (!sessionScope || !activeThreadId) return;
    const scope = buildThreadCacheScope(sessionScope, activeThreadId);
    void replaceCachedMessages(scope, messages);
  }, [status, sessionScope, activeThreadId, messages]);

  // Switch to a thread: Dexie-first, fall back to server fetch
  const switchThread = useCallback(
    async (threadId: string) => {
      setActiveThreadId(threadId);
      if (!sessionScope) {
        // sessionScope not ready yet — queue this load for when it becomes available
        pendingThreadLoadRef.current = threadId;
        return;
      }
      pendingThreadLoadRef.current = null;
      const scope = buildThreadCacheScope(sessionScope, threadId);
      setIsLoadingMessages(true);
      const cached = await getCachedMessages(scope);
      if (cached.length > 0) {
        setMessages(cached);
        setIsLoadingMessages(false);
        return;
      }
      // Cache miss — fetch from server
      try {
        const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
          headers: { "x-chat-guest-id": guestIdRef.current },
          cache: "no-store",
        });
        if (res.ok) {
          const { messages: serverMsgs } = (await res.json()) as { messages: ChatHistoryMessage[] };
          const uiMsgs = serverMsgs.map(toUIMessage);
          await replaceCachedMessages(scope, uiMsgs);
          setMessages(uiMsgs);
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
      setIsLoadingMessages(false);
    },
    [sessionScope, setMessages]
  );

  // Auto-select first thread when thread list loads (only once)
  useEffect(() => {
    if (hasAutoSelectedRef.current) return;
    if (threads.length === 0) return;
    hasAutoSelectedRef.current = true;
    void switchThread(threads[0].clientThreadId);
  }, [threads, switchThread]);

  // When sessionScope becomes available, process any pending thread load
  // (happens when auto-select fires before statusSnapshot resolves)
  useEffect(() => {
    if (!sessionScope || !pendingThreadLoadRef.current) return;
    const threadId = pendingThreadLoadRef.current;
    pendingThreadLoadRef.current = null;
    void switchThread(threadId);
  }, [sessionScope, switchThread]);

  // Create a local thread id fallback so desktop cannot deadlock with "loading"
  // when there are no server threads yet.
  useEffect(() => {
    if (!statusSnapshot || activeThreadId) {
      return;
    }
    if (threads.length === 0) {
      setActiveThreadId(makeClientId());
    }
  }, [activeThreadId, statusSnapshot, threads.length]);

  // Always keep viewport pinned to bottom as new bubbles/chunks arrive.
  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) return;
    const rafId = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: status === "streaming" ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeThreadId, isLoadingMessages, messages, status]);

  // Open contact modal when lifetime limit is first reached
  useEffect(() => {
    if (statusSnapshot?.reason !== "lifetime_limit_reached") return;
    if (limitModalOpenedRef.current) return;
    limitModalOpenedRef.current = true;
    onOpenContact();
  }, [onOpenContact, statusSnapshot?.reason]);

  const createNewThread = useCallback(() => {
    const newId = makeClientId();
    setActiveThreadId(newId);
    setMessages([]);
    setComposerText("");
    setInlineNotice(null);
  }, [setMessages]);

  const handleSwitchThread = useCallback(
    (id: string) => {
      void switchThread(id);
    },
    [switchThread]
  );

  const viewerType = statusSnapshot?.viewerType;
  const canSend = statusSnapshot?.canSend ?? false;
  const isSubmitting = status === "submitted" || status === "streaming";
  const isGuestOffline = viewerType === "guest" && !isOnline;
  const isStatusLoading = statusSnapshot === null;

  const activeThread = useMemo<ChatThread | null>(
    () => threads.find((t) => t.clientThreadId === activeThreadId) ?? null,
    [threads, activeThreadId]
  );
  const displayThreads = useMemo(() => {
    if (!activeThreadId || threads.some((thread) => thread.clientThreadId === activeThreadId)) {
      return threads;
    }
    const now = Date.now();
    const fallbackThread: ChatThread = {
      clientThreadId: activeThreadId,
      title: "New Chat",
      promptCount: 0,
      lastPreview: "",
      createdAt: now,
      updatedAt: now,
    };
    return [fallbackThread, ...threads];
  }, [activeThreadId, threads]);

  const threadPromptLimitReached = Boolean(activeThread && (activeThread.promptCount ?? 0) >= THREAD_PROMPT_LIMIT);
  const isComposerDisabled =
    isSubmitting || isStatusLoading || !canSend || isGuestOffline || threadPromptLimitReached;
  const lifetimeLimitReached = statusSnapshot?.reason === "lifetime_limit_reached";
  const isGuestUsed = viewerType === "guest" && (statusSnapshot?.guestPromptUsed ?? false);

  const submitPrompt = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setInlineNotice(null);

      const prompt = composerText.trim();
      if (!prompt) return;
      const currentStatus = statusSnapshot ?? (await refreshStatus());
      if (!currentStatus) {
        showNotice("Chat is still loading. Please wait a moment.");
        return;
      }
      let resolvedThreadId = activeThreadId;
      if (!resolvedThreadId) {
        resolvedThreadId = makeClientId();
        setActiveThreadId(resolvedThreadId);
      }

      const promptGuard = guardPrompt(prompt);
      if (!promptGuard.ok) {
        showNotice(promptGuard.message);
        return;
      }

      if (threadPromptLimitReached) {
        showNotice("This thread reached 10 prompts. Create a new chat.");
        return;
      }
      if (!currentStatus.canSend) {
        if (currentStatus.reason === "lifetime_limit_reached") {
          onOpenContact();
          showNotice("Lifetime limit reached. Continue through the contact form.");
          return;
        }
        showNotice("Guest prompt already used. Please log in to continue.");
        return;
      }

      if (!isOnline && viewerType === "guest") {
        showNotice("Guest prompt requires internet access.");
        return;
      }

      const clientMessageId = makeClientId();
      const requestMetadata = {
        clientMessageId,
        threadClientId: resolvedThreadId,
      };

      // Guest flow: direct fetch (static response)
      if (viewerType === "guest") {
        setStatusSnapshot((previous) =>
          previous
            ? {
                ...previous,
                guestPromptUsed: true,
                canSend: false,
                reason: "guest_prompt_used",
              }
            : previous
        );

        const userMessage = {
          id: clientMessageId,
          role: "user",
          parts: [{ type: "text", text: prompt }],
        } as UIMessage;
        const optimisticMessages = [...messages, userMessage];
        setComposerText("");
        setMessages(optimisticMessages);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-chat-guest-id": guestId,
            },
            body: JSON.stringify({
              messages: [
                {
                  id: `${clientMessageId}:user`,
                  role: "user",
                  parts: [{ type: "text", text: prompt }],
                },
              ],
              requestMetadata,
            }),
          });

          const raw = await response.text();
          const assistantText = parseStreamText(raw) || "Please log in to continue.";
          const nextMessages = [
            ...optimisticMessages,
            {
              id: `${clientMessageId}:assistant`,
              role: "assistant",
              parts: [{ type: "text", text: assistantText }],
            } as UIMessage,
          ];
          setMessages(nextMessages);
        } catch (submitError) {
          showNotice(submitError instanceof Error ? submitError.message : "Failed to send message.");
        } finally {
          await refreshStatus();
          await refreshThreads();
        }

        return;
      }

      // Member/owner flow: streaming via useChat
      try {
        await sendMessage({ text: prompt }, { metadata: requestMetadata });
        setComposerText("");
      } catch (submitError) {
        showNotice(submitError instanceof Error ? submitError.message : "Failed to send message.");
      } finally {
        await refreshStatus();
      }
    },
    [
      activeThreadId,
      composerText,
      guestId,
      isOnline,
      messages,
      onOpenContact,
      refreshStatus,
      refreshThreads,
      sendMessage,
      setMessages,
      setStatusSnapshot,
      showNotice,
      statusSnapshot,
      threadPromptLimitReached,
      viewerType,
    ]
  );

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-1 overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:shadow-[10px_10px_0px_0px_var(--nb-shadow-color)]">
      <ChatSidebar
        statusSnapshot={statusSnapshot}
        threads={displayThreads}
        activeThreadId={activeThreadId}
        isSubmitting={isSubmitting}
        isGuestUsed={isGuestUsed}
        onCreateNewThread={createNewThread}
        onSwitchThread={handleSwitchThread}
        onOpenContact={onOpenContact}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ChatHeader
          statusSnapshot={statusSnapshot}
          isOnline={isOnline}
          onOpenContact={onOpenContact}
        />

        <ChatMobileThreadBar
          statusSnapshot={statusSnapshot}
          activeThread={activeThread}
          threads={displayThreads}
          activeThreadId={activeThreadId}
          isSubmitting={isSubmitting}
          isGuestUsed={isGuestUsed}
          onCreateNewThread={createNewThread}
          onSwitchThread={handleSwitchThread}
        />

        <ChatMessageList
          messages={messages}
          status={status}
          isLoadingMessages={isLoadingMessages}
          viewportRef={messageViewportRef}
        />

        <ChatComposer
          composerText={composerText}
          onComposerTextChange={setComposerText}
          onSubmit={(e) => void submitPrompt(e)}
          onStop={() => void stop()}
          formRef={promptFormRef}
          isDisabled={isComposerDisabled}
          isSubmitting={isSubmitting}
          lifetimeLimitReached={lifetimeLimitReached}
          threadPromptLimitReached={threadPromptLimitReached}
          statusError={statusError}
          chatError={error ?? null}
          inlineNotice={inlineNotice}
          onCreateNewThread={createNewThread}
          onOpenContact={onOpenContact}
        />

        {viewerType === "guest" ? (
          <div className="shrink-0 border-t-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2.5 py-2 sm:px-5 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] sm:text-[11px]">
              Guest mode allows one prompt. Log in for the full 30 prompt chat.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
