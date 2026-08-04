"use client";

import { Eye, ExternalLink, Calendar, Building2, ChevronRight } from "lucide-react";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem, ImageMedia } from "@/types/portfolio";
import { WordPressAPI } from "@/lib/wordpress";

interface MarketplaceGridProps {
  items: PortfolioItem[];
  viewMode: "grid" | "list";
  onQuickView: (item: PortfolioItem) => void;
  isLoading?: boolean;
}

export function MarketplaceGrid({
  items,
  viewMode,
  onQuickView,
  isLoading = false,
}: MarketplaceGridProps) {
  const getFeaturedImageUrl = (
    image: string | ImageMedia | undefined
  ): string => {
    if (!image) return "/placeholder-image.svg";
    if (typeof image === "string") return image;
    return image.url || "/placeholder-image.svg";
  };

  const getCleanTitle = (title: { rendered: string } | string): string => {
    const raw = typeof title === "string" ? title : title.rendered;
    return raw.replace(/<[^>]*>/g, "");
  };

  const getCleanExcerpt = (excerpt?: { rendered: string } | string): string => {
    if (!excerpt) return "";
    const raw = typeof excerpt === "string" ? excerpt : excerpt.rendered;
    return raw.replace(/<[^>]*>/g, "").trim();
  };

  if (isLoading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full"
            : "flex flex-col gap-4 w-full"
        }
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-surface/60 border border-edge/60 rounded-2xl overflow-hidden flex flex-col justify-between h-72"
          >
            <div className="w-full aspect-4/3 bg-surface-hover/80" />
            <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <div className="w-20 h-3 bg-surface-hover rounded-full" />
                <div className="w-4/5 h-4 bg-surface-hover rounded-md" />
                <div className="w-2/3 h-3 bg-surface-hover rounded-md" />
              </div>
              <div className="pt-3 border-t border-edge/40 flex justify-between">
                <div className="w-16 h-3 bg-surface-hover rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full text-center py-16 bg-surface/30 rounded-2xl border border-edge/60">
        <p className="text-sm text-dim">ไม่พบผลงานที่ตรงกับตัวกรองที่เลือก</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3.5 w-full">
        {items.map((item) => {
          const normalized = WordPressAPI.normalizePortfolio(item);
          const categoryLabel =
            PORTFOLIO_CATEGORIES[item.category] || item.category;
          const cleanTitle = getCleanTitle(item.title);
          const cleanExcerpt = getCleanExcerpt(item.excerpt);

          return (
            <article
              key={item.id}
              onClick={() => onQuickView(item)}
              className="group relative bg-surface/40 hover:bg-surface/90 border border-edge/60 hover:border-accent/40 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
            >
              {/* Thumbnail + Text */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface shrink-0 border border-edge/40">
                  <img
                    src={getFeaturedImageUrl(item.featured_image)}
                    alt={cleanTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                      {categoryLabel}
                    </span>
                    {normalized.meta.clientName && (
                      <span className="text-[11px] font-medium text-dim bg-surface px-2 py-0.5 rounded-full border border-edge">
                        {normalized.meta.clientName}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[11px] text-dim">
                        • {new Date(item.date).getFullYear() + 543}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-content leading-snug truncate group-hover:text-accent transition-colors">
                    {cleanTitle}
                  </h3>
                  {cleanExcerpt && (
                    <p className="text-xs text-muted line-clamp-1">
                      {cleanExcerpt}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick View Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base group-hover:bg-accent group-hover:text-white border border-edge group-hover:border-accent rounded-xl text-xs font-semibold text-content transition-all">
                  <Eye size={14} />
                  <span>ดูรายละเอียด</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
      {items.map((item) => {
        const normalized = WordPressAPI.normalizePortfolio(item);
        const categoryLabel =
          PORTFOLIO_CATEGORIES[item.category] || item.category;
        const cleanTitle = getCleanTitle(item.title);
        const cleanExcerpt = getCleanExcerpt(item.excerpt);

        return (
          <article
            key={item.id}
            onClick={() => onQuickView(item)}
            className="group relative bg-surface/40 hover:bg-surface/90 border border-edge/60 hover:border-accent/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full bg-surface overflow-hidden">
              <img
                src={getFeaturedImageUrl(item.featured_image)}
                alt={cleanTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                }}
              />

              {/* Overlay Category & Client Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-full uppercase tracking-wider border border-white/10 shadow-xs">
                  {categoryLabel}
                </span>
                {normalized.meta.clientName && (
                  <span className="px-2.5 py-1 bg-accent/90 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/10 shadow-xs truncate max-w-[130px]">
                    {normalized.meta.clientName}
                  </span>
                )}
              </div>

              {/* Hover Quick View overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                  <Eye size={14} />
                  <span>ดูรายละเอียดผลงาน</span>
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
              <div className="flex flex-col gap-1.5">
                {normalized.date && (
                  <span className="text-[11px] text-dim flex items-center gap-1">
                    <Calendar size={12} />
                    {normalized.date}
                  </span>
                )}
                <h3 className="text-base font-bold text-content leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {cleanTitle}
                </h3>
                {cleanExcerpt && (
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {cleanExcerpt}
                  </p>
                )}
              </div>

              {/* Bottom Card Footer Action */}
              <div className="pt-3 border-t border-edge/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-accent group-hover:underline flex items-center gap-1">
                  <span>ดูรายละเอียด</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
