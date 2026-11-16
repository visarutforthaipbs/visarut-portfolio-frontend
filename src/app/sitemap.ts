import { MetadataRoute } from "next";
import { siteConfig, wpApiUrl, CATEGORY_IDS } from "@/lib/config";
import { getCategoryCounts } from "@/lib/categoryCounts";
import type { PortfolioItem } from "@/types";
import type { BlogPost } from "@/types/wordpress";
import { wpUtcIso } from "@/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticLastMod = new Date("2025-01-01T00:00:00.000Z");

  // Hub pages list content that lives in WordPress, so their true lastmod is the newest
  // modified date of that content. Never invent freshness: a lastmod that is not real
  // teaches Google to ignore the sitemap's dates. null => keep the static fallback.
  const newest = (dates: Array<string | undefined>): Date | null => {
    const t = dates
      .map((d) => (d ? new Date(d).getTime() : NaN))
      .filter((n) => Number.isFinite(n));
    return t.length ? new Date(Math.max(...t)) : null;
  };
  let newestPortfolio: Date | null = null;
  let newestBlog: Date | null = null;

  // Fetch portfolio items
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const portfolioResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.postsEndpoint, `per_page=100`),
      { next: { revalidate: 3600 } }
    );
    if (portfolioResponse.ok) {
      const portfolios: PortfolioItem[] = await portfolioResponse.json();
      newestPortfolio = newest(portfolios.map((item) => wpUtcIso(item.modified_gmt, item.modified)));
      portfolioPages = portfolios.map((item) => ({
        url: `${baseUrl}/portfolio/${item.slug}`,
        lastModified: new Date(wpUtcIso(item.modified_gmt, item.modified) as string),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Error fetching portfolios:", error);
  }

  // Fetch blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, `per_page=100`),
      { next: { revalidate: 3600 } }
    );
    if (blogResponse.ok) {
      const posts: BlogPost[] = await blogResponse.json();
      newestBlog = newest(posts.map((post) => wpUtcIso(post.modified_gmt, post.modified)));
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(wpUtcIso(post.modified_gmt, post.modified) as string),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Error fetching blog posts:", error);
  }

  // Static pages (about / contact / personal-projects are hand-edited: no data source,
  // so they keep the fixed date instead of a fabricated one)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: newestPortfolio ?? staticLastMod, // home grid = portfolio items
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastMod,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: newestPortfolio ?? staticLastMod,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/personal-projects`,
      lastModified: staticLastMod,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: newestBlog ?? staticLastMod,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastMod,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // All 13 portfolio categories from single source of truth
  // UX-012: skip empty categories (they are noindex); fail open if WP is unreachable
  const counts = await getCategoryCounts();
  const portfolioCategories = Object.keys(CATEGORY_IDS).filter(
    (c) => !counts || (counts[c] ?? 0) > 0
  );

  const categoryPages = portfolioCategories.map((category) => ({
    url: `${baseUrl}/portfolio/category/${category}`,
    lastModified: staticLastMod,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...portfolioPages, ...blogPages, ...categoryPages];
}
