"use client";

import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";

interface PortfolioPreviewProps {
  maxItems?: number;
}

export function PortfolioPreview({ maxItems = 6 }: PortfolioPreviewProps) {
  const { portfolios, loading, error } = usePortfolios({
    per_page: maxItems,
  });

  if (error) {
    return (
      <div className="py-8 text-center" role="alert">
        <div className="flex items-center gap-2 justify-center text-dim">
          <AlertCircle size={16} aria-hidden="true" />
          <span className="text-sm">เกิดข้อผิดพลาดในการโหลดผลงาน</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10 items-center w-full" aria-label="ผลงานล่าสุด" role="region">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-dim uppercase tracking-wider text-center">
        ผลงานล่าสุด
      </h2>

      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 w-full">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <div className="h-[200px] md:h-[220px] animate-pulse bg-surface rounded-md" />
              <div className="flex flex-col gap-2 items-start mt-3">
                <div className="h-3.5 w-2/5 animate-pulse bg-surface rounded" />
                <div className="h-4 w-[70%] animate-pulse bg-surface rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : portfolios.length > 0 ? (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 w-full">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>

          <Link href="/portfolio" aria-label="ดูผลงานทั้งหมด">
            <span className="flex items-center gap-2 text-content font-medium text-sm hover:gap-3 transition-all duration-200 cursor-pointer">
              <span>ดูผลงานทั้งหมด</span>
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </>
      ) : (
        <div className="text-center py-12">
          <span className="text-sm text-dim">
            ยังไม่มีผลงานที่จะแสดง
          </span>
        </div>
      )}
    </div>
  );
}

interface PortfolioCardProps {
  portfolio: PortfolioItem;
}

function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const categoryLabel =
    PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category;

  const getFeaturedImageUrl = (
    image: string | ImageMedia | undefined
  ): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  const getTextContent = (content: { rendered: string } | string): string => {
    if (typeof content === "string") return content;
    return content.rendered || "";
  };

  return (
    <Link href={`/portfolio/${portfolio.slug}`} aria-label={getTextContent(portfolio.title)}>
      <article className="cursor-pointer group break-inside-avoid mb-4">
        <div className="overflow-hidden rounded-md bg-surface">
          <img
            src={getFeaturedImageUrl(portfolio.featured_image)}
            alt={getTextContent(portfolio.title)}
            className="w-full h-auto block object-cover transition-opacity duration-200 group-hover:opacity-85"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
          />
        </div>

        <div className="flex flex-col items-start gap-1 mt-3">
          <span className="text-xs text-dim uppercase tracking-wider">
            {categoryLabel}
          </span>
          <h3 className="text-lg md:text-xl font-medium text-content leading-[1.2] line-clamp-2">
            {getTextContent(portfolio.title)}
          </h3>
        </div>
      </article>
    </Link>
  );
}
