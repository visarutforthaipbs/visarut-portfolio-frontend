import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { PortfolioItem, WordPressFeaturedMedia } from "@/types";
import { getBlogPostImage } from "@/utils";
import PortfolioDetailClient from "./PortfolioDetailClient";

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    // Fetch portfolio item data
    const portfolioResponse = await fetch(
      `${siteConfig.api.wordpress.baseUrl}${siteConfig.api.wordpress.postsEndpoint}?slug=${resolvedParams.slug}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!portfolioResponse.ok) {
      console.error(
        `Failed to fetch portfolio: ${portfolioResponse.status} ${portfolioResponse.statusText}`
      );
      return {
        title: "Portfolio Not Found",
        description: "The requested portfolio item could not be found.",
      };
    }

    const portfolioData = await portfolioResponse.json();
    if (portfolioData.length === 0) {
      console.error(`No portfolio found for slug: ${resolvedParams.slug}`);
      return {
        title: "Portfolio Not Found",
        description: "The requested portfolio item could not be found.",
      };
    }

    const portfolio: PortfolioItem = portfolioData[0];
    console.log(
      `Generating metadata for portfolio: ${portfolio.title.rendered}, Featured media ID: ${portfolio.featured_media}`
    );

    // Get featured image
    let featuredImageUrl = null;
    if (portfolio.featured_media) {
      try {
        const mediaResponse = await fetch(
          `${siteConfig.api.wordpress.baseUrl}/media/${portfolio.featured_media}`,
          { next: { revalidate: 3600 } }
        );
        if (mediaResponse.ok) {
          const media: WordPressFeaturedMedia = await mediaResponse.json();
          // Use large size for better social sharing, fallback to source_url
          featuredImageUrl =
            media.media_details?.sizes?.large?.source_url || media.source_url;
          console.log(`Featured image URL: ${featuredImageUrl}`);
        } else {
          console.error(
            `Failed to fetch media: ${mediaResponse.status} ${mediaResponse.statusText}`
          );
        }
      } catch (error) {
        console.warn("Failed to fetch featured media:", error);
      }
    } else {
      console.log("No featured media ID found for portfolio");
    }

    // Fallback to first image in content if no featured image
    if (!featuredImageUrl) {
      featuredImageUrl = getBlogPostImage(null, portfolio.content.rendered);
    }

    // Clean excerpt for description - portfolio items might not have excerpts
    const description = portfolio.excerpt?.rendered
      ? portfolio.excerpt.rendered
          .replace(/<[^>]*>/g, "") // Strip HTML
          .trim()
          .slice(0, 160)
      : portfolio.content?.rendered
      ? portfolio.content.rendered
          .replace(/<[^>]*>/g, "") // Strip HTML
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
                url: `${siteConfig.url}/portfolio/${portfolio.slug}/opengraph-image`, // Portfolio-specific OG image
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
  } catch (error) {
    console.error("Error generating portfolio metadata:", error);
    return {
      title: "Portfolio",
      description: "Portfolio work from Visarut Sankham",
    };
  }
}

// Server component that renders the client component
export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // We can optionally pre-fetch data here for better performance
  // For now, we'll let the client component handle the data fetching
  return <PortfolioDetailClient slug={resolvedParams.slug} />;
}
