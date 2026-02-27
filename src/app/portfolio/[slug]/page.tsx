import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { PortfolioItem, WordPressFeaturedMedia } from "@/types";
import { getBlogPostImage } from "@/utils";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { JsonLd } from "@/components/JsonLd";
import { generateCreativeWorkSchema } from "@/lib/seo";
import { PORTFOLIO_CATEGORIES, PortfolioCategory } from "@/types/portfolio";
import { notFound } from "next/navigation";

// Map WordPress category IDs to our portfolio category types
function mapCategoryId(categoryId: number): PortfolioCategory {
  const categoryMap: Record<number, PortfolioCategory> = {
    23: "video-editing",
    24: "videography",
    25: "exhibition",
    26: "photography",
    27: "print",
    28: "graphic-design",
    29: "website",
    30: "campaign",
    31: "producer",
  };
  return categoryMap[categoryId] || "photography";
}

async function getPortfolio(slug: string): Promise<PortfolioItem | null> {
  try {
    const portfolioResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.postsEndpoint}?slug=${slug}&_embed=true`,
      { next: { revalidate: 3600 } }
    );

    if (!portfolioResponse.ok) return null;

    const portfolioData = await portfolioResponse.json();
    if (portfolioData.length === 0) return null;

    const post = portfolioData[0];

    // Map category from portfolio_category IDs
    const categoryId = post.portfolio_category?.[0];
    const category = categoryId ? mapCategoryId(categoryId) : "photography";

    // Extract featured image from embedded data
    let featured_image = undefined;
    const embedded = post._embedded;
    if (embedded?.["wp:featuredmedia"]?.[0]) {
      const media = embedded["wp:featuredmedia"][0];
      featured_image = {
        id: String(media.id),
        url: media.source_url,
        alt: media.alt_text || post.title.rendered,
        type: "image" as const,
        sizes: media.media_details?.sizes ? {
          thumbnail: media.media_details.sizes.thumbnail?.source_url,
          medium: media.media_details.sizes.medium?.source_url,
          large: media.media_details.sizes.large?.source_url,
          full: media.source_url,
        } : undefined,
      };
    }

    return {
      ...post,
      category,
      featured_image,
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}

async function getFeaturedImage(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const mediaResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}/media/${mediaId}`,
      { next: { revalidate: 3600 } }
    );
    if (mediaResponse.ok) {
      const media: WordPressFeaturedMedia = await mediaResponse.json();
      return media.media_details?.sizes?.large?.source_url || media.source_url;
    }
  } catch (error) {
    console.warn("Failed to fetch featured media:", error);
  }
  return null;
}

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    return {
      title: "Portfolio Not Found",
      description: "The requested portfolio item could not be found.",
    };
  }

  let featuredImageUrl = await getFeaturedImage(portfolio.featured_media);

  // Fallback to first image in content if no featured image
  if (!featuredImageUrl) {
    featuredImageUrl = getBlogPostImage(null, portfolio.content.rendered);
  }

  const description = portfolio.excerpt?.rendered
    ? portfolio.excerpt.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 160)
    : portfolio.content?.rendered
    ? portfolio.content.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 160)
    : portfolio.title.rendered;

  const portfolioUrl = `${siteConfig.url}/portfolio/${portfolio.slug}`;

  return {
    title: portfolio.title.rendered,
    description,
    openGraph: {
      title: portfolio.title.rendered,
      url: portfolioUrl,
      siteName: siteConfig.titleTh,
      images: featuredImageUrl
        ? [
            {
              url: featuredImageUrl,
              width: 1200,
              height: 630,
              alt: portfolio.title.rendered,
            },
          ]
        : [
            {
              url: `${siteConfig.url}/portfolio/${portfolio.slug}/opengraph-image`,
              width: 1200,
              height: 630,
              alt: portfolio.title.rendered,
            },
          ],
      locale: "th_TH",
      type: "article",
      publishedTime: portfolio.date,
      modifiedTime: portfolio.modified,
      authors: [siteConfig.author],
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.title.rendered,
      images: featuredImageUrl
        ? [featuredImageUrl]
        : [`${siteConfig.url}/portfolio/${portfolio.slug}/opengraph-image`],
    },
    alternates: {
      canonical: portfolioUrl,
    },
  };
}

// Server component
export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  const featuredImageUrl = await getFeaturedImage(portfolio.featured_media);
  
  const description = portfolio.excerpt?.rendered
    ? portfolio.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160)
    : `ผลงาน${PORTFOLIO_CATEGORIES[portfolio.category]} โดย วิศรุต แสนคำ`;

  const jsonLd = generateCreativeWorkSchema({
    title: portfolio.title.rendered,
    description: description,
    image: featuredImageUrl || `${siteConfig.url}/placeholder-image.jpg`,
    dateCreated: portfolio.date,
    category: PORTFOLIO_CATEGORIES[portfolio.category],
    url: `${siteConfig.url}/portfolio/${portfolio.slug}`,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <PortfolioDetailClient slug={slug} initialData={portfolio} />
    </>
  );
}
