"use client";

import { siteConfig } from "@/lib/config";
import type { PortfolioItem } from "@/types/portfolio";

interface JsonLdProps {
  items?: PortfolioItem[];
  data?: Record<string, unknown>;
}

export function JsonLd({ items = [], data }: JsonLdProps) {
  // If custom raw data object is passed from legacy pages, render it directly
  if (data) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }

  // 1. Person Schema (Visarut Sankham)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: "วิศรุต แสนคำ",
    alternateName: "Visarut Sankham",
    url: siteConfig.url,
    image: "https://api.sankham.cv/wp-content/uploads/2025/08/visarut-profile.jpg",
    jobTitle: "ผู้ผลิตสื่ออิสระ (Independent Media Producer & Visual Storyteller)",
    description:
      "ผู้ผลิตสื่ออิสระ ช่างภาพสารคดี ผู้กำกับภาพวิดีโอ และนักพัฒนาเว็บสื่อสังคม รังสรรค์งานภาพถ่ายสารคดี วิดีโอเชิงประเด็น เว็บไซต์อินเทอร์แอคทีฟ และสื่อแคมเปญขับเคลื่อนสังคม",
    email: "mailto:visarut298@gmail.com",
    telephone: "+66627283058",
    address: {
      "@type": "PostalAddress",
      addressLocality: "เชียงใหม่",
      addressRegion: "เชียงใหม่",
      addressCountry: "TH",
    },
    sameAs: [
      "https://facebook.com/visarut.sankham",
      "https://instagram.com/visarutsankham",
      "https://github.com/visarutforthaipbs",
    ],
    knowsAbout: [
      "Documentary Photography",
      "Video Production",
      "Visual Journalism",
      "Web Development",
      "Graphic Design",
      "Social Impact Campaigns",
      "Media Production",
    ],
  };

  // 2. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: "วิศรุต แสนคำ | ผู้ผลิตสื่ออิสระ (Portfolio Catalog)",
    description: siteConfig.descriptionTh,
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
    inLanguage: "th-TH",
  };

  // 3. CollectionPage / ItemList Schema for AI Search indexing
  const itemListSchema =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "คลังผลงานมัลติมีเดีย - วิศรุต แสนคำ",
          itemListElement: items.slice(0, 15).map((item, index) => {
            const titleStr =
              typeof item.title === "string"
                ? item.title
                : item.title?.rendered || "";
            const cleanTitle = titleStr.replace(/<[^>]*>/g, "");

            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "CreativeWork",
                name: cleanTitle,
                genre: item.category,
                datePublished: item.date,
                author: {
                  "@id": `${siteConfig.url}/#person`,
                },
              },
            };
          }),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
    </>
  );
}

export default JsonLd;
