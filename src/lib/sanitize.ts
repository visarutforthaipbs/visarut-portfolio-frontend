import DOMPurify from "isomorphic-dompurify";

/** Trusted iframe host allowlist */
const TRUSTED_IFRAME_HOSTS = [
  "www.facebook.com",
  "web.facebook.com",
  "facebook.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "open.spotify.com",
  "www.google.com",
  "maps.google.com",
  "docs.google.com",
];

function isTrustedIframeSrc(src: string): boolean {
  try {
    const normalized = src.startsWith("//") ? `https:${src}` : src;
    const url = new URL(normalized);
    return TRUSTED_IFRAME_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

// Configure DOMPurify to allow iframes only from trusted sources
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const el = node as Element;
    const src = el.getAttribute?.("src") || "";
    if (!isTrustedIframeSrc(src)) {
      el.remove();
    }
  }
});

// Configure DOMPurify to ensure external links are secure
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows iframes only from trusted domains (Facebook, YouTube, Vimeo, etc.).
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "loading",
    ],
  });
}
