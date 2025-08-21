"use client";

import Head from "next/head";
import type { PortfolioItem } from "@/types/portfolio";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";

interface PortfolioSEOProps {
  portfolio: PortfolioItem;
}

export function PortfolioSEO({ portfolio }: PortfolioSEOProps) {
  const title = `${portfolio.title.rendered} | วิศรุต แสนคำ - Portfolio`;
  const description = portfolio.excerpt?.rendered
    ? portfolio.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160)
    : `ผลงาน${PORTFOLIO_CATEGORIES[portfolio.category]} โดย วิศรุต แสนคำ`;
  const image = portfolio.featured_image?.url || "/placeholder-image.svg";
  const url = `https://visarutsankham.com/portfolio/${portfolio.slug}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="วิศรุต แสนคำ" />
      <meta
        name="keywords"
        content={`${
          PORTFOLIO_CATEGORIES[portfolio.category]
        }, วิศรุต แสนคำ, ผลงาน, portfolio`}
      />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="วิศรุต แสนคำ - Portfolio" />
      <meta property="article:author" content="วิศรุต แสนคำ" />
      <meta property="article:published_time" content={portfolio.date} />
      <meta
        property="article:section"
        content={PORTFOLIO_CATEGORIES[portfolio.category]}
      />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: portfolio.title.rendered,
            description: description,
            image: image,
            url: url,
            author: {
              "@type": "Person",
              name: "วิศรุต แสนคำ",
            },
            datePublished: portfolio.date,
            category: PORTFOLIO_CATEGORIES[portfolio.category],
            inLanguage: "th-TH",
          }),
        }}
      />
    </Head>
  );
}

export default PortfolioSEO;
