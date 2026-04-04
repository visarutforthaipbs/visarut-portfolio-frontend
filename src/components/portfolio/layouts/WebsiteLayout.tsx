import { Calendar, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface WebsiteLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function WebsiteLayout({ portfolios, loading }: WebsiteLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="h-[200px] rounded-lg animate-pulse bg-surface" />
            <div className="flex flex-col gap-2 items-start mt-4">
              <div className="h-5 w-4/5 rounded animate-pulse bg-surface" />
              <div className="h-4 w-3/5 rounded animate-pulse bg-surface" />
              <div className="h-8 w-[120px] rounded animate-pulse bg-surface" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Website Grid - Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="bg-surface rounded-lg overflow-hidden border border-edge hover:-translate-y-1 hover:border-accent transition-all duration-300"
          >
            <div className="relative">
              <div className="aspect-[16/10]">
                <img
                  src={portfolio.featured_image?.url || "/placeholder-website.jpg"}
                  alt={portfolio.title.rendered}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Website Badge */}
              <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                WEBSITE
              </span>
            </div>

            <div className="flex flex-col gap-4 p-5 items-start">
              <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-lg font-semibold text-content leading-[1.4] line-clamp-2">
                  {portfolio.title.rendered}
                </p>

                <div className="flex items-center gap-4 text-sm text-dim">
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    <span>เว็บไซต์</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(portfolio.date).getFullYear()}</span>
                  </span>
                </div>
              </div>

              {portfolio.excerpt && (
                <p className="text-sm text-muted leading-[1.5] line-clamp-3">
                  {portfolio.excerpt.rendered}
                </p>
              )}

              <div className="flex items-center gap-2 w-full">
                <Link href={`/portfolio/${portfolio.slug}`}>
                  <button className="text-sm border border-accent text-accent px-4 py-2 rounded-md hover:bg-accent hover:text-white transition-colors">
                    ดูรายละเอียด
                  </button>
                </Link>

                {/* Add website URL if available in ACF */}
                {portfolio.acf &&
                  typeof portfolio.acf === "object" &&
                  "website_url" in portfolio.acf && (
                    <Link
                      href={portfolio.acf.website_url as string}
                      target="_blank"
                    >
                      <button className="text-sm bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-1">
                        <ExternalLink size={14} />
                        <span>ดูเว็บไซต์</span>
                      </button>
                    </Link>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="flex flex-col gap-4 py-12 text-center items-center">
          <Globe size={48} color="#CBD5E0" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-muted thai-text">
              ยังไม่มีผลงานเว็บไซต์
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
