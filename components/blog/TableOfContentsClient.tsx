"use client";

import { useEffect, useRef, useState } from "react";

import type { TocItem } from "@/lib/blog-markdown";

interface TableOfContentsClientProps {
  items: TocItem[];
}

export default function TableOfContentsClient({ items }: TableOfContentsClientProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headingElements.length === 0) {
      return;
    }

    const getCurrentId = () => {
      const offset = 160;
      let current = headingElements[0].id;

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top <= offset) {
          current = heading.id;
        } else {
          break;
        }
      }

      return current;
    };

    let rafId = 0;

    const updateActive = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const nextId = getCurrentId();
        if (nextId && nextId !== activeIdRef.current) {
          activeIdRef.current = nextId;
          setActiveId(nextId);
        }
      });
    };

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: [0, 1],
    });

    for (const heading of headingElements) {
      observer.observe(heading);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <span className="text-lg font-medium text-[var(--nb-foreground)]">Table of Contents</span>
      <ul className="flex w-full list-none flex-col gap-y-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={`w-full text-sm ${item.level === 2 ? "pl-0" : "pl-4"}`}>
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                className={`block transition-colors ${
                  isActive
                    ? "font-semibold text-[var(--nb-accent-ink)]"
                    : "text-[var(--nb-foreground-muted)] hover:text-[var(--nb-foreground)]"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
