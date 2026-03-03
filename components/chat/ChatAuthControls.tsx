"use client";

import dynamic from "next/dynamic";

interface ChatAuthControlsProps {
  onFallbackContact?: () => void;
}

const ChatAuthControlsInner = dynamic(
  () =>
    import("@/components/chat/ChatAuthControlsInner").then((mod) => ({
      default: mod.ChatAuthControlsInner,
    })),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
        Loading Auth
      </span>
    ),
  }
);

export function ChatAuthControls({ onFallbackContact }: ChatAuthControlsProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-foreground)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
          Login Not Configured
        </span>
        {onFallbackContact ? (
          <button
            type="button"
            onClick={onFallbackContact}
            className="inline-flex h-10 items-center border-2 border-[var(--nb-border)] bg-[var(--nb-warning)] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--nb-border)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
          >
            Contact
          </button>
        ) : null}
      </div>
    );
  }

  return <ChatAuthControlsInner />;
}
