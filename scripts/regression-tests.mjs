#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { parseMarkdown } from "../lib/blog-markdown.ts";
import { getAllPosts } from "../lib/blog.ts";
import { normalizeMarkdownHref } from "../lib/markdown-links.ts";
import { clearPauseTimeout, schedulePauseTimeout } from "../lib/pause-timeout.ts";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("normalizeMarkdownHref only allows safe schemes and paths", () => {
  assert.deepEqual(normalizeMarkdownHref("https://example.com/docs"), {
    href: "https://example.com/docs",
    isExternal: true,
  });
  assert.deepEqual(normalizeMarkdownHref("mailto:test@example.com"), {
    href: "mailto:test@example.com",
    isExternal: false,
  });
  assert.deepEqual(normalizeMarkdownHref("/blog/hello-world"), {
    href: "/blog/hello-world",
    isExternal: false,
  });
  assert.deepEqual(normalizeMarkdownHref("#section"), {
    href: "#section",
    isExternal: false,
  });
  assert.deepEqual(normalizeMarkdownHref("javascript:alert(1)"), {
    href: "#",
    isExternal: false,
  });
  assert.deepEqual(normalizeMarkdownHref("data:text/html,evil"), {
    href: "#",
    isExternal: false,
  });
});

test("parseMarkdown keeps a top-of-file horizontal rule", () => {
  const parsed = parseMarkdown(["---", "---", "# Heading"].join("\n"));
  assert.equal(parsed.blocks[0]?.type, "hr");
});

test("parseMarkdown strips valid frontmatter", () => {
  const parsed = parseMarkdown(["---", "title: Sample Post", "---", "# Heading"].join("\n"));
  assert.equal(parsed.blocks[0]?.type, "heading");
});

test("getAllPosts handles invalid dates without NaN and keeps deterministic ordering", async () => {
  const originalCwd = process.cwd();
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-regression-"));
  const blogDir = path.join(tempRoot, "content", "blog");
  await fs.mkdir(blogDir, { recursive: true });

  await fs.writeFile(
    path.join(blogDir, "valid-date.mdx"),
    ["---", "title: Valid Date", "publishedAt: 2024-01-02", "---", "Content"].join("\n"),
    "utf8"
  );
  await fs.writeFile(
    path.join(blogDir, "invalid-date.mdx"),
    ["---", "title: Invalid Date", "publishedAt: definitely-not-a-date", "---", "Content"].join("\n"),
    "utf8"
  );
  await fs.writeFile(
    path.join(blogDir, "missing-date.mdx"),
    ["---", "title: Missing Date", "---", "Content"].join("\n"),
    "utf8"
  );

  try {
    process.chdir(tempRoot);
    const posts = await getAllPosts();

    assert.equal(posts.length, 3);
    assert.equal(posts[0]?.slug, "valid-date");
    assert.ok(posts.every((post) => Number.isFinite(post.publishedAt.getTime())));
    assert.equal(posts.find((post) => post.slug === "invalid-date")?.publishedAt.getTime(), 0);
    assert.equal(posts.find((post) => post.slug === "missing-date")?.publishedAt.getTime(), 0);
  } finally {
    process.chdir(originalCwd);
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});

test("pause timeout cancellation prevents stale pause execution", async () => {
  const pauseTimeoutRef = { current: null };
  let callbackRuns = 0;

  schedulePauseTimeout(
    pauseTimeoutRef,
    () => {
      callbackRuns += 1;
    },
    20
  );
  clearPauseTimeout(pauseTimeoutRef);
  await sleep(50);
  assert.equal(callbackRuns, 0);

  schedulePauseTimeout(
    pauseTimeoutRef,
    () => {
      callbackRuns += 1;
    },
    20
  );
  await sleep(50);
  assert.equal(callbackRuns, 1);
  assert.equal(pauseTimeoutRef.current, null);
});
