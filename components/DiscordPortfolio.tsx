"use client";

import { useMemo, useState } from "react";

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

  const activeChannelMeta = useMemo(
    () => DISCORD_CHANNELS.find((channel) => channel.id === activeChannel),
    [activeChannel]
  );
  const activeSection = useMemo(() => RESUME_SECTION_CONTENT[activeChannel], [activeChannel]);

  return (
    <div className={`flex h-full flex-col overflow-hidden bg-[var(--nb-surface)] ${className}`}>
      <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>

        <p className="truncate px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-muted)]">
          Portfolio Resume Console
        </p>

        <span className="hidden border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--nb-foreground-muted)] sm:inline-flex">
          Resume Snapshot
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-[176px] border-r-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] p-3 md:block">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--nb-foreground-subtle)]">
            Resume Sections
          </p>

          <div className="space-y-1.5">
            {DISCORD_CHANNELS.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannel(channel.id)}
                className={`flex w-full items-center gap-1.5 border-2 px-2 py-1.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-150 ${
                  activeChannel === channel.id
                    ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-white shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
                    : "border-[var(--nb-border-subtle)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] hover:border-[var(--nb-border)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)]"
                }`}
              >
                <span className="text-xs">{channel.icon}</span>
                <span>{channel.name.replace(/-/g, " ")}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex gap-1.5 overflow-x-auto border-b-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] p-2 md:hidden">
            {DISCORD_CHANNELS.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannel(channel.id)}
                className={`shrink-0 border-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                  activeChannel === channel.id
                    ? "border-[var(--nb-border)] bg-[var(--nb-accent)] text-white"
                    : "border-[var(--nb-border-subtle)] bg-[var(--nb-surface)] text-[var(--nb-foreground)]"
                }`}
              >
                {channel.icon} {channel.name.replace(/-/g, " ")}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--nb-surface)] p-3 sm:p-4">
            <div className="border-2 border-[var(--nb-border)] bg-[var(--nb-background)] p-4 shadow-[6px_6px_0px_0px_var(--nb-shadow-color)]">
              <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--nb-border)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeChannelMeta?.icon ?? "📄"}</span>
                  <h3 className="text-base font-black uppercase tracking-[0.08em] text-[var(--nb-foreground)]">
                    {activeChannelMeta?.name.replace(/-/g, " ") ?? "resume section"}
                  </h3>
                </div>
                <span className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--nb-foreground-muted)]">
                  {activeSection.eyebrow}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--nb-foreground)]">
                {activeSection.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeSection.chips.map((chip) => (
                  <span
                    key={`${activeChannel}-${chip}`}
                    className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--nb-foreground)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 border-2 border-[var(--nb-border)] bg-[var(--nb-background-alt)] p-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-muted)]">
                Key Points
              </p>

              <ul className="divide-y-2 divide-[var(--nb-border-subtle)] border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]">
                {activeSection.points.map((point) => (
                  <li key={`${activeChannel}-${point}`} className="flex items-start gap-2 p-3">
                    <span className="mt-[2px] text-[10px] text-[var(--nb-accent)]">✦</span>
                    <p className="text-sm leading-relaxed text-[var(--nb-foreground)]">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
