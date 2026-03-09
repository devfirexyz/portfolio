"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface ChatAuthControlsProps {
  onFallbackContact?: () => void;
  className?: string;
}

const ChatAuthControlsInner = dynamic(
  () =>
    import("@/components/chat/ChatAuthControlsInner").then((mod) => ({
      default: mod.ChatAuthControlsInner,
    })),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-10 w-full items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
        Loading Auth
      </span>
    ),
  }
);

export function ChatAuthControls({ onFallbackContact, className }: ChatAuthControlsProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return (
      <div className={cn("flex w-full items-center gap-2", className)}>
        <span className="inline-flex h-10 flex-1 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
          Login Not Configured
        </span>
        {onFallbackContact ? (
          <button
            type="button"
            onClick={onFallbackContact}
            className="inline-flex h-10 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
          >
            Contact
          </button>
        ) : null}
      </div>
    );
  }

  return <ChatAuthControlsInner className={className} />;
}
