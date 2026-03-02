"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  DISCORD_CHANNELS,
  RESUME_SECTION_CONTENT,
  type ChannelId,
} from "@/lib/data/discord-portfolio";

interface DiscordPortfolioProps {
  className?: string;
}

export default function DiscordPortfolio({ className = "" }: DiscordPortfolioProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelId>("resume");
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChannelMeta = useMemo(
    () => DISCORD_CHANNELS.find((channel) => channel.id === activeChannel),
    [activeChannel]
  );
  const activeSection = useMemo(() => RESUME_SECTION_CONTENT[activeChannel], [activeChannel]);

  const handleSelectChannel = (channelId: ChannelId) => {
    if (channelId === activeChannel) return;

    setActiveChannel(channelId);
    setIsSwitching(true);
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setIsSwitching(false);
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  return (
    <div
      className={`flex h-full flex-col overflow-hidden bg-[var(--nb-surface)] ${className}`}
      aria-busy={isSwitching}
    >
      <div className="flex min-h-16 items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] animate-console-dot" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] animate-console-dot [animation-delay:100ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] animate-console-dot [animation-delay:200ms]" />
        </div>

        <p className="truncate px-3 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
          Portfolio Resume Console
        </p>

        <span
          className={`hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] sm:inline-flex ${
            isSwitching ? "text-[var(--nb-accent-ink)]" : "text-[var(--nb-foreground-muted)]"
          }`}
        >
          {isSwitching ? "Syncing..." : "Resume Snapshot"}
        </span>
      </div>

      {isSwitching ? (
        <div className="h-1 overflow-hidden border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)]">
          <div className="h-full w-1/2 bg-[var(--nb-accent)] animate-console-loading" />
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-[192px] border-r-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] p-3 md:block">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-subtle)]">
            Resume Sections
          </p>

          <div className="space-y-1.5">
            {DISCORD_CHANNELS.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => handleSelectChannel(channel.id)}
                className={`flex w-full items-center gap-1.5 border-2 px-2 py-1.5 text-left text-[12px] font-bold uppercase tracking-[0.08em] transition-all duration-150 ${
                  activeChannel === channel.id
                    ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-white shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
                    : "border-[var(--nb-border-subtle)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] hover:border-[var(--nb-border)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)]"
                }`}
              >
                <span className="text-sm">{channel.icon}</span>
                <span>{channel.name.replace(/-/g, " ")}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--nb-surface)] p-2.5 sm:p-4">
            <div className="space-y-2.5 md:hidden">
              {DISCORD_CHANNELS.map((channel) => {
                const section = RESUME_SECTION_CONTENT[channel.id];
                const isActive = channel.id === activeChannel;

                return (
                  <article
                    key={channel.id}
                    className="border-2 border-[var(--nb-border)] bg-[var(--nb-background)]"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectChannel(channel.id)}
                      className="flex w-full items-center justify-between gap-2 p-2.5 text-left"
                      aria-expanded={isActive}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-base">{channel.icon}</span>
                        <span className="truncate text-[13px] font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)]">
                          {channel.shortName ?? channel.name.replace(/-/g, " ")}
                        </span>
                      </span>
                      <span className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-0.5 text-[13px] font-black text-[var(--nb-foreground)] transition-transform duration-150">
                        {isActive ? "−" : "+"}
                      </span>
                    </button>

                    {isActive ? (
                      <div className="border-t-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-2.5 animate-console-enter">
                        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--nb-foreground-muted)]">
                          {section.eyebrow}
                        </p>
                        <p className="mt-2 text-[14px] leading-relaxed text-[var(--nb-foreground)]">
                          {section.summary}
                        </p>

                        <div className="mt-2 grid grid-cols-1 gap-1">
                          {section.chips.map((chip, chipIndex) => (
                            <span
                              key={`${channel.id}-${chip}`}
                              className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold text-[var(--nb-foreground)] animate-console-pop"
                              style={{ animationDelay: `${40 + chipIndex * 30}ms` }}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <ul className="mt-2 divide-y-2 divide-[var(--nb-border-subtle)] border-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)]">
                          {section.points.map((point, pointIndex) => (
                            <li
                              key={`${channel.id}-${point}`}
                              className="flex items-start gap-2 p-2 animate-console-pop"
                              style={{ animationDelay: `${120 + pointIndex * 40}ms` }}
                            >
                              <span className="mt-[2px] text-[12px] text-[var(--nb-accent)]">✦</span>
                              <p className="text-[14px] leading-relaxed text-[var(--nb-foreground)]">{point}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <div className="hidden md:block animate-console-enter" key={activeChannel}>
              <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-4 shadow-[6px_6px_0px_0px_var(--nb-shadow-color)]">
                <div className="flex flex-col gap-2 border-b-2 border-[var(--nb-border)] pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-lg sm:text-xl">{activeChannelMeta?.icon ?? "📄"}</span>
                    <h3 className="truncate text-[14px] font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)] sm:text-lg">
                      {activeChannelMeta?.name.replace(/-/g, " ") ?? "resume section"}
                    </h3>
                  </div>
                  <span className="w-fit border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--nb-foreground-muted)] sm:text-[12px]">
                    {activeSection.eyebrow}
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-relaxed text-[var(--nb-foreground)] sm:text-base">
                  {activeSection.summary}
                </p>

                <div className="mt-3 grid grid-cols-1 gap-1.5 sm:mt-4 sm:flex sm:flex-wrap sm:gap-2">
                  {activeSection.chips.map((chip, chipIndex) => (
                    <span
                      key={`${activeChannel}-${chip}`}
                      className="w-full break-words border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[12px] font-bold leading-tight text-[var(--nb-foreground)] sm:w-auto animate-console-pop"
                      style={{ animationDelay: `${40 + chipIndex * 30}ms` }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2.5 border-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] p-3 sm:mt-3 sm:p-4">
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)] sm:mb-3 sm:text-[13px]">
                  Key Points
                </p>

                <ul className="divide-y-2 divide-[var(--nb-border-subtle)] border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
                  {activeSection.points.map((point, pointIndex) => (
                    <li
                      key={`${activeChannel}-${point}`}
                      className="flex items-start gap-2 p-2.5 sm:p-3 animate-console-pop"
                      style={{ animationDelay: `${120 + pointIndex * 40}ms` }}
                    >
                      <span className="mt-[2px] text-[12px] text-[var(--nb-accent)]">✦</span>
                      <p className="text-[14px] leading-relaxed text-[var(--nb-foreground)] sm:text-base">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
