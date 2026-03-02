"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Enhanced syntax highlighting function using React components (no HTML strings)
function highlightCode(code: string, language: string): React.ReactNode {
  if (!language || language === '') {
    return <span className="text-[var(--nb-code-muted)]">{code}</span>;
  }

  const lines = code.split('\n');

  if (language === 'typescript' || language === 'javascript' || language === 'tsx' || language === 'jsx') {
    return (
      <>
        {lines.map((line, index) => (
          <div key={index} className="block">
            {highlightJSLine(line)}
          </div>
        ))}
      </>
    );
  }

  if (language === 'python' || language === 'py') {
    return (
      <>
        {lines.map((line, index) => (
          <div key={index} className="block">
            {highlightPythonLine(line)}
          </div>
        ))}
      </>
    );
  }

  if (language === 'bash' || language === 'sh' || language === 'shell') {
    return (
      <>
        {lines.map((line, index) => (
          <div key={index} className="block">
            {highlightBashLine(line)}
          </div>
        ))}
      </>
    );
  }

  // For other languages, return with enhanced basic styling
  return (
    <>
      {lines.map((line, index) => (
        <div key={index} className="block text-[var(--nb-code-string)]">
          {line || '\u00A0'}
        </div>
      ))}
    </>
  );
}

// Token interface
interface Token {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'operator' | 'text';
  value: string;
  className?: string;
}

// Enhanced JavaScript/TypeScript syntax highlighting using pure React
function highlightJSLine(line: string): React.ReactNode {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  const tokens = tokenizeLine(line);

  return (
    <span>
      {tokens.map((token, index) => {
        const className = getTokenClassName(token);
        return (
          <span key={index} className={className}>
            {token.value}
          </span>
        );
      })}
    </span>
  );
}

// Tokenize a line of code
function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let current = '';
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    // Handle comments
    if (char === '/' && nextChar === '/') {
      if (current.trim()) {
        tokens.push(...tokenizeText(current));
        current = '';
      }
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // Handle strings
    if (char === '"' || char === "'" || char === '`') {
      if (current.trim()) {
        tokens.push(...tokenizeText(current));
        current = '';
      }

      const stringToken = extractString(line, i);
      tokens.push({ type: 'string', value: stringToken.value });
      i = stringToken.endIndex;
      continue;
    }

    current += char;
    i++;
  }

  if (current.trim()) {
    tokens.push(...tokenizeText(current));
  }

  return tokens;
}

// Extract string literal
function extractString(line: string, startIndex: number): { value: string; endIndex: number } {
  const quote = line[startIndex];
  let value = quote;
  let i = startIndex + 1;

  while (i < line.length) {
    const char = line[i];
    value += char;

    if (char === quote) {
      break;
    }

    if (char === '\\' && i + 1 < line.length) {
      i++; // Skip escaped character
      value += line[i];
    }

    i++;
  }

  return { value, endIndex: i };
}

// Tokenize text for keywords, numbers, etc.
function tokenizeText(text: string): Token[] {
  const tokens: Token[] = [];

  // Split by word boundaries but keep delimiters
  const parts = text.split(/(\s+|[{}[\]();,.]|[=<>!&|+\-*/%])/);

  parts.forEach(part => {
    if (!part) return;

    if (/^\s+$/.test(part)) {
      tokens.push({ type: 'text', value: part });
    } else if (/^[{}[\]();,.]$/.test(part)) {
      tokens.push({ type: 'operator', value: part });
    } else if (/^[=<>!&|+\-*/%]+$/.test(part)) {
      tokens.push({ type: 'operator', value: part });
    } else if (/^\d+(\.\d+)?$/.test(part)) {
      tokens.push({ type: 'number', value: part });
    } else if (isKeyword(part)) {
      tokens.push({ type: 'keyword', value: part });
    } else {
      tokens.push({ type: 'text', value: part });
    }
  });

  return tokens;
}

// Check if a word is a keyword
function isKeyword(word: string): boolean {
  const keywords = [
    'interface', 'type', 'class', 'extends', 'implements', 'enum',
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw',
    'async', 'await', 'import', 'export', 'from', 'default', 'as', 'namespace',
    'React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext',
    'Component', 'ReactNode', 'string', 'number', 'boolean', 'void', 'any', 'unknown',
    'never', 'object', 'Array', 'Promise', 'Function', 'true', 'false', 'null', 'undefined',
    'onClick', 'className', 'style', 'key', 'ref', 'id', 'cn'
  ];

  return keywords.includes(word);
}

// Get CSS class for token
function getTokenClassName(token: Token): string {
  if (token.type === 'string') {
    return "text-[var(--nb-code-string)]";
  }
  if (token.type === 'comment') {
    return "text-[var(--nb-code-comment)] italic";
  }
  if (token.type === 'number') {
    return "text-[var(--nb-code-number)]";
  }
  if (token.type === 'operator') {
    return "text-[var(--nb-code-operator)]";
  }
  if (token.type === 'keyword') {
    return getKeywordClassName(token.value);
  }
  return "text-[var(--nb-code-muted)]";
}

// Get specific keyword class
function getKeywordClassName(keyword: string): string {
  const keywordTypes = {
    'interface|type|class|extends|implements|enum': "text-[var(--nb-code-keyword-strong)] font-semibold",
    'function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await': "text-[var(--nb-code-keyword)] font-semibold",
    'import|export|from|default|as|namespace': "text-[var(--nb-code-tag)] font-semibold",
    'React|useState|useEffect|useCallback|useMemo|useRef|useContext|Component|ReactNode': "text-[var(--nb-code-tag)] font-semibold",
    'string|number|boolean|void|any|unknown|never|object|Array|Promise|Function': "text-[var(--nb-code-number)]",
    'true|false|null|undefined': "text-[var(--nb-code-number)] font-semibold",
    'onClick|className|style|key|ref|id|cn': "text-[var(--nb-code-string)]",
  };

  for (const [pattern, className] of Object.entries(keywordTypes)) {
    if (new RegExp(`^(${pattern})$`).test(keyword)) {
      return className;
    }
  }

  return "text-[var(--nb-code-muted)]";
}

// Python syntax highlighting
function highlightPythonLine(line: string): React.ReactNode {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  // Handle comments
  if (line.trim().startsWith('#')) {
    return <span className="text-[var(--nb-code-comment)] italic">{line}</span>;
  }

  const pythonKeywords = [
    'def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while',
    'try', 'except', 'finally', 'with', 'as', 'pass', 'break', 'continue', 'yield',
    'lambda', 'raise', 'assert', 'del', 'global', 'nonlocal', 'async', 'await',
    'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'
  ];

  const parts = line.split(/(\s+|[(){}\[\]:,.]|[=<>!+\-*/%]|["'])/);
  let inString = false;
  let stringChar = '';

  return (
    <span>
      {parts.map((part, i) => {
        // Handle string detection
        if ((part === '"' || part === "'") && !inString) {
          inString = true;
          stringChar = part;
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        } else if (part === stringChar && inString) {
          inString = false;
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        } else if (inString) {
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        }

        if (/^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        } else if (pythonKeywords.includes(part)) {
          return <span key={i} className="text-[var(--nb-code-keyword)] font-semibold">{part}</span>;
        } else if (/^\d+(\.\d+)?$/.test(part)) {
          return <span key={i} className="text-[var(--nb-code-number)]">{part}</span>;
        } else if (/^[(){}\[\]:,.]$/.test(part)) {
          return <span key={i} className="text-[var(--nb-code-operator)]">{part}</span>;
        } else {
          return <span key={i} className="text-[var(--nb-code-muted)]">{part}</span>;
        }
      })}
    </span>
  );
}

// Bash syntax highlighting
function highlightBashLine(line: string): React.ReactNode {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  // Handle comments
  if (line.trim().startsWith('#')) {
    return <span className="text-[var(--nb-code-comment)] italic">{line}</span>;
  }

  const bashKeywords = [
    'if', 'then', 'else', 'elif', 'fi', 'for', 'do', 'done', 'while', 'until',
    'case', 'esac', 'function', 'return', 'exit', 'break', 'continue', 'export',
    'source', 'alias', 'echo', 'cd', 'ls', 'pwd', 'mkdir', 'rm', 'cp', 'mv',
    'cat', 'grep', 'sed', 'awk', 'find', 'chmod', 'chown', 'sudo', 'apt', 'npm',
    'pip', 'git', 'docker', 'curl', 'wget'
  ];

  const parts = line.split(/(\s+|[|&;()<>{}$]|["'])/);
  let inString = false;
  let stringChar = '';

  return (
    <span>
      {parts.map((part, i) => {
        // Handle string detection
        if ((part === '"' || part === "'") && !inString) {
          inString = true;
          stringChar = part;
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        } else if (part === stringChar && inString) {
          inString = false;
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        } else if (inString) {
          return <span key={i} className="text-[var(--nb-code-string)]">{part}</span>;
        }

        if (/^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        } else if (bashKeywords.includes(part)) {
          return <span key={i} className="text-[var(--nb-code-keyword)] font-semibold">{part}</span>;
        } else if (part.startsWith('$')) {
          return <span key={i} className="text-[var(--nb-code-tag)] font-semibold">{part}</span>;
        } else if (part.startsWith('-')) {
          return <span key={i} className="text-[var(--nb-code-number)]">{part}</span>;
        } else if (/^[|&;()<>{}]$/.test(part)) {
          return <span key={i} className="text-[var(--nb-code-operator)]">{part}</span>;
        } else {
          return <span key={i} className="text-[var(--nb-code-muted)]">{part}</span>;
        }
      })}
    </span>
  );
}

// Enhanced Markdown Content Component
function MarkdownContent({ content }: { content: string }) {
  // Enhanced markdown-to-JSX converter
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const result: React.JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];

      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          result.push(
            <pre key={`code-${index}`} className="!bg-[var(--nb-code-bg)] !text-[var(--nb-code-fg)] p-5 overflow-x-auto mb-6 font-mono text-sm leading-relaxed border-2 border-[var(--nb-border)] shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] relative">
              <div className="absolute top-3 right-3 text-xs text-[var(--nb-code-comment)] bg-[var(--nb-code-chip-bg)] px-3 py-1.5 font-semibold uppercase tracking-wider">
                {codeLanguage || 'code'}
              </div>
              <code className={`language-${codeLanguage}`}>
                {highlightCode(codeContent.trim(), codeLanguage)}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = '';
          codeLanguage = '';
        } else {
          // Start of code block
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        result.push(
          <h1 key={index} id={id} className="mt-6 mb-4 scroll-mt-32 text-2xl font-bold text-[var(--nb-foreground)] sm:mt-8 sm:mb-6 sm:text-3xl lg:text-4xl">
            {text}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        result.push(
          <h2 key={index} id={id} className="mt-6 mb-3 scroll-mt-32 border-b border-[var(--nb-border-subtle)] pb-2 text-xl font-semibold text-[var(--nb-foreground)] sm:mt-8 sm:mb-4 sm:text-2xl lg:text-3xl">
            {text}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        result.push(
          <h3 key={index} id={id} className="mt-4 mb-2 scroll-mt-32 text-lg font-semibold text-[var(--nb-foreground)] sm:mt-6 sm:mb-3 sm:text-xl lg:text-2xl">
            {text}
          </h3>
        );
        continue;
      }

      // Lists (including nested lists with indentation)
      if (line.match(/^(\d+\.|-)\s+/) || line.match(/^\s+(-)\s+/)) {
        const listItems: Array<{ text: string; indent: number; ordered: boolean }> = [];
        let nextIndex = index;

        // Collect consecutive list items (both ordered and unordered, with indentation)
        while (nextIndex < lines.length) {
          const currentLine = lines[nextIndex];
          const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.+)$/);
          const unorderedMatch = currentLine.match(/^(\s*)(-)\s+(.+)$/);

          if (orderedMatch) {
            const indent = orderedMatch[1].length / 3; // Assuming 3 spaces per indent level
            listItems.push({ text: orderedMatch[3], indent, ordered: true });
            nextIndex++;
          } else if (unorderedMatch) {
            const indent = unorderedMatch[1].length / 3;
            listItems.push({ text: unorderedMatch[3], indent, ordered: false });
            nextIndex++;
          } else if (currentLine.trim() === '') {
            // Allow empty lines within lists
            nextIndex++;
            break;
          } else {
            break;
          }
        }

        // Render nested list structure
        const renderNestedList = (items: typeof listItems, currentIndent = 0): React.ReactNode => {
          const currentLevelItems = items.filter(item => item.indent === currentIndent);
          if (currentLevelItems.length === 0) return null;

          const ListTag = currentLevelItems[0].ordered ? 'ol' : 'ul';
          const listClass = currentLevelItems[0].ordered
            ? "mb-4 pl-6 list-decimal"
            : "mb-4 pl-6 list-disc";

          return (
            <ListTag className={listClass}>
              {currentLevelItems.map((item, i) => {
                const itemIndex = items.indexOf(item);
                const nextIndentItems = items.slice(itemIndex + 1).filter(
                  nextItem => nextItem.indent > currentIndent
                );

                return (
                  <li key={i} className="mb-2 text-[var(--nb-foreground-muted)]">
                    {renderInlineFormatting(item.text)}
                    {nextIndentItems.length > 0 && renderNestedList(nextIndentItems, currentIndent + 1)}
                  </li>
                );
              })}
            </ListTag>
          );
        };

        result.push(
          <div key={index}>
            {renderNestedList(listItems)}
          </div>
        );

        index = nextIndex - 1;
        continue;
      }

      // Regular paragraphs
      if (line.trim() && !line.startsWith('#')) {
        result.push(
          <p key={index} className="mb-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)] sm:mb-6 sm:text-base sm:leading-loose">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    }

    return result;
  };

  // Helper function to render inline formatting
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle inline code
    if (text.includes('`')) {
      const parts = text.split('`');
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded border border-[var(--nb-inline-code-border)] bg-[var(--nb-inline-code-bg)] px-2 py-1 font-mono text-sm font-semibold text-[var(--nb-inline-code-fg)]">
            {part}
          </code>
        ) : renderBoldText(part)
      );
    }

    return renderBoldText(text);
  };

  // Helper function to render bold text
  const renderBoldText = (text: string): React.ReactNode => {
    if (text.includes('**')) {
      const parts = text.split('**');
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--nb-foreground)]">
            {part}
          </strong>
        ) : renderLinks(part)
      );
    }

    return renderLinks(text);
  };

  // Helper function to render links
  const renderLinks = (text: string): React.ReactNode => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the link
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--nb-accent-ink)] underline underline-offset-2 transition-colors hover:text-[var(--nb-accent)]"
        >
          {linkText}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return <div className="max-w-none">{renderContent(content)}</div>;
}

// Table of Contents Component with throttled scroll tracking
function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");

  // Extract TOC items directly from markdown content using regex
  const tocItems = useMemo(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: Array<{
      level: number;
      text: string;
      href: string;
      id: string;
    }> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      items.push({
        level,
        text,
        href: `#${id}`,
        id,
      });
    }

    return items;
  }, [content]);

  // Use ref to avoid stale closure issues
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  // Scroll tracking with requestAnimationFrame throttling
  useEffect(() => {
    if (tocItems.length === 0) return;

    let ticking = false;

    const updateActiveHeading = () => {
      const headings = document.querySelectorAll("h2[id], h3[id]");
      if (headings.length === 0) {
        ticking = false;
        return;
      }

      const scrollTop = window.scrollY;
      const offset = 120;

      let currentId = "";

      // Find the heading that's currently at the top of the viewport
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop - offset <= scrollTop) {
          currentId = heading.id;
          break;
        }
      }

      // If no heading found (we're at the very top), use the first one
      if (!currentId && headings.length > 0) {
        currentId = headings[0].id;
      }

      if (currentId && currentId !== activeIdRef.current) {
        setActiveId(currentId);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveHeading);
        ticking = true;
      }
    };

    // Initial update after content renders
    const timer = setTimeout(() => {
      updateActiveHeading();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tocItems]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  if (tocItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 w-full">
      <span className="text-lg font-medium text-[var(--nb-foreground)]">
        Table of Contents
      </span>
      <ul className="flex list-none flex-col gap-y-2 w-full">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`text-sm w-full ${item.level === 2 ? "pl-0" : "pl-4"}`}
          >
            <a
              href={item.href}
              onClick={(e) => handleClick(e, item.id)}
              className={`block transition-colors ${
                activeId === item.id
                  ? "text-[var(--nb-foreground)] font-bold"
                  : "text-[var(--nb-foreground-muted)] hover:text-[var(--nb-foreground)]"
              }`}
            >
              {item.text.replaceAll("*", "")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Post Navigation Component
function PostNavigation({ post, allPosts }: { post: BlogPost; allPosts: BlogPost[] }) {
  // Sort posts by publication date (newest first)
  const sortedPosts = allPosts
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  // Find current post index
  const currentIndex = sortedPosts.findIndex((p) => p.slug === post.slug);

  // Get previous and next posts
  const previousPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Previous Post */}
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 transition-colors duration-150 hover:bg-[var(--nb-surface-alt)]"
        >
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="h-3 w-3 text-[var(--nb-foreground-subtle)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-xs text-[var(--nb-foreground-muted)]">
              Previous
            </span>
          </div>
          <div className="line-clamp-2 text-sm font-medium leading-tight text-[var(--nb-foreground)] transition-colors group-hover:text-[var(--nb-accent-ink)]">
            {previousPost.title}
          </div>
        </Link>
      ) : (
        <div className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] p-3 opacity-60">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="h-3 w-3 text-[var(--nb-foreground-subtle)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-xs text-[var(--nb-foreground-subtle)]">
              Previous
            </span>
          </div>
          <div className="text-sm text-[var(--nb-foreground-subtle)]">
            Oldest post
          </div>
        </div>
      )}

      {/* Next Post */}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 text-right transition-colors duration-150 hover:bg-[var(--nb-surface-alt)]"
        >
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs text-[var(--nb-foreground-muted)]">
              Next
            </span>
            <svg
              className="h-3 w-3 text-[var(--nb-foreground-subtle)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
          <div className="line-clamp-2 text-sm font-medium leading-tight text-[var(--nb-foreground)] transition-colors group-hover:text-[var(--nb-accent-ink)]">
            {nextPost.title}
          </div>
        </Link>
      ) : (
        <div className="border-2 border-[var(--nb-border-subtle)] bg-[var(--nb-surface-alt)] p-3 text-right opacity-60">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs text-[var(--nb-foreground-subtle)]">
              Next
            </span>
            <svg
              className="h-3 w-3 text-[var(--nb-foreground-subtle)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
          <div className="text-sm text-[var(--nb-foreground-subtle)]">
            Newest post
          </div>
        </div>
      )}
    </div>
  );
}

interface BlogPostClientProps {
  post: BlogPost;
  allPosts: BlogPost[];
  author?: any;
}

export default function BlogPostClient({ post, allPosts, author }: BlogPostClientProps) {
  return (
    <div className="xl:max-w-6xl xl:mx-auto xl:px-6 xl:py-8">
      <div className="xl:grid xl:grid-cols-[250px_1fr] xl:gap-8">
        {/* Left TOC Sidebar - Sticky */}
        <aside className="hidden xl:block">
          <div className="sticky top-8">
            <TableOfContents content={post.rawContent || ""} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="max-w-3xl xl:max-w-none mx-auto px-4 xl:px-0 py-8 xl:py-0">
            <article>
            {/* Article Header */}
            <header className="mb-8 sm:mb-12">
              {/* Category */}
              {post.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-strong)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nb-foreground-inverse)] sm:text-sm">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="mb-4 text-2xl font-bold leading-tight text-[var(--nb-foreground)] sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Description */}
              <p className="mb-6 text-lg leading-relaxed text-[var(--nb-foreground-muted)] sm:mb-8 sm:text-xl">
                {post.description}
              </p>

              {/* Author & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] text-sm font-bold text-[var(--nb-foreground-inverse)] sm:h-10 sm:w-10">
                    {(author?.name || post.author).charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--nb-foreground)]">
                      {author?.name || post.author}
                    </div>
                    <div className="text-sm text-[var(--nb-foreground-muted)]">
                      {formatDate(post.publishedAt)} • {post.readingTime} min
                      read
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] px-3 py-1 text-xs font-medium text-[var(--nb-foreground-muted)] sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Previous/Next Navigation - Minimal */}
            <PostNavigation post={post} allPosts={allPosts} />

            {/* Article Content */}
            <div className="max-w-none">
              <MarkdownContent content={post.rawContent || ""} />
            </div>

            {/* Author Bio */}
            {author && (
              <div className="mt-12 border-t-2 border-[var(--nb-border)] pt-6 sm:mt-16 sm:pt-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-accent)] font-bold text-[var(--nb-foreground-inverse)] sm:h-16 sm:w-16 sm:text-xl">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-[var(--nb-foreground)] sm:text-xl">
                      {author.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--nb-foreground-muted)] sm:text-base">
                      {author.bio ||
                        "Building modern web applications with React, TypeScript, and the latest technologies. Passionate about creating developer-friendly tools and sharing knowledge with the community."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
