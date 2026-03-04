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

import { useOutboxItems } from "@/lib/client/chat-cache/live";
import { upsertOutboxItem } from "@/lib/client/chat-cache/repository";
import { MAX_PROMPT_CHARS, THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import { buildThreadCacheScope, makeClientId } from "@/lib/client/chat-thread-utils";
import { parseUiMessageStreamText } from "@/lib/client/chat-utils";

import { useChatStatus } from "@/hooks/chat/useChatStatus";
import { useChatThreads } from "@/hooks/chat/useChatThreads";
import { useChatMessages } from "@/hooks/chat/useChatMessages";
import { useChatSync } from "@/hooks/chat/useChatSync";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader, ChatMobileThreadBar } from "@/components/chat/ChatStatusBar";
import { getTextFromMessage } from "@/lib/client/chat-thread-utils";

const GUEST_ID_STORAGE_KEY = "portfolio-chat-guest-id";

function guestUsedStorageKey(guestId: string): string {
  return `portfolio-chat-guest-used:${guestId}`;
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

interface PortfolioChatSurfaceProps {
  onOpenContact: () => void;
}

export function PortfolioChatSurface({ onOpenContact }: PortfolioChatSurfaceProps) {
  const [guestId, setGuestId] = useState("");
  const [composerText, setComposerText] = useState("");
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const promptFormRef = useRef<HTMLFormElement | null>(null);
  const guestIdRef = useRef("");
  const activeThreadIdRef = useRef<string | null>(null);
  const isScrolledToBottomRef = useRef(true);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limitModalOpenedRef = useRef(false);

  // Inline notice with auto-dismiss
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
    if (typeof window === "undefined") {
      return;
    }
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
    if (typeof window === "undefined") {
      return;
    }
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

  // Status hook (no polling, focus/visibility refresh only)
  const { statusSnapshot, setStatusSnapshot, statusError, refreshStatus } = useChatStatus(guestId);

  // Derive sessionScope from identityKey to prevent cross-user leakage
  const sessionScope = useMemo(() => {
    if (!statusSnapshot || !guestId) {
      return null;
    }
    if (statusSnapshot.viewerType === "guest") {
      return `guest:${guestId}`;
    }
    // Use identityKey (e.g. "member:user_xxxxx") for per-user isolation
    return statusSnapshot.identityKey ?? statusSnapshot.viewerType;
  }, [guestId, statusSnapshot]);

  const { messages, sendMessage, setMessages, status, stop, error } = useChat<UIMessage>({
    transport,
    onFinish: () => {
      void refreshStatus();
    },
    onError: () => {
      void refreshStatus();
    },
  });

  // Thread management hook
  const {
    threads,
    setThreads,
    activeThreadId,
    setActiveThreadId,
    activeThread,
    requiresFreshThread,
    setRequiresFreshThread,
    globalMemoryContext,
    updateThreadSnapshot,
    ensureSessionThread,
    createNewThread,
  } = useChatThreads({
    sessionScope,
    guestId,
    statusSnapshot,
    setMessages,
  });

  // Keep ref in sync for sync hook
  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  // Reset scroll tracking when thread changes
  useEffect(() => {
    isScrolledToBottomRef.current = true;
  }, [activeThreadId]);

  // Message cache hook
  useChatMessages({
    sessionScope,
    activeThreadId,
    threads,
    guestId,
    statusSnapshot,
    messages,
    status,
    setMessages,
    setThreads,
    updateThreadSnapshot,
    ensureSessionThread,
  });

  // Sync hook (outbox flush with exponential backoff)
  useChatSync({
    sessionScope,
    viewerType: statusSnapshot?.viewerType,
    guestId,
    activeThreadIdRef,
    setMessages: setMessages as (updater: (prev: UIMessage[]) => UIMessage[]) => void,
    setThreads,
    setStatusSnapshot,
    onOpenContact,
  });

  // Open contact modal when lifetime limit is first reached
  useEffect(() => {
    if (statusSnapshot?.reason !== "lifetime_limit_reached") {
      return;
    }
    if (limitModalOpenedRef.current) {
      return;
    }
    limitModalOpenedRef.current = true;
    onOpenContact();
  }, [onOpenContact, statusSnapshot?.reason]);

  // Show inline notice when guest→member transition occurs
  useEffect(() => {
    if (requiresFreshThread) {
      // Notice is shown via the banner in ChatComposer; clear any stale inline notice
      setInlineNotice(null);
    }
  }, [requiresFreshThread]);

  // Smart scroll: only auto-scroll when near the bottom
  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) {
      return;
    }
    const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    if (distanceFromBottom <= 100) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }
  }, [messages, status]);

  // Track scroll position for smart scroll
  useEffect(() => {
    const viewport = messageViewportRef.current;
    if (!viewport) {
      return;
    }
    const onScroll = () => {
      const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      isScrolledToBottomRef.current = distanceFromBottom <= 100;
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
    };
  }, []);

  const viewerType = statusSnapshot?.viewerType;
  const canSend = statusSnapshot?.canSend ?? false;
  const isSubmitting = status === "submitted" || status === "streaming";
  const isGuestOffline = viewerType === "guest" && !isOnline;
  const isStatusLoading = statusSnapshot === null;
  const threadPromptLimitReached = Boolean(activeThread && activeThread.promptCount >= THREAD_PROMPT_LIMIT);
  const isComposerDisabled =
    isSubmitting || isStatusLoading || !canSend || isGuestOffline || requiresFreshThread || threadPromptLimitReached;
  const lifetimeLimitReached = statusSnapshot?.reason === "lifetime_limit_reached";
  const isGuestUsed = viewerType === "guest" && (statusSnapshot?.guestPromptUsed ?? false);

  const outboxItems = useOutboxItems(sessionScope ?? "__none__");
  const outboxPendingIds = useMemo(() => new Set(outboxItems.map((item) => item.id)), [outboxItems]);

  const activeHistoryItems = useMemo(() => {
    const items = messages
      .map((message, index) => {
        if (message.role !== "user") {
          return null;
        }
        const text = getTextFromMessage(message);
        if (!text) {
          return null;
        }
        return {
          id: message.id,
          preview: text.length > 64 ? `${text.slice(0, 64)}...` : text,
          order: index,
        };
      })
      .filter((value): value is { id: string; preview: string; order: number } => value !== null);
    return items.reverse();
  }, [messages]);

  const handleCreateNewThread = useCallback(() => {
    void createNewThread((msg) => showNotice(msg));
    setComposerText("");
    setInlineNotice(null);
    setRequiresFreshThread(false);
  }, [createNewThread, setRequiresFreshThread, showNotice]);

  const handleSetActiveThreadId = useCallback(
    (id: string) => {
      if (activeThreadId && messages.length > 0) {
        updateThreadSnapshot(activeThreadId, messages);
      }
      setActiveThreadId(id);
    },
    [activeThreadId, messages, setActiveThreadId, updateThreadSnapshot]
  );

  const jumpToMessage = useCallback((messageId: string) => {
    const target = document.getElementById(`chat-msg-${messageId}`);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const submitPrompt = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setInlineNotice(null);

      const prompt = composerText.trim();
      if (!prompt) {
        return;
      }
      if (!statusSnapshot || !activeThreadId) {
        showNotice("Chat is still loading. Please wait a moment.");
        return;
      }

      const promptGuard = guardPrompt(prompt);
      if (!promptGuard.ok) {
        showNotice(promptGuard.message);
        return;
      }

      if (requiresFreshThread) {
        showNotice("Create a new chat thread to continue after login.");
        return;
      }
      if (threadPromptLimitReached) {
        showNotice("This thread reached 10 prompts. Create a new chat thread.");
        return;
      }
      if (!statusSnapshot.canSend) {
        if (statusSnapshot.reason === "lifetime_limit_reached") {
          onOpenContact();
          showNotice("Lifetime limit reached. Continue through the contact form.");
          return;
        }
        showNotice("Guest prompt already used. Please log in to continue.");
        return;
      }

      const clientMessageId = makeClientId();
      const requestMetadata = {
        clientMessageId,
        threadClientId: activeThreadId,
        threadMemory: globalMemoryContext,
      };

      // Offline path for non-guest users: queue in outbox
      if (!isOnline && viewerType !== "guest" && sessionScope) {
        const optimisticUser = {
          id: clientMessageId,
          role: "user",
          parts: [{ type: "text", text: prompt }],
        } as UIMessage;
        const nextMessages = [...messages, optimisticUser];

        setMessages(nextMessages);
        setComposerText("");
        updateThreadSnapshot(activeThreadId, nextMessages);

        await upsertOutboxItem({
          id: clientMessageId,
          viewerScope: sessionScope,
          text: prompt,
          threadClientId: activeThreadId,
        });
        showNotice("Message queued offline. It will sync when you're online.");
        return;
      }

      if (!isOnline && viewerType === "guest") {
        showNotice("Guest prompt requires internet access.");
        return;
      }

      // Guest flow: direct fetch (static response)
      if (viewerType === "guest") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(guestUsedStorageKey(guestId), "1");
        }
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
          const assistantText = parseUiMessageStreamText(raw) || "Please log in to continue.";
          const assistantId = `${clientMessageId}:assistant`;
          const nextMessages = [
            ...optimisticMessages,
            {
              id: assistantId,
              role: "assistant",
              parts: [{ type: "text", text: assistantText }],
            } as UIMessage,
          ];
          setMessages(nextMessages);
          updateThreadSnapshot(activeThreadId, nextMessages, { forceLocked: true });
        } catch (submitError) {
          showNotice(submitError instanceof Error ? submitError.message : "Failed to send message.");
        } finally {
          await refreshStatus();
        }

        return;
      }

      // Member/owner flow: streaming via useChat
      try {
        await sendMessage(
          { text: prompt },
          { metadata: requestMetadata }
        );
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
      globalMemoryContext,
      isOnline,
      messages,
      onOpenContact,
      refreshStatus,
      requiresFreshThread,
      sendMessage,
      sessionScope,
      setMessages,
      setStatusSnapshot,
      showNotice,
      statusSnapshot,
      threadPromptLimitReached,
      updateThreadSnapshot,
      viewerType,
    ]
  );

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[8px_8px_0px_0px_var(--nb-shadow-color)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:shadow-[10px_10px_0px_0px_var(--nb-shadow-color)]">
      <ChatSidebar
        statusSnapshot={statusSnapshot}
        sessionScope={sessionScope}
        threads={threads}
        activeThreadId={activeThreadId}
        activeThread={activeThread}
        activeHistoryItems={activeHistoryItems}
        isOnline={isOnline}
        isSubmitting={isSubmitting}
        isGuestUsed={isGuestUsed}
        onCreateNewThread={handleCreateNewThread}
        onSetActiveThreadId={handleSetActiveThreadId}
        onJumpToMessage={jumpToMessage}
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
          threads={threads}
          activeThreadId={activeThreadId}
          isSubmitting={isSubmitting}
          isGuestUsed={isGuestUsed}
          onCreateNewThread={handleCreateNewThread}
          onSetActiveThreadId={handleSetActiveThreadId}
        />

        <ChatMessageList
          messages={messages}
          status={status}
          outboxPendingIds={outboxPendingIds}
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
          requiresFreshThread={requiresFreshThread}
          threadPromptLimitReached={threadPromptLimitReached}
          statusError={statusError}
          chatError={error ?? null}
          inlineNotice={inlineNotice}
          onCreateNewThread={handleCreateNewThread}
          onOpenContact={onOpenContact}
        />

        {viewerType === "guest" ? (
          <div className="shrink-0 border-t-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-3 sm:px-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
              Guest mode allows one prompt. Log in for the full 30 prompt chat.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
