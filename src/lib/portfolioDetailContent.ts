import DOMPurify from "isomorphic-dompurify";
import type { PortfolioItem } from "@/types/portfolio";

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
  });
}

export function preparePortfolioDetail(portfolio: PortfolioItem) {
  const content = portfolio.content?.rendered || "";
  const fragment = parseContent(content);
  const hasBody = Boolean(fragment.textContent?.trim() || fragment.querySelector("img, iframe, video, audio"));
  const body = hasBody ? content : portfolio.excerpt?.rendered || "";
  const bodyFragment = hasBody ? fragment : parseContent(body);
  const bodyText = (bodyFragment.textContent || "").replace(/\s+/g, "").normalize("NFC");
  const acf = { ...portfolio.acf };

  // Keep distinct project notes, but do not repeat descriptions already in the article.
  for (const key of ["project_description", "design_concept", "printing_process", "campaign_objectives"]) {
    const value = (acf as Record<string, unknown>)[key];
    if (typeof value !== "string") continue;
    const text = (parseContent(value).textContent || "").replace(/\s+/g, "").normalize("NFC");
    if (text && bodyText.includes(text)) delete (acf as Record<string, unknown>)[key];
  }

  const seen = new Set(Array.from(bodyFragment.querySelectorAll("img[src]"), img => imageKey(img.getAttribute("src")!)));
  const featured = portfolio.featured_image;
  const showFeatured = Boolean(featured && !seen.has(imageKey(featured.url)));
  if (featured) seen.add(imageKey(featured.url));
  const media = portfolio.media?.filter(item => {
    if (item.type !== "image" || !item.url) return false;
    const key = imageKey(item.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    body,
    showFeatured,
    details: { ...portfolio, acf },
    gallery: { ...portfolio, featured_image: undefined, media },
  };
}
