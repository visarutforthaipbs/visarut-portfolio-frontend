import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { JsonLd } from "@/components/JsonLd";
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import { siteConfig, wpApiUrl, categoryIdToSlug } from "@/lib/config";
import type { BlogPost } from "@/types/wordpress";
import type { PortfolioItem } from "@/types/portfolio";

export const metadata: Metadata = {
  // Use default metadata from layout or override if needed
};

async function getLatestBlogPosts(count = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      wpApiUrl(siteConfig.api.wordpress.blogPostsEndpoint, `per_page=${count}&orderby=date&order=desc&_embed=true`),
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedPortfolios(count = 4): Promise<PortfolioItem[]> {
  try {
    const res = await fetch(
      wpApiUrl(siteConfig.api.wordpress.postsEndpoint, `per_page=${count}&orderby=date&order=desc&_embed=true`),
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((post: Record<string, unknown>) => {
      const embedded = post._embedded as Record<string, unknown[]> | undefined;
      const featuredMedia = (embedded?.["wp:featuredmedia"] as Record<string, unknown>[])?.[0];
      const mediaDetails = featuredMedia?.media_details as Record<string, unknown> | undefined;
      const sizes = mediaDetails?.sizes as Record<string, Record<string, string>> | undefined;
      const categories = (post.portfolio_category as number[]) || [];
      const category = categories.length > 0 ? categoryIdToSlug(categories[0]) : "photography";

      return {
        ...post,
        category,
        featured_image: featuredMedia ? {
          id: String(featuredMedia.id),
          type: "image" as const,
          url: featuredMedia.source_url as string,
          alt: (featuredMedia.alt_text as string) || "",
          sizes: sizes ? {
            thumbnail: sizes.thumbnail?.source_url || "",
            medium: sizes.medium?.source_url || "",
            large: sizes.large?.source_url || "",
            full: sizes.full?.source_url || (featuredMedia.source_url as string),
          } : undefined,
        } : undefined,
      };
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [blogPosts, featuredPortfolios] = await Promise.all([
    getLatestBlogPosts(3),
    getFeaturedPortfolios(4),
  ]);

  return (
    <>
      {/* Structured Data injected on the server */}
      <JsonLd data={generatePersonSchema()} />
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebsiteSchema()} />
      
      <HomeClient initialBlogPosts={blogPosts} featuredPortfolios={featuredPortfolios} />
    </>
  );
}
