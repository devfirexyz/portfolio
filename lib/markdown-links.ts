export function normalizeMarkdownHref(rawHref: string): { href: string; isExternal: boolean } {
  const href = rawHref.split(/\s+/)[0].replace(/^<|>$/g, "");
  if (!href) {
    return { href: "#", isExternal: false };
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return { href, isExternal: false };
  }

  const schemeMatch = href.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (!schemeMatch) {
    return { href: "#", isExternal: false };
  }

  const scheme = schemeMatch[1].toLowerCase();
  if (!["http", "https", "mailto", "tel"].includes(scheme)) {
    return { href: "#", isExternal: false };
  }

  return { href, isExternal: scheme === "http" || scheme === "https" };
}
