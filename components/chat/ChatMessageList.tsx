"use client";

import dynamic from "next/dynamic";
import { Loader2, MessageSquareDashed } from "lucide-react";
import type { UIMessage } from "ai";

import { cn } from "@/lib/utils";
import { getTextFromMessage } from "@/lib/client/chat-thread-utils";

const ProjectCardsWidget = dynamic(
  () =>
    import("@/components/chat/widgets/ProjectCardsWidget").then((mod) => ({
      default: mod.ProjectCardsWidget,
    })),
  { ssr: false, loading: () => null }
);

const BlogCardsWidget = dynamic(
  () =>
    import("@/components/chat/widgets/BlogCardsWidget").then((mod) => ({
      default: mod.BlogCardsWidget,
    })),
  { ssr: false, loading: () => null }
);

interface ProjectWidgetOutput {
  kind: "projects";
  items: Array<{
    id: string;
    title: string;
    description: string;
    href: string | null;
    tags: string[];
    meta: {
      impact: string;
      impactMetric: string;
      status: string;
      liveUnavailable?: boolean;
    };
  }>;
}

interface BlogWidgetOutput {
  kind: "blogs";
  items: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    tags: string[];
    meta: {
      publishedAt: string;
      readingTime: number;
      category: string | null;
      featured?: boolean;
    };
  }>;
}

function getProjectWidgets(message: UIMessage): ProjectWidgetOutput[] {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  return parts
    .map((part) => {
      const typedPart = part as { type?: unknown; state?: unknown; output?: unknown };
      if (typedPart.type !== "tool-get_projects" || typedPart.state !== "output-available") {
        return null;
      }
      const output = typedPart.output as ProjectWidgetOutput | undefined;
      if (!output || output.kind !== "projects" || !Array.isArray(output.items)) {
        return null;
      }
      return output;
    })
    .filter((value): value is ProjectWidgetOutput => value !== null);
}

function getBlogWidgets(message: UIMessage): BlogWidgetOutput[] {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  return parts
    .map((part) => {
      const typedPart = part as { type?: unknown; state?: unknown; output?: unknown };
      if (typedPart.type !== "tool-get_blogs" || typedPart.state !== "output-available") {
        return null;
      }
      const output = typedPart.output as BlogWidgetOutput | undefined;
      if (!output || output.kind !== "blogs" || !Array.isArray(output.items)) {
        return null;
      }
      return output;
    })
    .filter((value): value is BlogWidgetOutput => value !== null);
}

interface ChatMessageListProps {
  messages: UIMessage[];
  status: string;
  outboxPendingIds: Set<string>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({ messages, status, outboxPendingIds, viewportRef }: ChatMessageListProps) {
  const isSubmitting = status === "submitted" || status === "streaming";
  const lastMessageId = messages.at(-1)?.id;

  return (
    <div
      ref={viewportRef}
      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-b-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-3 [scrollbar-gutter:stable] sm:p-5"
    >
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center border-2 border-dashed border-[var(--nb-border-subtle)] bg-[var(--nb-surface)] p-6 text-center">
            <div>
              <MessageSquareDashed className="mx-auto mb-3 h-7 w-7 text-[var(--nb-foreground-muted)]" />
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground)]">
                Ask about experience, projects, blogs, skills, and career track.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--nb-foreground-subtle)]">
                Enter to send. Shift+Enter for new line.
              </p>
            </div>
          </div>
        ) : null}

        {messages.map((message) => {
          const isUser = message.role === "user";
          const text = getTextFromMessage(message);
          const projectWidgets = getProjectWidgets(message);
          const blogWidgets = getBlogWidgets(message);
          const isQueued = isUser && outboxPendingIds.has(message.id);
          const showStreamingPlaceholder =
            !isUser && status === "streaming" && message.id === lastMessageId && text.length === 0;

          return (
            <article
              id={`chat-msg-${message.id}`}
              key={message.id}
              className={cn("flex w-full min-w-0", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "min-w-0 w-fit max-w-[min(100%,44rem)] border-2 p-3 shadow-[5px_5px_0px_0px_var(--nb-shadow-color)]",
                  isUser
                    ? "sm:min-w-[10rem] border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground-inverse)]"
                    : "sm:min-w-[14rem] border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)]"
                )}
              >
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                  {isUser ? "You" : "Piyush Assistant"}
                </p>
                {text ? <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{text}</p> : null}

                {showStreamingPlaceholder ? (
                  <div className="inline-flex items-center text-xs uppercase tracking-[0.12em] text-[var(--nb-foreground-subtle)]">
                    <span className="mr-2 inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)]" />
                      <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)] [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse bg-[var(--nb-foreground-subtle)] [animation-delay:240ms]" />
                    </span>
                    Streaming
                  </div>
                ) : null}

                {!isUser &&
                  projectWidgets.map((payload, index) => (
                    <ProjectCardsWidget key={`${message.id}:projects:${index}`} items={payload.items} />
                  ))}
                {!isUser &&
                  blogWidgets.map((payload, index) => (
                    <BlogCardsWidget key={`${message.id}:blogs:${index}`} items={payload.items} />
                  ))}

                {isQueued ? (
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.11em] text-white/90">
                    Queued for sync
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}

        {isSubmitting ? (
          <div className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-2 text-xs font-bold uppercase tracking-[0.11em] text-[var(--nb-foreground-muted)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Streaming…
          </div>
        ) : null}
      </div>
    </div>
  );
}
