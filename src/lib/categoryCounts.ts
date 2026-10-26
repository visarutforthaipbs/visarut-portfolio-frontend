import { wpApiUrl } from "@/lib/config";

/**
 * Item count per portfolio category slug, from WP term counts.
 * Returns null on failure so callers fail OPEN (keep pages indexable).
 * Used to noindex + drop empty categories from the sitemap (UX-012); a category
 * becomes indexable again automatically once it has a published item.
 */
export async function getCategoryCounts(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(
      wpApiUrl("/portfolio_category", "per_page=100&_fields=slug,count"),
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const terms: { slug: string; count: number }[] = await res.json();
    return Object.fromEntries(terms.map((t) => [t.slug, t.count]));
  } catch {
    return null;
  }
}
