"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
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
    return <span className="text-gray-300">{code}</span>;
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
        <div key={index} className="block text-emerald-300">
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
    return 'text-emerald-400';
  }
  if (token.type === 'comment') {
    return 'text-gray-500 italic';
  }
  if (token.type === 'number') {
    return 'text-orange-400';
  }
  if (token.type === 'operator') {
    return 'text-gray-300';
  }
  if (token.type === 'keyword') {
    return getKeywordClassName(token.value);
  }
  return 'text-gray-300';
}

// Get specific keyword class
function getKeywordClassName(keyword: string): string {
  const keywordTypes = {
    'interface|type|class|extends|implements|enum': 'text-blue-400 font-semibold',
    'function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await': 'text-purple-400 font-semibold',
    'import|export|from|default|as|namespace': 'text-pink-400 font-semibold',
    'React|useState|useEffect|useCallback|useMemo|useRef|useContext|Component|ReactNode': 'text-cyan-400 font-semibold',
    'string|number|boolean|void|any|unknown|never|object|Array|Promise|Function': 'text-yellow-400',
    'true|false|null|undefined': 'text-orange-400 font-semibold',
    'onClick|className|style|key|ref|id|cn': 'text-green-400',
  };

  for (const [pattern, className] of Object.entries(keywordTypes)) {
    if (new RegExp(`^(${pattern})$`).test(keyword)) {
      return className;
    }
  }

  return 'text-gray-300';
}

// Python syntax highlighting
function highlightPythonLine(line: string): React.ReactNode {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  // Handle comments
  if (line.trim().startsWith('#')) {
    return <span className="text-gray-500 italic">{line}</span>;
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
          return <span key={i} className="text-green-400">{part}</span>;
        } else if (part === stringChar && inString) {
          inString = false;
          return <span key={i} className="text-green-400">{part}</span>;
        } else if (inString) {
          return <span key={i} className="text-green-400">{part}</span>;
        }

        if (/^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        } else if (pythonKeywords.includes(part)) {
          return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
        } else if (/^\d+(\.\d+)?$/.test(part)) {
          return <span key={i} className="text-orange-400">{part}</span>;
        } else if (/^[(){}\[\]:,.]$/.test(part)) {
          return <span key={i} className="text-yellow-300">{part}</span>;
        } else {
          return <span key={i} className="text-cyan-300">{part}</span>;
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
    return <span className="text-gray-500 italic">{line}</span>;
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
          return <span key={i} className="text-green-400">{part}</span>;
        } else if (part === stringChar && inString) {
          inString = false;
          return <span key={i} className="text-green-400">{part}</span>;
        } else if (inString) {
          return <span key={i} className="text-green-400">{part}</span>;
        }

        if (/^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        } else if (bashKeywords.includes(part)) {
          return <span key={i} className="text-pink-400 font-semibold">{part}</span>;
        } else if (part.startsWith('$')) {
          return <span key={i} className="text-cyan-400 font-semibold">{part}</span>;
        } else if (part.startsWith('-')) {
          return <span key={i} className="text-yellow-300">{part}</span>;
        } else if (/^[|&;()<>{}]$/.test(part)) {
          return <span key={i} className="text-orange-300">{part}</span>;
        } else {
          return <span key={i} className="text-emerald-300">{part}</span>;
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
            <pre key={`code-${index}`} className="!bg-[#1a1b26] !text-[#c0caf5] p-5 rounded-xl overflow-x-auto mb-6 font-mono text-sm leading-relaxed border border-[#414868] shadow-lg relative">
              <div className="absolute top-3 right-3 text-xs text-gray-400 bg-[#2a2b3c] px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider">
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
          <h1 key={index} id={id} className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 mt-6 sm:mt-8 text-gray-900 dark:text-white scroll-mt-32">
            {text}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        result.push(
          <h2 key={index} id={id} className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 mt-6 sm:mt-8 text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-gray-700/50 pb-2 scroll-mt-32">
            {text}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        result.push(
          <h3 key={index} id={id} className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6 text-gray-900 dark:text-white scroll-mt-32">
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
                  <li key={i} className="mb-2 text-gray-700 dark:text-gray-300">
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
          <p key={index} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed sm:leading-loose mb-4 sm:mb-6">
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
          <code key={i} className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded text-sm font-mono">
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
          <strong key={i} className="text-gray-900 dark:text-white font-semibold">
            {part}
          </strong>
        ) : part
      );
    }

    return text;
  };

  return <div className="prose prose-invert max-w-none">{renderContent(content)}</div>;
}

// Table of Contents Component
function TableOfContents({ content }: { content: string }) {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [tocItems, setTocItems] = useState<
    Array<{ level: number; text: string; href: string; id: string }>
  >([]);

  // Refs to store DOM elements
  const headingsRef = useRef<HTMLElement[]>([]);
  const regionsRef = useRef<{ id: string; start: number; end: number }[]>([]);

  useEffect(() => {
    // Extract TOC items directly from markdown content using regex
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
      // Create consistent IDs that match what our markdown renderer creates
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

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const HEADER_OFFSET = 150;

    const buildHeadingRegions = () => {
      headingsRef.current = Array.from(
        document.querySelectorAll("h2[id], h3[id]")
      ) as HTMLElement[];

      if (headingsRef.current.length === 0) {
        regionsRef.current = [];
        return;
      }

      regionsRef.current = headingsRef.current.map((heading, index) => {
        const nextHeading = headingsRef.current[index + 1];
        return {
          id: heading.id,
          start: heading.offsetTop,
          end: nextHeading ? nextHeading.offsetTop : document.body.scrollHeight,
        };
      });
    };

    const getVisibleIds = (): string[] => {
      if (headingsRef.current.length === 0) return [];

      const viewportTop = window.scrollY + HEADER_OFFSET;
      const viewportBottom = window.scrollY + window.innerHeight;
      const visibleIds = new Set<string>();

      const isInViewport = (top: number, bottom: number) =>
        (top >= viewportTop && top <= viewportBottom) ||
        (bottom >= viewportTop && bottom <= viewportBottom) ||
        (top <= viewportTop && bottom >= viewportBottom);

      headingsRef.current.forEach((heading) => {
        const headingBottom = heading.offsetTop + heading.offsetHeight;
        if (isInViewport(heading.offsetTop, headingBottom)) {
          visibleIds.add(heading.id);
        }
      });

      regionsRef.current.forEach((region) => {
        if (region.start <= viewportBottom && region.end >= viewportTop) {
          const heading = document.getElementById(region.id);
          if (heading) {
            const headingBottom = heading.offsetTop + heading.offsetHeight;
            if (
              region.end > headingBottom &&
              (headingBottom < viewportBottom || viewportTop < region.end)
            ) {
              visibleIds.add(region.id);
            }
          }
        }
      });

      return Array.from(visibleIds);
    };

    const handleScroll = () => {
      const newActiveIds = getVisibleIds();

      if (JSON.stringify(newActiveIds) !== JSON.stringify(activeIds)) {
        setActiveIds(newActiveIds);
      }
    };

    const handleResize = () => {
      buildHeadingRegions();
      const newActiveIds = getVisibleIds();

      if (JSON.stringify(newActiveIds) !== JSON.stringify(activeIds)) {
        setActiveIds(newActiveIds);
      }
    };

    // Initialize after content loads
    const timer = setTimeout(() => {
      buildHeadingRegions();
      handleScroll();

      const options = { passive: true };
      window.addEventListener("scroll", handleScroll, options);
      window.addEventListener("resize", handleResize, options);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [tocItems, activeIds]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        // Scroll with offset to account for any fixed headers
        const yOffset = -120;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    },
    []
  );

  if (tocItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 w-full">
      <span className="text-lg font-medium text-gray-900 dark:text-white">
        Table of Contents
      </span>
      <ul className="flex list-none flex-col gap-y-2 w-full">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`text-sm w-full ${item.level === 2 ? "pl-0" : "pl-4"} ${
              activeIds.includes(item.id)
                ? "text-gray-900 dark:text-white font-bold"
                : "text-gray-900 dark:text-gray-400"
            }`}
          >
            <a
              href={item.href}
              className="underline decoration-transparent underline-offset-[3px] transition-all duration-300 ease-in-out hover:decoration-inherit block"
              onClick={(e) => handleClick(e, item.id)}
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
          className="group p-3 bg-gray-200 dark:bg-gray-900/50 rounded-lg border border-gray-500 dark:border-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-800/50 hover:border-gray-600 dark:hover:border-gray-600 transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-3 h-3 text-gray-900 dark:text-gray-500"
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
            <span className="text-xs text-gray-900 dark:text-gray-400">
              Previous
            </span>
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2 leading-tight">
            {previousPost.title}
          </div>
        </Link>
      ) : (
        <div className="p-3 bg-gray-200 dark:bg-gray-900/20 rounded-lg border border-gray-500 dark:border-gray-700/30 opacity-50">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-3 h-3 text-gray-300 dark:text-gray-600"
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
            <span className="text-xs text-gray-400 dark:text-gray-600">
              Previous
            </span>
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            Oldest post
          </div>
        </div>
      )}

      {/* Next Post */}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group p-3 bg-gray-200 dark:bg-gray-900/50 rounded-lg border border-gray-500 dark:border-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-800/50 hover:border-gray-600 dark:hover:border-gray-600 transition-all duration-200 text-right"
        >
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs text-gray-900 dark:text-gray-400">
              Next
            </span>
            <svg
              className="w-3 h-3 text-gray-900 dark:text-gray-500"
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
          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2 leading-tight">
            {nextPost.title}
          </div>
        </Link>
      ) : (
        <div className="p-3 bg-gray-200 dark:bg-gray-900/20 rounded-lg border border-gray-500 dark:border-gray-700/30 opacity-50 text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs text-gray-400 dark:text-gray-600">
              Next
            </span>
            <svg
              className="w-3 h-3 text-gray-300 dark:text-gray-600"
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
          <div className="text-sm text-gray-400 dark:text-gray-600">
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
        {/* Left TOC Sidebar */}
        <aside className="hidden xl:block sticky top-20 self-start">
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
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
                  <span className="text-xs sm:text-sm font-medium text-white dark:text-gray-400 uppercase tracking-wide bg-gray-800 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8">
                {post.description}
              </p>

              {/* Author & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-purple-700 dark:text-purple-200">
                    {(author?.name || post.author).charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {author?.name || post.author}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-400">
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
                      className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium bg-gray-800 dark:bg-white/10 text-white dark:text-gray-300 rounded-full border border-gray-800 dark:border-white/10"
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
              <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-600 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-200 font-bold text-lg sm:text-xl">
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {author.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
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