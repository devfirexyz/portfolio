"use client";

import { Plus } from "lucide-react";

import { ChatAuthControls } from "@/components/chat/ChatAuthControls";
import { NeoButton } from "@/components/neo/NeoButton";
import { useOutboxItems } from "@/lib/client/chat-cache/live";
import { cn } from "@/lib/utils";
import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";

import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";
import type { ChatThreadSummary } from "@/hooks/chat/useChatThreads";

interface ActiveHistoryItem {
  id: string;
  preview: string;
  order: number;
}

interface ChatSidebarProps {
  statusSnapshot: ChatStatusPayload | null;
  sessionScope: string | null;
  threads: ChatThreadSummary[];
  activeThreadId: string | null;
  activeThread: ChatThreadSummary | null;
  activeHistoryItems: ActiveHistoryItem[];
  isOnline: boolean;
  isSubmitting: boolean;
  isGuestUsed: boolean;
  onCreateNewThread: () => void;
  onSetActiveThreadId: (id: string) => void;
  onJumpToMessage: (id: string) => void;
  onOpenContact: () => void;
}

function buildUsageLabel(status: ChatStatusPayload | null): string {
  if (!status) {
    return "Checking usage policy...";
  }
  if (status.viewerType === "guest") {
    return status.guestPromptUsed ? "1 / 1 guest prompt used" : "0 / 1 guest prompt used";
  }
  if (status.lifetimeLimit === null) {
    return `${status.lifetimeUsed ?? 0} prompts used (owner mode)`;
  }
  return `${status.lifetimeUsed ?? 0} / ${status.lifetimeLimit} lifetime prompts used`;
}

export function ChatSidebar({
  statusSnapshot,
  sessionScope,
  threads,
  activeThreadId,
  activeThread,
  activeHistoryItems,
  isOnline,
  isSubmitting,
  isGuestUsed,
  onCreateNewThread,
  onSetActiveThreadId,
  onJumpToMessage,
  onOpenContact,
}: ChatSidebarProps) {
  const outboxItems = useOutboxItems(sessionScope ?? "__none__");

  return (
    <aside className="hidden min-h-0 w-72 shrink-0 border-r-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-3 lg:flex lg:flex-col lg:gap-3">
      <NeoButton size="sm" variant="ghost" onClick={onCreateNewThread} disabled={isGuestUsed}>
        <Plus className="mr-1.5 h-4 w-4" />
        New Chat
      </NeoButton>

      <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
        {buildUsageLabel(statusSnapshot)}
      </div>
      <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
        {isOnline ? "Online" : "Offline"}
      </div>
      {statusSnapshot?.viewerType !== "guest" && activeThread ? (
        <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          Thread {activeThread.promptCount} / {THREAD_PROMPT_LIMIT}
        </div>
      ) : null}
      {outboxItems.length > 0 ? (
        <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-inverse)]">
          {outboxItems.length} queued
        </div>
      ) : null}

      <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
        <div className="border-b-2 border-[var(--nb-border)] px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          Threads
        </div>
        <div className="max-h-48 overflow-y-auto p-2">
          <div className="space-y-2">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSetActiveThreadId(thread.id)}
                disabled={isSubmitting}
                className={cn(
                  "w-full border-2 px-2 py-2 text-left shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] transition-transform hover:-translate-y-[1px]",
                  thread.id === activeThreadId
                    ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                    : "border-[var(--nb-border)] bg-[var(--nb-background)] text-[var(--nb-foreground)]"
                )}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.12em]">
                  {thread.title} {thread.locked ? "(locked)" : ""}
                </p>
                <p className="mt-1 text-[11px] font-bold">{thread.promptCount} prompts</p>
                {thread.lastPreview ? (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] opacity-80">{thread.lastPreview}</p>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
        <div className="border-b-2 border-[var(--nb-border)] px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          History
        </div>
        <div className="max-h-full overflow-y-auto p-2">
          {activeHistoryItems.length === 0 ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
              No prompts yet.
            </p>
          ) : (
            <div className="space-y-2">
              {activeHistoryItems.map((item, index) => (
                <button
                  key={`${item.id}:${index}`}
                  type="button"
                  onClick={() => onJumpToMessage(item.id)}
                  className="w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] px-2 py-2 text-left shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] transition-transform hover:-translate-y-[1px]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                    Prompt {activeHistoryItems.length - index}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-[var(--nb-foreground)]">{item.preview}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <ChatAuthControls onFallbackContact={onOpenContact} />
        <NeoButton size="sm" variant="secondary" onClick={onOpenContact}>
          Contact Me
        </NeoButton>
      </div>
    </aside>
  );
}
