import DOMPurify from "isomorphic-dompurify";
import type { PortfolioItem } from "@/types/portfolio";
import { formatDate } from "@/utils";

export type DetailImage = {
  kind: "image";
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  /** WP-generated responsive candidates ("url 720w, url 1024w, …") — lets phones load a smaller file. */
  srcSet?: string;
};
export type DetailEmbed = { kind: "embed"; src: string; title: string };
export type DetailMedia = DetailImage | DetailEmbed;

export type ExternalLink = { url: string; label: string; host: string; kind: "video" | "social" | "website" };

function imageKey(src: string): string {
  try {
    const url = new URL(src, "https://api.sankham.cv");
    return `${url.host}${url.pathname.replace(/-\d+x\d+(?=\.[^.]+$)/, "")}`;
  } catch {
    return src;
  }
}

function parseContent(html: string) {
  return DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder"],
  });
}

const normText = (s: string) => s.replace(/\s+/g, "").normalize("NFC");
const num = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : undefined);

/** YouTube / Vimeo page URL → privacy-friendly embed URL. */
export function toEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host.endsWith("youtube.com")) {
      id = u.searchParams.get("v") || u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || null;
    }
    if (id) return `https://www.youtube-nocookie.com/embed/${id.split(/[?&/]/)[0]}?rel=0`;
    const vimeo = host === "vimeo.com" && u.pathname.match(/^\/(\d+)/)?.[1];
    if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  } catch {
    /* not a URL */
  }
  return null;
}

export function describeExternalLink(raw?: string): ExternalLink | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    if (/youtu\.?be|vimeo\.com/.test(host)) return { url: raw, label: "ดูวิดีโอ", host, kind: "video" };
    if (/facebook\.com|fb\.watch|instagram\.com|x\.com|twitter\.com|tiktok\.com/.test(host))
      return { url: raw, label: "ดูโพสต์ต้นฉบับ", host, kind: "social" };
    return { url: raw, label: "เยี่ยมชมเว็บไซต์", host, kind: "website" };
  } catch {
    return null;
  }
}

const TH_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

/**
 * ACF dates arrive as `YYYYMMDD`, ISO, or free Thai text. Use the same
 * formatter as the portfolio cards so card and page agree (Buddhist era).
 */
export function formatProjectDate(value?: string, fallbackIso?: string): string | null {
  const v = (value || "").trim();
  if (v) return formatDate(v) || v;
  if (fallbackIso) {
    const d = new Date(fallbackIso);
    if (!Number.isNaN(d.getTime())) return `${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
  }
  return null;
}

/** Keep only well-formed `https://… NNNw` candidates (WP srcset), else undefined. */
function cleanSrcSet(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter((p) => /^https:\/\/\S+\s+\d+w$/.test(p));
  return parts.length > 1 ? parts.join(", ") : undefined;
}

function imageFrom(img: Element, caption?: string): DetailImage | null {
  const url = img.getAttribute("src");
  if (!url) return null;
  return {
    kind: "image",
    url,
    alt: img.getAttribute("alt") || "",
    width: num(img.getAttribute("width")),
    height: num(img.getAttribute("height")),
    caption: caption || undefined,
    srcSet: cleanSrcSet(img.getAttribute("srcset")),
  };
}

/**
 * Split WordPress block HTML into reading text and media.
 * The site is headless (no core block CSS), so galleries/figures are re-laid-out by the frontend.
 */
function splitContent(fragment: DocumentFragment) {
  const text: string[] = [];
  const media: DetailMedia[] = [];

  const takeMedia = (el: Element) => {
    if (el.tagName === "IFRAME") {
      const src = el.getAttribute("src");
      if (src) media.push({ kind: "embed", src, title: el.getAttribute("title") || "วิดีโอ" });
      return;
    }
    const iframe = el.querySelector("iframe");
    if (iframe) return takeMedia(iframe);
    if (el.classList.contains("wp-block-embed")) {
      const src = toEmbedUrl(el.textContent?.trim());
      if (src) media.push({ kind: "embed", src, title: "วิดีโอ" });
      return;
    }
    const figures = el.matches("figure.wp-block-image") ? [el] : Array.from(el.querySelectorAll("figure.wp-block-image"));
    if (figures.length) {
      for (const f of figures) {
        const img = f.querySelector("img");
        const item = img && imageFrom(img, f.querySelector("figcaption")?.textContent?.trim());
        if (item) media.push(item);
      }
      return;
    }
    for (const img of Array.from(el.tagName === "IMG" ? [el] : el.querySelectorAll("img"))) {
      const item = imageFrom(img);
      if (item) media.push(item);
    }
  };

  for (const node of Array.from(fragment.childNodes)) {
    if (node.nodeType === 3) {
      if (node.textContent?.trim()) text.push(`<p>${node.textContent.trim()}</p>`);
      continue;
    }
    if (node.nodeType !== 1) continue;
    const el = node as Element;
    const isMedia =
      ["FIGURE", "IMG", "IFRAME", "VIDEO"].includes(el.tagName) ||
      el.classList.contains("wp-block-gallery") ||
      el.classList.contains("wp-block-embed") ||
      (!normText(el.textContent || "") && !!el.querySelector("img, iframe"));
    if (isMedia) {
      takeMedia(el);
      continue;
    }
    // Paragraph that also contains images: keep the words, lift the images out.
    for (const img of Array.from(el.querySelectorAll("img"))) {
      const item = imageFrom(img);
      if (item) media.push(item);
      img.remove();
    }
    if (!normText(el.textContent || "")) continue;
    text.push((el as HTMLElement).outerHTML);
  }
  // The page title is the only <h1>; headings authored as H1 in WordPress become section headings.
  const textHtml = text.join("\n").replace(/<(\/?)h1(\b[^>]*)>/gi, "<$1h2$2>");
  return { textHtml, media };
}

export function preparePortfolioDetail(portfolio: PortfolioItem) {
  const content = portfolio.content?.rendered || "";
  const fragment = parseContent(content);
  const hasBody = Boolean(fragment.textContent?.trim() || fragment.querySelector("img, iframe, video, audio"));
  const body = hasBody ? content : portfolio.excerpt?.rendered || "";
  const bodyFragment = hasBody ? fragment : parseContent(body);
  const { textHtml, media: inlineMedia } = splitContent(bodyFragment);
  const bodyText = normText(parseContent(textHtml).textContent || "");
  const acf = { ...portfolio.acf } as Record<string, unknown>;

  // Lead summary = ACF description, unless the article already says it.
  const description = typeof acf.project_description === "string" ? acf.project_description.trim() : "";
  const descPlain = description ? (parseContent(description).textContent || "").trim() : "";
  const lead = descPlain && !bodyText.includes(normText(descPlain)) ? descPlain : "";

  const externalUrl = (acf.external_url || acf.website_url || acf.video_url || acf.video_link) as string | undefined;
  const heroEmbed = toEmbedUrl(externalUrl);

  // Images: featured as hero (unless a video leads or the article already shows it), then article media, then extra media — deduped.
  const seen = new Set<string>();
  const media: DetailMedia[] = [];
  const pushImage = (img: DetailImage) => {
    const key = imageKey(img.url);
    if (seen.has(key)) return;
    seen.add(key);
    media.push(img);
  };
  const featured = portfolio.featured_image;
  const inlineKeys = new Set(
    inlineMedia.filter((m): m is DetailImage => m.kind === "image").map((m) => imageKey(m.url))
  );
  let heroImage: DetailImage | null = null;
  if (featured?.url && !heroEmbed && !inlineKeys.has(imageKey(featured.url))) {
    heroImage = { kind: "image", url: featured.url, alt: featured.alt || portfolio.title.rendered, width: featured.width, height: featured.height };
  }
  if (featured?.url && (heroImage || inlineKeys.has(imageKey(featured.url)))) seen.add(imageKey(featured.url));
  for (const m of inlineMedia) {
    if (m.kind === "embed") {
      if (heroEmbed && m.src.split("?")[0] === heroEmbed.split("?")[0]) continue;
      media.push(m);
    } else pushImage(m);
  }
  for (const item of portfolio.media || []) {
    if (item.type === "image" && item.url) pushImage({ kind: "image", url: item.url, alt: item.alt || "" });
  }

  return {
    lead,
    textHtml,
    media,
    heroEmbed,
    heroImage,
    link: describeExternalLink(externalUrl),
    client: typeof acf.client_name === "string" && acf.client_name ? acf.client_name : (acf.client as string | undefined),
    date: formatProjectDate(acf.project_date as string | undefined, portfolio.date),
  };
}

export type PortfolioDetailView = ReturnType<typeof preparePortfolioDetail>;
