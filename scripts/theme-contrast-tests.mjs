import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function toLinear(channel) {
  const c = channel / 255;
  if (c <= 0.03928) return c / 12.92;
  return ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(foregroundHex, backgroundHex) {
  const l1 = luminance(foregroundHex);
  const l2 = luminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getThemeBlocks(globals) {
  const darkStart = globals.indexOf(":root {");
  const lightStart = globals.indexOf(':root[data-theme="light"] {');

  assert(darkStart !== -1, "Dark theme block missing in globals.css");
  assert(lightStart !== -1, "Light theme block missing in globals.css");

  const darkBlock = globals.slice(darkStart, lightStart);

  const lightEndCandidates = [
    globals.indexOf("\n\n  * {", lightStart),
    globals.indexOf("\n\n@", lightStart),
    globals.length,
  ].filter((idx) => idx !== -1);
  const lightEnd = Math.min(...lightEndCandidates);
  const lightBlock = globals.slice(lightStart, lightEnd);

  return { darkBlock, lightBlock };
}

function parseTokenMap(block) {
  const map = {};
  const regex = /--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let match;
  while ((match = regex.exec(block)) !== null) {
    map[`--${match[1]}`] = match[2].toLowerCase();
  }
  return map;
}

function getToken(tokenMap, tokenName, themeName) {
  assert(tokenMap[tokenName], `${themeName} token ${tokenName} is missing`);
  return tokenMap[tokenName];
}

function assertMinContrast({
  themeName,
  tokenMap,
  foreground,
  background,
  minRatio,
  label,
}) {
  const fg = getToken(tokenMap, foreground, themeName);
  const bg = getToken(tokenMap, background, themeName);
  const ratio = contrastRatio(fg, bg);
  assert(
    ratio >= minRatio,
    `${themeName} ${label} contrast too low: ${ratio.toFixed(2)} < ${minRatio.toFixed(2)} (${foreground} on ${background})`
  );
}

function testThemeTokens() {
  console.log("\n🎨 Testing Theme Tokens...");

  const globals = read("app/globals.css");
  const { darkBlock, lightBlock } = getThemeBlocks(globals);
  const dark = parseTokenMap(darkBlock);
  const light = parseTokenMap(lightBlock);

  [dark, light].forEach((tokens, index) => {
    const themeName = index === 0 ? "dark" : "light";

    [
      "--nb-background",
      "--nb-surface",
      "--nb-surface-strong",
      "--nb-foreground",
      "--nb-foreground-inverse",
      "--nb-border",
      "--nb-accent",
      "--nb-accent-ink",
      "--nb-accent-ink-inverse",
      "--nb-code-bg",
      "--nb-code-fg",
      "--nb-code-keyword",
      "--nb-code-string",
      "--nb-code-number",
      "--nb-code-comment",
      "--nb-inline-code-bg",
      "--nb-inline-code-border",
      "--nb-inline-code-fg",
    ].forEach((tokenName) => {
      assert(tokens[tokenName], `${themeName} theme missing ${tokenName}`);
    });
  });

  console.log("✅ Theme tokens validated");
}

function testTokenContrastRatios() {
  console.log("\n📏 Testing Token Contrast Ratios...");

  const globals = read("app/globals.css");
  const { darkBlock, lightBlock } = getThemeBlocks(globals);
  const themeMaps = [
    { themeName: "dark", tokenMap: parseTokenMap(darkBlock) },
    { themeName: "light", tokenMap: parseTokenMap(lightBlock) },
  ];

  themeMaps.forEach(({ themeName, tokenMap }) => {
    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-foreground-inverse",
      background: "--nb-accent",
      minRatio: 4.5,
      label: "accent button text",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-accent-ink",
      background: "--nb-surface",
      minRatio: 4.5,
      label: "accent text",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-accent-ink-inverse",
      background: "--nb-surface-strong",
      minRatio: 4.5,
      label: "accent text on strong surface",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-code-fg",
      background: "--nb-code-bg",
      minRatio: 7,
      label: "code base text",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-inline-code-fg",
      background: "--nb-inline-code-bg",
      minRatio: 4.5,
      label: "inline code text",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-code-muted",
      background: "--nb-code-bg",
      minRatio: 4.5,
      label: "code muted text",
    });

    assertMinContrast({
      themeName,
      tokenMap,
      foreground: "--nb-code-comment",
      background: "--nb-code-bg",
      minRatio: 3.8,
      label: "code comment text",
    });

    [
      "--nb-code-keyword",
      "--nb-code-keyword-strong",
      "--nb-code-string",
      "--nb-code-number",
      "--nb-code-tag",
      "--nb-code-operator",
    ].forEach((tokenName) => {
      assertMinContrast({
        themeName,
        tokenMap,
        foreground: tokenName,
        background: "--nb-code-bg",
        minRatio: 4.5,
        label: `code syntax token ${tokenName}`,
      });
    });
  });

  console.log("✅ Token contrast ratios validated");
}

function testNoHardcodedColors() {
  console.log("\n🚫 Testing for Hardcoded Colors...");

  const files = [
    { name: "BlogPostClient", content: read("components/blog/BlogPostClient.tsx") },
    { name: "FeaturePostCard", content: read("components/blog/FeaturePostCard.tsx") },
    { name: "RegularPostCard", content: read("components/blog/RegularPostCard.tsx") },
    { name: "MusicPlayer", content: read("components/blog/MusicPlayer.tsx") },
    { name: "BlogIndex", content: read("app/blog/page.tsx") },
    { name: "HeroContent", content: read("components/home/HeroContent.tsx") },
    { name: "HomeFooter", content: read("components/home/HomeFooter.tsx") },
    { name: "HomeHeader", content: read("components/home/HomeHeader.tsx") },
  ];

  const forbiddenPatterns = [
    "text-gray-",
    "bg-gray-",
    "border-gray-",
    "text-blue-",
    "text-purple-",
    "text-emerald-",
    "text-orange-",
    "dark:",
    "#8f79b2",
    "#d8c8ee",
  ];

  files.forEach(({ name, content }) => {
    forbiddenPatterns.forEach((pattern) => {
      assert(!content.includes(pattern), `${name} contains forbidden hardcoded color: ${pattern}`);
    });
  });

  console.log("✅ No hardcoded colors found");
}

function testAccentForegroundContrast() {
  console.log("\n🔠 Testing Accent Foreground Contrast...");

  const features = read("components/blog/FeaturePostCard.tsx");
  const regular = read("components/blog/RegularPostCard.tsx");
  const musicPlayer = read("components/blog/MusicPlayer.tsx");

  assert(
    features.includes("bg-[var(--nb-accent)]") &&
      features.includes("text-[var(--nb-foreground-inverse)]"),
    "FeaturePostCard featured pill must use inverse foreground on accent background"
  );

  assert(
    features.includes("text-[var(--nb-accent-ink)]"),
    "FeaturePostCard read CTA must use accent-ink for readable accent text"
  );

  assert(
    regular.includes("bg-[var(--nb-accent-light)]") &&
      regular.includes("text-[var(--nb-foreground-inverse)]"),
    "RegularPostCard initial badge must use inverse foreground on accent background"
  );

  assert(
    musicPlayer.includes("bg-[var(--nb-accent)]") &&
      musicPlayer.includes("text-[var(--nb-foreground-inverse)]"),
    "MusicPlayer FAB and play controls must use inverse foreground on accent background"
  );

  console.log("✅ Accent foreground contrast validated");
}

function testThemeVariables() {
  console.log("\n🎯 Testing Theme Variable Usage...");

  const blogPost = read("components/blog/BlogPostClient.tsx");
  const footer = read("components/home/HomeFooter.tsx");
  const backdrop = read("components/home/HeroBackdrop.tsx");

  assert(
    blogPost.includes("var(--nb-foreground)") || blogPost.includes("text-[var(--nb-"),
    "BlogPostClient must use theme variables for text colors"
  );

  assert(
    blogPost.includes("var(--nb-code-bg)") || blogPost.includes("bg-[var(--nb-"),
    "BlogPostClient must use theme variables for code/background colors"
  );

  assert(
    blogPost.includes("var(--nb-accent-ink)"),
    "BlogPostClient must use accent-ink for readable accent text"
  );

  assert(
    blogPost.includes("var(--nb-inline-code-fg)") &&
      blogPost.includes("var(--nb-inline-code-bg)"),
    "BlogPostClient inline code must use dedicated high-contrast inline code tokens"
  );

  assert(
    footer.includes("var(--nb-surface-strong)") || footer.includes("bg-[var(--nb-"),
    "HomeFooter must use theme-aware background"
  );

  assert(
    footer.includes("var(--nb-foreground-inverse)") || footer.includes("text-white"),
    "HomeFooter must use inverse foreground for contrast"
  );

  assert(
    !backdrop.includes("rgba(88, 101, 242, 0.34)") || backdrop.includes("var(--nb-"),
    "HeroBackdrop should use theme variables instead of hardcoded rgba"
  );

  console.log("✅ Theme variables properly used");
}

function testSyntaxHighlighting() {
  console.log("\n💡 Testing Syntax Highlighting Colors...");

  const blogPost = read("components/blog/BlogPostClient.tsx");

  const requiredSyntaxTokens = [
    "var(--nb-code-bg)",
    "var(--nb-code-fg)",
    "var(--nb-code-muted)",
    "var(--nb-code-comment)",
    "var(--nb-code-keyword)",
    "var(--nb-code-keyword-strong)",
    "var(--nb-code-string)",
    "var(--nb-code-number)",
    "var(--nb-code-tag)",
    "var(--nb-code-operator)",
  ];

  requiredSyntaxTokens.forEach((token) => {
    assert(blogPost.includes(token), `Syntax highlighting is missing ${token}`);
  });

  assert(
    blogPost.includes("text-[var(--nb-code-comment)]") || blogPost.includes("italic"),
    "Syntax highlighting comments should be styled"
  );

  console.log("✅ Syntax highlighting uses dedicated code tokens");
}

function testComponentContrast() {
  console.log("\n🔍 Testing Component Contrast Patterns...");

  const process = read("components/home/neo/NeoProcessSection.tsx");
  const compare = read("components/home/neo/NeoCompareSection.tsx");
  const ticker = read("components/InfiniteTicker.tsx");
  const footer = read("components/home/HomeFooter.tsx");

  const darkSectionComponents = [
    { name: "NeoProcessSection", content: process },
    { name: "NeoCompareSection", content: compare },
    { name: "InfiniteTicker", content: ticker },
    { name: "HomeFooter", content: footer },
  ];

  darkSectionComponents.forEach(({ name, content }) => {
    if (content.includes("bg-[var(--nb-surface-strong)]")) {
      assert(
        content.includes("text-[var(--nb-foreground-inverse)]") || content.includes("text-white"),
        `${name} uses surface-strong but lacks foreground-inverse (contrast issue)`
      );
    }
  });

  [process, compare, ticker].forEach((content, idx) => {
    const fileName = ["NeoProcessSection", "NeoCompareSection", "InfiniteTicker"][idx];
    if (content.includes("text-[var(--nb-accent)]")) {
      throw new Error(`${fileName} should use accent-ink(-inverse) for text on dark sections`);
    }
  });

  console.log("✅ Component contrast patterns validated");
}

function testCodeBlocks() {
  console.log("\n📦 Testing Code Block Styling...");

  const blogPost = read("components/blog/BlogPostClient.tsx");

  assert(
    blogPost.includes("bg-[var(--nb-code-bg)]") || blogPost.includes("!bg-[var(--nb-code-bg)]"),
    "Code blocks should use nb-code-bg"
  );

  assert(
    blogPost.includes("text-[var(--nb-code-fg)]") || blogPost.includes("!text-[var(--nb-code-fg)]"),
    "Code blocks should use nb-code-fg for base text"
  );

  assert(
    blogPost.includes("bg-[var(--nb-code-chip-bg)]"),
    "Code block language label should use nb-code-chip-bg"
  );

  assert(
    blogPost.includes("bg-[var(--nb-inline-code-bg)]"),
    "Inline code should use dedicated inline code background token"
  );

  console.log("✅ Code block styling validated");
}

function run() {
  console.log("════════════════════════════════════════");
  console.log("🎨 THEME CONTRAST TEST SUITE");
  console.log("════════════════════════════════════════");

  try {
    testThemeTokens();
    testTokenContrastRatios();
    testNoHardcodedColors();
    testAccentForegroundContrast();
    testThemeVariables();
    testSyntaxHighlighting();
    testComponentContrast();
    testCodeBlocks();

    console.log("\n════════════════════════════════════════");
    console.log("✅ ALL THEME CONTRAST TESTS PASSED");
    console.log("════════════════════════════════════════\n");
  } catch (error) {
    console.error("\n════════════════════════════════════════");
    console.error("❌ THEME CONTRAST TEST FAILED");
    console.error("════════════════════════════════════════");
    console.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

run();
