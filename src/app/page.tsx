import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { JsonLd } from "@/components/JsonLd";
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import { siteConfig, wpApiUrl } from "@/lib/config";
import type { BlogPost, WordPressPost } from "@/types/wordpress";
import type { PortfolioItem } from "@/types/portfolio";

import { WordPressAPI } from "@/lib/wordpress";

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
    return posts.map((post: WordPressPost) => WordPressAPI.transformPortfolioPost(post));
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
