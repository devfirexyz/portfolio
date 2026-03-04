"use client";

import Link from "next/link";
import { Wifi, WifiOff } from "lucide-react";

import { ChatAuthControls } from "@/components/chat/ChatAuthControls";
import { NeoButton } from "@/components/neo/NeoButton";
import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";
import type { ChatThreadSummary } from "@/hooks/chat/useChatThreads";

interface ChatStatusBarProps {
  statusSnapshot: ChatStatusPayload | null;
  activeThread: ChatThreadSummary | null;
  threads: ChatThreadSummary[];
  activeThreadId: string | null;
  isOnline: boolean;
  isSubmitting: boolean;
  isGuestUsed: boolean;
  onCreateNewThread: () => void;
  onSetActiveThreadId: (id: string) => void;
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

export function ChatHeader({
  statusSnapshot,
  isOnline,
  onOpenContact,
}: Pick<ChatStatusBarProps, "statusSnapshot" | "isOnline" | "onOpenContact">) {
  return (
    <header className="shrink-0 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4 py-3 sm:px-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]">
            Portfolio Chat
          </p>
          <h1 className="text-balance text-base font-black uppercase leading-tight tracking-[0.08em] text-[var(--nb-foreground)] sm:text-lg">
            Ask About Piyush&apos;s Work Persona
          </h1>
          <p className="mt-1 break-words text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
            {buildUsageLabel(statusSnapshot)}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] lg:hidden">
            {isOnline ? <Wifi className="mr-1 h-3.5 w-3.5" /> : <WifiOff className="mr-1 h-3.5 w-3.5" />}
            {isOnline ? "Online" : "Offline"}
          </span>
          <div className="lg:hidden">
            <ChatAuthControls onFallbackContact={onOpenContact} />
          </div>
          <NeoButton size="sm" variant="secondary" className="lg:hidden" onClick={onOpenContact}>
            Contact
          </NeoButton>
          <Link
            href="/"
            className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
          >
            Back
          </Link>
        </div>
      </div>
    </header>
  );
}

export function ChatMobileThreadBar({
  statusSnapshot,
  activeThread,
  threads,
  activeThreadId,
  isSubmitting,
  isGuestUsed,
  onCreateNewThread,
  onSetActiveThreadId,
}: Omit<ChatStatusBarProps, "isOnline" | "onOpenContact">) {
  const activeThreadPromptCount = activeThread?.promptCount ?? 0;
  const threadCounterLabel =
    statusSnapshot?.viewerType === "guest"
      ? "Guest thread"
      : `Thread ${activeThreadPromptCount} / ${THREAD_PROMPT_LIMIT}`;

  return (
    <div className="space-y-2 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-3 lg:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <NeoButton
          size="sm"
          variant="ghost"
          onClick={onCreateNewThread}
          disabled={isGuestUsed}
        >
          <span className="mr-1.5 h-4 w-4">+</span>
          New Chat
        </NeoButton>
        <span className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
          {threadCounterLabel}
        </span>
      </div>
      <div className="overflow-x-auto pb-1 [scrollbar-gutter:stable]">
        <div className="flex min-w-max gap-2">
          {threads.map((thread) => (
            <button
              key={`mobile-thread-${thread.id}`}
              type="button"
              onClick={() => onSetActiveThreadId(thread.id)}
              disabled={isSubmitting}
              className={
                thread.id === activeThreadId
                  ? "inline-flex h-9 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground-inverse)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]"
                  : "inline-flex h-9 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]"
              }
            >
              {thread.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
