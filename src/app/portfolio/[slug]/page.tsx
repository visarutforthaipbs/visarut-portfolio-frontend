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

function stripText(htmlStr?: string): string {
  if (!htmlStr) return "";
  return decodeHtmlEntities(
    htmlStr
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\[[^\]]*\]/g, " ") // shortcodes / [&hellip;]
      .replace(/\s+/g, " ")
      .trim()
  );
}

function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

/**
 * Meta description: prefer a real excerpt; skip excerpts that are just the
 * title or an image caption ("Screenshot"); fall back to body text, then to
 * a category sentence.
 */
function buildDescription(portfolio: PortfolioItem, cleanTitle: string): string {
  const excerpt = stripText(portfolio.excerpt?.rendered);
  const isUseful = (t: string) =>
    t.length >= 50 && t !== cleanTitle && !/^screenshot/i.test(t);
  if (isUseful(excerpt)) return clip(excerpt);
  const body = stripText(portfolio.content?.rendered);
  if (isUseful(body)) return clip(body);
  const category = PORTFOLIO_CATEGORIES[portfolio.category] ?? "ผลงาน";
  return `${cleanTitle} — ผลงาน${category} โดย วิศรุต แสนคำ ผู้ผลิตสื่ออิสระ`;
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

  const description = buildDescription(portfolio, cleanTitle);

  const portfolioUrl = `${siteConfig.url}/portfolio/${portfolio.slug}`;

  return {
    title: cleanTitle,
    description,
    openGraph: {
      title: cleanTitle,
      description,
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
      description,
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
  const description = buildDescription(portfolio, pageTitle);

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
        name: pageTitle,
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
