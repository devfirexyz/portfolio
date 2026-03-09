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
  threadPromptLimitReached,
  statusError,
  chatError,
  inlineNotice,
  onCreateNewThread,
  onOpenContact,
}: ChatComposerProps) {
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inlineNotice) {
      return;
    }
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
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
    <div className="shrink-0 space-y-2 bg-[var(--nb-surface)] p-2.5 sm:space-y-3 sm:p-5">
      {statusError ? (
        <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:px-3 sm:py-2 sm:text-xs">
          Policy check failed: {statusError}
        </p>
      ) : null}

      {chatError ? (
        <p className="border-2 border-[var(--nb-border)] bg-[var(--nb-danger)] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:px-3 sm:py-2 sm:text-xs">
          Chat error: {chatError.message}
        </p>
      ) : null}

      {inlineNotice ? (
        <p
          aria-live="polite"
          className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)] sm:px-3 sm:py-2 sm:text-xs"
        >
          {inlineNotice}
        </p>
      ) : null}

      {lifetimeLimitReached ? (
        <div className="flex flex-col gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-2.5 text-[var(--nb-border)] sm:flex-row sm:items-center sm:justify-between sm:p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] sm:text-xs">
            Lifetime limit reached. Continue on email.
          </p>
          <NeoButton size="sm" variant="secondary" onClick={onOpenContact}>
            Open Contact Form
          </NeoButton>
        </div>
      ) : null}

      {threadPromptLimitReached ? (
        <div className="flex items-center justify-between gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] p-2.5 sm:p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nb-border)] sm:text-xs">
            Start a new chat to continue.
          </p>
          <NeoButton size="sm" variant="secondary" onClick={onCreateNewThread}>
            New Chat
          </NeoButton>
        </div>
      ) : null}

      <form
        ref={formRef}
        className="flex items-end gap-2 border-t-2 border-[var(--nb-border)] pt-2.5 sm:gap-3 sm:pt-3"
        onSubmit={onSubmit}
      >
        <textarea
          id="portfolio-chat-prompt"
          name="prompt"
          aria-label="Chat prompt"
          rows={1}
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
            "min-h-11 w-full resize-y border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-2.5 text-sm text-[var(--nb-foreground)] outline-none transition-colors focus:border-[var(--nb-accent)] sm:p-3",
            isDisabled ? "cursor-not-allowed opacity-70" : ""
          )}
        />

        <div className="flex shrink-0 gap-2">
          <NeoButton type="submit" size="sm" className="px-3 sm:px-4" disabled={isDisabled}>
            <SendHorizontal className="mr-1.5 h-4 w-4" />
            Send
          </NeoButton>
          {isSubmitting ? (
            <NeoButton
              type="button"
              size="sm"
              variant="ghost"
              className="px-3 sm:px-4"
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
