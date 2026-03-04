"use client";

import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizontal, StopCircle } from "lucide-react";

import { NeoButton } from "@/components/neo/NeoButton";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  composerText: string;
  onComposerTextChange: (text: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStop: () => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  isDisabled: boolean;
  isSubmitting: boolean;
  lifetimeLimitReached: boolean;
  requiresFreshThread: boolean;
  threadPromptLimitReached: boolean;
  statusError: string | null;
  chatError: Error | null;
  inlineNotice: string | null;
  onCreateNewThread: () => void;
  onOpenContact: () => void;
}

export function ChatComposer({
  composerText,
  onComposerTextChange,
  onSubmit,
  onStop,
  formRef,
  isDisabled,
  isSubmitting,
  lifetimeLimitReached,
  requiresFreshThread,
  threadPromptLimitReached,
  statusError,
  chatError,
  inlineNotice,
  onCreateNewThread,
  onOpenContact,
}: ChatComposerProps) {
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss inline notices after 4 seconds
  useEffect(() => {
    if (!inlineNotice) {
      return;
    }
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    // Notice clearing is handled by parent — nothing to do here
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, [inlineNotice]);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    formRef.current?.requestSubmit();
  };

  return (
    <div className="shrink-0 space-y-3 bg-[var(--nb-surface)] p-3 sm:p-5">
      {statusError ? (
        <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
          Policy check failed: {statusError}
        </p>
      ) : null}

      {chatError ? (
        <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">
          Chat error: {chatError.message}
        </p>
      ) : null}

      {inlineNotice ? (
        <p
          aria-live="polite"
          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]"
        >
          {inlineNotice}
        </p>
      ) : null}

      {lifetimeLimitReached ? (
        <div className="flex flex-col gap-3 border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-3 text-[var(--nb-border)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-black uppercase tracking-[0.12em]">
            Lifetime limit reached. Continue on email.
          </p>
          <NeoButton size="sm" variant="secondary" onClick={onOpenContact}>
            Open Contact Form
          </NeoButton>
        </div>
      ) : null}

      {requiresFreshThread ? (
        <div className="flex w-full flex-col gap-3 border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)]">
            You&apos;re now logged in! The guest thread is locked. Start a new chat to continue with your
            full 30-prompt access.
          </p>
          <NeoButton size="sm" variant="secondary" onClick={onCreateNewThread}>
            New Chat
          </NeoButton>
        </div>
      ) : null}

      {threadPromptLimitReached ? (
        <div className="flex items-center justify-between border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)]">
            Thread limit reached. Create a new thread to continue.
          </p>
          <NeoButton size="sm" variant="secondary" onClick={onCreateNewThread}>
            New Thread
          </NeoButton>
        </div>
      ) : null}

      <form
        ref={formRef}
        className="flex flex-col gap-3 border-t-2 border-[var(--nb-border)] pt-3 sm:flex-row"
        onSubmit={onSubmit}
      >
        <textarea
          id="portfolio-chat-prompt"
          name="prompt"
          aria-label="Chat prompt"
          rows={2}
          value={composerText}
          disabled={isDisabled}
          onChange={(event) => onComposerTextChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            lifetimeLimitReached
              ? "Prompt limit reached. Use the contact form."
              : "Ask about experience, projects, blogs, skills…"
          }
          className={cn(
            "w-full border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)]",
            isDisabled ? "cursor-not-allowed opacity-70" : ""
          )}
        />

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <NeoButton type="submit" size="sm" className="w-full sm:w-auto" disabled={isDisabled}>
            <SendHorizontal className="mr-1.5 h-4 w-4" />
            Send
          </NeoButton>
          {isSubmitting ? (
            <NeoButton
              type="button"
              size="sm"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={onStop}
            >
              <StopCircle className="mr-1.5 h-4 w-4" />
              Stop
            </NeoButton>
          ) : null}
        </div>
      </form>
    </div>
  );
}
