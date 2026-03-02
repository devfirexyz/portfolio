import type { ReactNode } from "react";

import type { MarkdownBlock, ParsedMarkdown } from "@/lib/blog-markdown";
import { normalizeMarkdownHref } from "@/lib/markdown-links";

interface MarkdownContentProps {
  parsed: ParsedMarkdown;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const inlineTokenRegex = /(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(~~([^~]+)~~)|(\*([^*\n]+)\*)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let tokenIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = inlineTokenRegex.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(
        <span key={`${keyPrefix}-text-${tokenIndex}`}>{text.slice(cursor, match.index)}</span>
      );
      tokenIndex += 1;
    }

    if (match[1]) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${tokenIndex}`}
          className="rounded border border-[var(--nb-inline-code-border)] bg-[var(--nb-inline-code-bg)] px-2 py-1 font-mono text-sm font-semibold text-[var(--nb-inline-code-fg)]"
        >
          {match[1].slice(1, -1)}
        </code>
      );
    } else if (match[2]) {
      const label = match[3] || "";
      const { href, isExternal } = normalizeMarkdownHref(match[4] || "");

      nodes.push(
        <a
          key={`${keyPrefix}-link-${tokenIndex}`}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[var(--nb-accent-ink)] underline underline-offset-2 transition-colors hover:text-[var(--nb-accent)]"
        >
          {renderInline(label, `${keyPrefix}-link-label-${tokenIndex}`)}
        </a>
      );
    } else if (match[5]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${tokenIndex}`} className="font-semibold text-[var(--nb-foreground)]">
          {renderInline(match[6], `${keyPrefix}-strong-inner-${tokenIndex}`)}
        </strong>
      );
    } else if (match[7]) {
      nodes.push(
        <del key={`${keyPrefix}-strike-${tokenIndex}`} className="text-[var(--nb-foreground-muted)]">
          {renderInline(match[8], `${keyPrefix}-strike-inner-${tokenIndex}`)}
        </del>
      );
    } else if (match[9]) {
      nodes.push(
        <em key={`${keyPrefix}-em-${tokenIndex}`} className="italic text-[var(--nb-foreground)]">
          {renderInline(match[10], `${keyPrefix}-em-inner-${tokenIndex}`)}
        </em>
      );
    }

    cursor = match.index + match[0].length;
    tokenIndex += 1;
  }

  if (cursor < text.length) {
    nodes.push(<span key={`${keyPrefix}-tail-${tokenIndex}`}>{text.slice(cursor)}</span>);
  }

  if (nodes.length === 0) {
    nodes.push(<span key={`${keyPrefix}-plain`}>{text}</span>);
  }

  return nodes;
}

function headingClass(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  switch (level) {
    case 1:
      return "mb-4 mt-6 scroll-mt-32 text-2xl font-bold text-[var(--nb-foreground)] sm:mb-6 sm:mt-8 sm:text-3xl lg:text-4xl";
    case 2:
      return "mb-3 mt-6 scroll-mt-32 border-b border-[var(--nb-border-subtle)] pb-2 text-xl font-semibold text-[var(--nb-foreground)] sm:mb-4 sm:mt-8 sm:text-2xl lg:text-3xl";
    case 3:
      return "mb-2 mt-4 scroll-mt-32 text-lg font-semibold text-[var(--nb-foreground)] sm:mb-3 sm:mt-6 sm:text-xl lg:text-2xl";
    case 4:
      return "mb-2 mt-4 scroll-mt-32 text-base font-semibold text-[var(--nb-foreground)] sm:text-lg";
    case 5:
      return "mb-2 mt-4 scroll-mt-32 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--nb-foreground)] sm:text-base";
    default:
      return "mb-2 mt-4 scroll-mt-32 text-sm font-semibold text-[var(--nb-foreground-muted)] sm:text-base";
  }
}

function renderHeading(block: Extract<MarkdownBlock, { type: "heading" }>, index: number): ReactNode {
  const content = renderInline(block.text, `heading-${index}`);
  const className = headingClass(block.level);

  if (block.level === 1) {
    return (
      <h1 key={`heading-${index}`} id={block.id} className={className}>
        {content}
      </h1>
    );
  }

  if (block.level === 2) {
    return (
      <h2 key={`heading-${index}`} id={block.id} className={className}>
        {content}
      </h2>
    );
  }

  if (block.level === 3) {
    return (
      <h3 key={`heading-${index}`} id={block.id} className={className}>
        {content}
      </h3>
    );
  }

  if (block.level === 4) {
    return (
      <h4 key={`heading-${index}`} id={block.id} className={className}>
        {content}
      </h4>
    );
  }

  if (block.level === 5) {
    return (
      <h5 key={`heading-${index}`} id={block.id} className={className}>
        {content}
      </h5>
    );
  }

  return (
    <h6 key={`heading-${index}`} id={block.id} className={className}>
      {content}
    </h6>
  );
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  if (block.type === "heading") {
    return renderHeading(block, index);
  }

  if (block.type === "paragraph") {
    return (
      <p
        key={`paragraph-${index}`}
        className="mb-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)] sm:mb-6 sm:text-base sm:leading-loose"
      >
        {renderInline(block.text, `paragraph-${index}`)}
      </p>
    );
  }

  if (block.type === "code") {
    return (
      <pre
        key={`code-${index}`}
        className="mb-6 overflow-x-auto border-2 border-[var(--nb-border)] bg-[var(--nb-code-bg)] p-5 font-mono text-sm leading-relaxed text-[var(--nb-code-fg)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
      >
        {block.language && (
          <div className="mb-3 inline-flex bg-[var(--nb-code-chip-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--nb-code-comment)]">
            {block.language}
          </div>
        )}
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === "list") {
    const isOrdered = block.items.some((item) => item.ordered);

    return (
      <div key={`list-${index}`}>
        {isOrdered ? (
          <ol className="mb-5 list-decimal space-y-2 pl-5 text-[var(--nb-foreground-muted)]">
            {block.items.map((item, itemIndex) => (
              <li
                key={`list-item-${index}-${itemIndex}`}
                className="text-sm leading-relaxed sm:text-base"
                style={{ paddingLeft: `${Math.min(item.indent * 16, 80)}px` }}
              >
                <span>{renderInline(item.text, `list-${index}-${itemIndex}`)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="mb-5 space-y-2 text-[var(--nb-foreground-muted)]">
            {block.items.map((item, itemIndex) => (
              <li
                key={`list-item-${index}-${itemIndex}`}
                className="flex items-start gap-2 text-sm leading-relaxed sm:text-base"
                style={{ paddingLeft: `${Math.min(item.indent * 16, 80)}px` }}
              >
                <span className="mt-[1px] font-semibold text-[var(--nb-foreground)]">•</span>
                <span>{renderInline(item.text, `list-${index}-${itemIndex}`)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote
        key={`blockquote-${index}`}
        className="mb-6 border-l-4 border-[var(--nb-accent)] bg-[var(--nb-surface-alt)] px-4 py-3 text-sm italic leading-relaxed text-[var(--nb-foreground-muted)] sm:text-base"
      >
        {renderInline(block.text, `quote-${index}`)}
      </blockquote>
    );
  }

  if (block.type === "table") {
    return (
      <div
        key={`table-${index}`}
        className="mb-6 overflow-x-auto border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]"
      >
        <table className="min-w-full border-collapse text-left text-sm sm:text-base">
          <thead className="bg-[var(--nb-surface-alt)]">
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th
                  key={`table-header-${index}-${headerIndex}`}
                  className="border-b-2 border-[var(--nb-border)] px-4 py-2 font-semibold text-[var(--nb-foreground)]"
                >
                  {renderInline(header, `table-header-${index}-${headerIndex}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`table-row-${index}-${rowIndex}`} className="border-b border-[var(--nb-border-subtle)] last:border-b-0">
                {block.headers.map((_, cellIndex) => (
                  <td
                    key={`table-cell-${index}-${rowIndex}-${cellIndex}`}
                    className="px-4 py-2 text-[var(--nb-foreground-muted)]"
                  >
                    {renderInline(row[cellIndex] || "", `table-cell-${index}-${rowIndex}-${cellIndex}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <hr key={`hr-${index}`} className="my-8 border-[var(--nb-border-subtle)]" />;
}

export default function MarkdownContent({ parsed }: MarkdownContentProps) {
  return <div className="max-w-none">{parsed.blocks.map((block, index) => renderBlock(block, index))}</div>;
}
