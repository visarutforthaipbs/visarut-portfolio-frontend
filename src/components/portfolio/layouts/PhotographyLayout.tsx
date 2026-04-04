import { Calendar, Camera } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface PhotographyLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function PhotographyLayout({
  portfolios,
  loading,
}: PhotographyLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="h-[300px] rounded-lg animate-pulse bg-surface" />
            <div className="flex flex-col gap-2 items-start mt-4">
              <div className="h-5 w-4/5 rounded animate-pulse bg-surface" />
              <div className="h-4 w-3/5 rounded animate-pulse bg-surface" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Photography Grid - Masonry Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/portfolio/${portfolio.slug}`}>
            <div className="bg-surface rounded-lg overflow-hidden border border-edge hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="aspect-[4/3]">
                <img
                  src={portfolio.featured_image?.url || "/placeholder-image.jpg"}
                  alt={portfolio.title.rendered}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col gap-3 p-4 items-start">
                <div className="flex flex-col gap-2 items-start w-full">
                  <p className="text-lg font-semibold text-content leading-[1.4] line-clamp-2">
                    {portfolio.title.rendered}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-dim">
                    <span className="flex items-center gap-1">
                      <Camera size={14} />
                      <span>ภาพถ่าย</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(portfolio.date).getFullYear()}</span>
                    </span>
                  </div>
                </div>

                {portfolio.excerpt && (
                  <p className="text-sm text-muted leading-[1.5] line-clamp-2">
                    {portfolio.excerpt.rendered}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs">
                    Photography
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="flex flex-col gap-4 py-12 text-center items-center">
          <Camera size={48} color="#CBD5E0" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-muted thai-text">
              ยังไม่มีผลงานภาพถ่าย
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
