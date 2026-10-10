import { siteConfig } from "@/lib/config";
import type { PortfolioItem } from "@/types/portfolio";

interface JsonLdProps {
  items?: PortfolioItem[];
  data?: Record<string, unknown>;
}

function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export function JsonLd({ items = [], data }: JsonLdProps) {
  // If custom raw data object is passed from legacy pages, render it directly
  if (data) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
      />
    );
  }

  // Person / WebSite / Organization are emitted once by src/app/page.tsx (lib/seo.ts).
  // This component only adds the portfolio ItemList, linked by @id.
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
                url: `${siteConfig.url}/portfolio/${item.slug}`,
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
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }}
        />
      )}
    </>
  );
}

export default JsonLd;
