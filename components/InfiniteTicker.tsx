"use client";

import React from "react";

const ITEMS = [
  "CLEAR VALUE PROPOSITION",
  "CASE STUDY DEPTH",
  "EVIDENCE OVER HYPE",
  "FAST CONTACT PATH",
];

export function InfiniteTicker() {
  return (
    <section className="relative w-full overflow-hidden border-y-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] py-7 text-[var(--nb-foreground-inverse)]">
      <div className="absolute left-0 right-0 top-0 h-8 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

      <div className="relative flex w-[200%] animate-marquee items-center">
        {[...ITEMS, ...ITEMS].map((item, idx) => (
          <React.Fragment key={`${item}-${idx}`}>
            <span className="mx-6 text-center text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
              {item}
            </span>
            <span className="text-xl text-[var(--nb-accent-ink-inverse)] sm:text-2xl" aria-hidden="true">
              •
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
