"use client";

import { Scissors, Play } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";
import { getPortfolioFeaturedImageUrl } from "@/utils";

interface VideoEditingLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function VideoEditingLayout({
  portfolios,
  loading,
}: VideoEditingLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="h-[200px] rounded-lg animate-pulse bg-surface" />
            <div className="flex flex-col gap-2 items-start mt-4">
              <div className="h-5 w-4/5 rounded animate-pulse bg-surface" />
              <div className="h-4 w-3/5 rounded animate-pulse bg-surface" />
              <div className="h-8 w-[100px] rounded animate-pulse bg-surface" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Video Editing Grid - Medium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="bg-surface rounded-lg overflow-hidden border border-edge hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="relative">
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface relative">
                <img
                  src={getPortfolioFeaturedImageUrl(portfolio)}
                  alt={portfolio.title.rendered}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                  }}
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 rounded-full p-3 hover:bg-black/80 transition-all duration-200">
                <Play className="w-6 h-6 text-white" fill="white" />
              </div>

              {/* Duration Badge */}
              {portfolio.acf && "duration" in portfolio.acf && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {String(portfolio.acf.duration)}
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3">
              <h3 className="text-base font-semibold text-content leading-[1.3]">
                {portfolio.title.rendered}
              </h3>

              {/* Software Tags */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-dim">ซอฟต์แวร์ที่ใช้:</span>
                <div className="flex flex-wrap gap-1">
                  {portfolio.acf &&
                    "software" in portfolio.acf &&
                    Array.isArray(portfolio.acf.software) &&
                    portfolio.acf.software.map((sw: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-surface-hover text-muted px-2 py-1 rounded"
                      >
                        {sw}
                      </span>
                    ))}
                </div>
              </div>

              {portfolio.excerpt && (
                <p className="text-sm text-muted leading-[1.5] line-clamp-2">
                  {portfolio.excerpt.rendered}
                </p>
              )}

              <Link
                href={`/portfolio/${portfolio.slug}`}
                className="inline-block text-center text-sm border border-accent text-accent px-4 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
              >
                ดูผลงาน
              </Link>
            </div>
          </div>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="flex flex-col gap-4 py-12 text-center items-center">
          <Scissors size={48} color="#CBD5E0" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-muted thai-text">
              ยังไม่มีผลงานตัดต่อวีดีโอ
            </h2>
            <p className="text-dim thai-text">
              ผลงานใหม่จะปรากฏที่นี่เร็วๆ นี้
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
