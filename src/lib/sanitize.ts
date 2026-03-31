import DOMPurify from "isomorphic-dompurify";

/** Trusted iframe host allowlist */
const TRUSTED_IFRAME_HOSTS = [
  "www.facebook.com",
  "www.youtube.com",
  "youtube.com",
  "player.vimeo.com",
  "open.spotify.com",
  "www.google.com",
  "docs.google.com",
];

function isTrustedIframeSrc(src: string): boolean {
  try {
    const url = new URL(src);
    return TRUSTED_IFRAME_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

// Configure DOMPurify to allow iframes from trusted sources
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const el = node as Element;
    const src = el.getAttribute?.("src") || "";
    if (!isTrustedIframeSrc(src)) {
      el.remove();
    }
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
