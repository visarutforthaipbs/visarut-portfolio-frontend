import type { Metadata } from "next";
import { siteConfig, wpApiUrl } from "@/lib/config";
import type { PortfolioItem, WordPressFeaturedMedia } from "@/types";
import { getBlogPostImage, decodeHtmlEntities } from "@/utils";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { JsonLd } from "@/components/JsonLd";
import { generateCreativeWorkSchema } from "@/lib/seo";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";
import { notFound } from "next/navigation";

async function getPortfolio(slug: string): Promise<PortfolioItem | null> {
  try {
    const portfolioResponse = await fetch(
      wpApiUrl(siteConfig.api.wordpress.postsEndpoint, `slug=${slug}&_embed=true`),
      { next: { revalidate: 3600 } }
    );

    if (!portfolioResponse.ok) return null;

    const portfolioData = await portfolioResponse.json();
    if (portfolioData.length === 0) return null;

    return WordPressAPI.transformPortfolioPost(portfolioData[0]);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
}

async function getFeaturedImage(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const mediaResponse = await fetch(
      wpApiUrl(`/media/${mediaId}`),
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

  const cleanTitle = decodeHtmlEntities(portfolio.title.rendered);

  const description = portfolio.excerpt?.rendered
    ? decodeHtmlEntities(
        portfolio.excerpt.rendered
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 160)
      )
    : portfolio.content?.rendered
    ? decodeHtmlEntities(
        portfolio.content.rendered
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 160)
      )
    : cleanTitle;

  const portfolioUrl = `${siteConfig.url}/portfolio/${portfolio.slug}`;

  return {
    title: cleanTitle,
    description,
    openGraph: {
      title: cleanTitle,
      url: portfolioUrl,
      siteName: siteConfig.titleTh,
      images: featuredImageUrl
        ? [
            {
              url: featuredImageUrl,
              width: 1200,
              height: 630,
              alt: cleanTitle,
            },
          ]
        : [
            {
              url: `${siteConfig.url}/portfolio/${portfolio.slug}/opengraph-image`,
              width: 1200,
              height: 630,
              alt: cleanTitle,
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
      title: cleanTitle,
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
  
  const pageTitle = decodeHtmlEntities(portfolio.title.rendered);
  const description = portfolio.excerpt?.rendered
    ? decodeHtmlEntities(portfolio.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160))
    : `ผลงาน${PORTFOLIO_CATEGORIES[portfolio.category]} โดย วิศรุต แสนคำ`;

  const jsonLd = generateCreativeWorkSchema({
    title: pageTitle,
    description: description,
    image: featuredImageUrl || `${siteConfig.url}/placeholder-image.jpg`,
    dateCreated: portfolio.date,
    category: PORTFOLIO_CATEGORIES[portfolio.category],
    url: `${siteConfig.url}/portfolio/${portfolio.slug}`,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "หน้าแรก",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ผลงาน",
        item: `${siteConfig.url}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: PORTFOLIO_CATEGORIES[portfolio.category],
        item: `${siteConfig.url}/portfolio/category/${portfolio.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: portfolio.title.rendered,
        item: `${siteConfig.url}/portfolio/${portfolio.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PortfolioDetailClient slug={slug} initialData={portfolio} />
    </>
  );
}
