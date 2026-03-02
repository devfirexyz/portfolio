export interface TocItem {
  level: 2 | 3;
  id: string;
  text: string;
}

export interface MarkdownListItem {
  text: string;
  indent: number;
  ordered: boolean;
  order?: number;
}

export type MarkdownBlock =
  | {
      type: "heading";
      level: 1 | 2 | 3 | 4 | 5 | 6;
      text: string;
      id: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "code";
      language: string;
      code: string;
    }
  | {
      type: "list";
      items: MarkdownListItem[];
    }
  | {
      type: "blockquote";
      text: string;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "hr";
    };

export interface ParsedMarkdown {
  blocks: MarkdownBlock[];
  tocItems: TocItem[];
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const LIST_RE = /^(\s*)([-*+]|\d+\.)\s+(.*)$/;
const HR_RE = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const TABLE_SEPARATOR_RE = /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/;
const FRONTMATTER_RE = /^---\s*$/;

const markdownCache = new Map<string, ParsedMarkdown>();

export function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/[_#>*~]/g, "")
    .trim();
}

export function slugifyHeading(text: string): string {
  const normalized = stripMarkdownSyntax(text)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "section";
}

function splitTableRow(line: string): string[] {
  const normalized = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return normalized.split("|").map((cell) => cell.trim());
}

function isTableStart(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length) {
    return false;
  }

  const header = lines[index].trim();
  const separator = lines[index + 1].trim();

  if (!header.includes("|")) {
    return false;
  }

  return TABLE_SEPARATOR_RE.test(separator);
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index];

  if (!line) {
    return false;
  }

  if (line.startsWith("```")) {
    return true;
  }

  if (HEADING_RE.test(line)) {
    return true;
  }

  if (LIST_RE.test(line)) {
    return true;
  }

  if (/^\s*>\s?/.test(line)) {
    return true;
  }

  if (HR_RE.test(line)) {
    return true;
  }

  if (isTableStart(lines, index)) {
    return true;
  }

  return false;
}

function stripPossibleFrontmatter(lines: string[]): string[] {
  if (!FRONTMATTER_RE.test(lines[0] || "")) {
    return lines;
  }

  for (let index = 1; index < lines.length; index += 1) {
    if (FRONTMATTER_RE.test(lines[index])) {
      return lines.slice(index + 1);
    }
  }

  return lines;
}

export function parseMarkdown(content: string): ParsedMarkdown {
  const normalizedContent = content.replace(/\r\n?/g, "\n");
  const cached = markdownCache.get(normalizedContent);
  if (cached) {
    return cached;
  }

  const sourceLines = stripPossibleFrontmatter(normalizedContent.split("\n"));
  const blocks: MarkdownBlock[] = [];
  const tocItems: TocItem[] = [];
  const slugCounts = new Map<string, number>();

  const createUniqueSlug = (text: string) => {
    const baseSlug = slugifyHeading(text);
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);
    return count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;
  };

  let index = 0;

  while (index < sourceLines.length) {
    const line = sourceLines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < sourceLines.length && !sourceLines[index].startsWith("```")) {
        codeLines.push(sourceLines[index]);
        index += 1;
      }

      if (index < sourceLines.length && sourceLines[index].startsWith("```")) {
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      const level = Math.min(Math.max(headingMatch[1].length, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const headingText = headingMatch[2].replace(/\s+#+\s*$/, "").trim();
      const plainText = stripMarkdownSyntax(headingText) || headingText;
      const id = createUniqueSlug(plainText);

      blocks.push({
        type: "heading",
        level,
        text: headingText,
        id,
      });

      if (level === 2 || level === 3) {
        tocItems.push({
          level,
          id,
          text: plainText,
        });
      }

      index += 1;
      continue;
    }

    if (HR_RE.test(line)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    if (isTableStart(sourceLines, index)) {
      const headers = splitTableRow(sourceLines[index]);
      const rows: string[][] = [];
      index += 2;

      while (index < sourceLines.length) {
        const currentLine = sourceLines[index];
        if (!currentLine.trim() || !currentLine.includes("|")) {
          break;
        }

        rows.push(splitTableRow(currentLine));
        index += 1;
      }

      blocks.push({
        type: "table",
        headers,
        rows,
      });
      continue;
    }

    const listMatch = line.match(LIST_RE);
    if (listMatch) {
      const listItems: MarkdownListItem[] = [];

      while (index < sourceLines.length) {
        const candidate = sourceLines[index];
        const candidateMatch = candidate.match(LIST_RE);

        if (candidateMatch) {
          const [, rawIndent, marker, text] = candidateMatch;
          const order = /^\d+\.$/.test(marker) ? Number.parseInt(marker, 10) : undefined;

          listItems.push({
            text: text.trim(),
            indent: Math.floor(rawIndent.replace(/\t/g, "  ").length / 2),
            ordered: Boolean(order),
            order,
          });
          index += 1;
          continue;
        }

        if (!candidate.trim() && index + 1 < sourceLines.length && LIST_RE.test(sourceLines[index + 1])) {
          index += 1;
          continue;
        }

        break;
      }

      blocks.push({
        type: "list",
        items: listItems,
      });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < sourceLines.length && /^\s*>\s?/.test(sourceLines[index])) {
        quoteLines.push(sourceLines[index].replace(/^\s*>\s?/, "").trim());
        index += 1;
      }

      blocks.push({
        type: "blockquote",
        text: quoteLines.join(" ").trim(),
      });
      continue;
    }

    const paragraphLines: string[] = [line.trim()];
    index += 1;

    while (index < sourceLines.length) {
      const nextLine = sourceLines[index];
      if (!nextLine.trim() || isBlockStart(sourceLines, index)) {
        break;
      }

      paragraphLines.push(nextLine.trim());
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" ").trim(),
    });
  }

  const parsed: ParsedMarkdown = { blocks, tocItems };
  if (markdownCache.size > 200) {
    markdownCache.clear();
  }
  markdownCache.set(normalizedContent, parsed);
  return parsed;
}
