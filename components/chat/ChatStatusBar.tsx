"use client";

import Link from "next/link";
import { Plus, Wifi, WifiOff } from "lucide-react";

import { ChatAuthControls } from "@/components/chat/ChatAuthControls";
import { NeoButton } from "@/components/neo/NeoButton";
import { THREAD_PROMPT_LIMIT } from "@/lib/chat-constants";
import type { ChatThread } from "@/lib/chat-types";
import type { ChatStatusPayload } from "@/hooks/chat/useChatStatus";

interface ChatStatusBarProps {
  statusSnapshot: ChatStatusPayload | null;
  activeThread: ChatThread | null;
  threads: ChatThread[];
  activeThreadId: string | null;
  isOnline: boolean;
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

export function ChatHeader({
  statusSnapshot,
  isOnline,
  onOpenContact,
}: Pick<ChatStatusBarProps, "statusSnapshot" | "isOnline" | "onOpenContact">) {
  return (
    <header className="shrink-0 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 sm:px-5 sm:py-3">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground)]">
            Portfolio Chat
          </p>
          <h1 className="text-balance text-sm font-black uppercase leading-tight tracking-[0.08em] text-[var(--nb-foreground)] sm:text-lg">
            Ask About Piyush&apos;s Work Persona
          </h1>
          <p className="mt-1 hidden break-words text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] sm:block">
            {buildUsageLabel(statusSnapshot)}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] lg:hidden">
            {isOnline ? <Wifi className="mr-1 h-3.5 w-3.5" /> : <WifiOff className="mr-1 h-3.5 w-3.5" />}
            {isOnline ? "Online" : "Offline"}
          </span>
          <div className="min-w-[9.5rem] lg:hidden">
            <ChatAuthControls onFallbackContact={onOpenContact} className="w-full" />
          </div>
          <NeoButton size="sm" variant="secondary" className="px-2.5 lg:hidden" onClick={onOpenContact}>
            Contact
          </NeoButton>
          <Link
            href="/"
            className="inline-flex h-9 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] sm:h-10 sm:px-3 sm:text-xs"
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
  onSwitchThread,
}: Omit<ChatStatusBarProps, "isOnline" | "onOpenContact">) {
  const activeThreadPromptCount = activeThread?.promptCount ?? 0;
  const threadCounterLabel =
    statusSnapshot?.viewerType === "guest"
      ? "Guest thread"
      : `Thread ${activeThreadPromptCount} / ${THREAD_PROMPT_LIMIT}`;

  return (
    <div className="space-y-2 border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-2 lg:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <NeoButton
          size="sm"
          variant="ghost"
          className="px-3"
          onClick={onCreateNewThread}
          disabled={isGuestUsed}
        >
          <Plus className="mr-1.5 h-4 w-4" />
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
              key={`mobile-thread-${thread.clientThreadId}`}
              type="button"
              onClick={() => onSwitchThread(thread.clientThreadId)}
              disabled={isSubmitting}
              className={
                thread.clientThreadId === activeThreadId
                  ? "inline-flex h-8 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] px-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground-inverse)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]"
                  : "inline-flex h-8 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--nb-foreground)] shadow-[3px_3px_0px_0px_var(--nb-shadow-color)]"
              }
            >
              {thread.title || "New Chat"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
