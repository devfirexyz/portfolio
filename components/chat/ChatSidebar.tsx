"use client";

import { Lock, Plus } from "lucide-react";

import { ChatAuthControls } from "@/components/chat/ChatAuthControls";
import { NeoButton } from "@/components/neo/NeoButton";
import { cn } from "@/lib/utils";
import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import type { ChatThread } from "@/lib/chat-types";
import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";

interface ChatSidebarProps {
  statusSnapshot: ChatStatusPayload | null;
  threads: ChatThread[];
  activeThreadId: string | null;
  isSubmitting: boolean;
  isGuestUsed: boolean;
  onCreateNewThread: () => void;
  onSwitchThread: (id: string) => void;
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
  threads,
  activeThreadId,
  isSubmitting,
  isGuestUsed,
  onCreateNewThread,
  onSwitchThread,
  onOpenContact,
}: ChatSidebarProps) {
  return (
    <aside className="hidden min-h-0 w-72 shrink-0 border-r-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] p-3 lg:flex lg:flex-col lg:gap-3">
      <NeoButton size="sm" variant="ghost" onClick={onCreateNewThread} disabled={isGuestUsed}>
        <Plus className="mr-1.5 h-4 w-4" />
        New Chat
      </NeoButton>

      <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
        {buildUsageLabel(statusSnapshot)}
      </div>

      <div className="min-h-0 flex-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
        <div className="border-b-2 border-[var(--nb-border)] px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
          Conversations
        </div>
        <div className="max-h-full overflow-y-auto p-2">
          {threads.length === 0 ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
              No conversations yet.
            </p>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => {
                const isActive = thread.clientThreadId === activeThreadId;
                const promptCount = thread.promptCount ?? 0;
                const isLocked = promptCount >= THREAD_PROMPT_LIMIT;
                return (
                  <button
                    key={thread.clientThreadId}
                    type="button"
                    onClick={() => onSwitchThread(thread.clientThreadId)}
                    disabled={isSubmitting}
                    className={cn(
                      "w-full border-2 px-2 py-2 text-left shadow-[3px_3px_0px_0px_var(--nb-shadow-color)] transition-transform hover:-translate-y-[1px]",
                      isActive
                        ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                        : "border-[var(--nb-border)] bg-[var(--nb-background)] text-[var(--nb-foreground)]",
                      isLocked && !isActive ? "opacity-60" : ""
                    )}
                  >
                    <p className="line-clamp-2 text-[10px] font-black uppercase tracking-[0.12em]">
                      {thread.title || "New Chat"}
                    </p>
                    {thread.lastPreview ? (
                      <p className="mt-1 truncate text-[10px] uppercase tracking-[0.08em] opacity-70">
                        {thread.lastPreview}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-70">
                        {promptCount} / {THREAD_PROMPT_LIMIT}
                      </p>
                      {isLocked ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-[0.1em] opacity-70">
                          <Lock className="h-2.5 w-2.5" />
                          Locked
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <ChatAuthControls onFallbackContact={onOpenContact} className="w-full" />
        <NeoButton size="sm" variant="secondary" className="w-full" onClick={onOpenContact}>
          Contact Me
        </NeoButton>
      </div>
    </aside>
  );
}
