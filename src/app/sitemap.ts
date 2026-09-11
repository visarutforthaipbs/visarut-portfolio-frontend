import { MetadataRoute } from "next";
import { siteConfig, wpApiUrl, CATEGORY_IDS } from "@/lib/config";
import type { PortfolioItem } from "@/types";
import type { BlogPost } from "@/types/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticLastMod = new Date("2025-01-01T00:00:00.000Z");

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: staticLastMod,
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
      lastModified: staticLastMod,
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
      lastModified: staticLastMod,
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

  // Fetch portfolio items
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const portfolioResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.postsEndpoint, `per_page=100`),
      { next: { revalidate: 3600 } }
    );
    if (portfolioResponse.ok) {
      const portfolios: PortfolioItem[] = await portfolioResponse.json();
      portfolioPages = portfolios.map((item) => ({
        url: `${baseUrl}/portfolio/${item.slug}`,
        lastModified: new Date(item.modified),
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
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    }
  } catch (error) {
    console.error("Sitemap: Error fetching blog posts:", error);
  }

  // All 13 portfolio categories from single source of truth
  const portfolioCategories = Object.keys(CATEGORY_IDS);

  const categoryPages = portfolioCategories.map((category) => ({
    url: `${baseUrl}/portfolio/category/${category}`,
    lastModified: staticLastMod,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...portfolioPages, ...blogPages, ...categoryPages];
}
