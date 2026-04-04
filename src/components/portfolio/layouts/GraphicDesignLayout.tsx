import { Calendar, Palette } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface GraphicDesignLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function GraphicDesignLayout({
  portfolios,
  loading,
}: GraphicDesignLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="h-[250px] rounded-lg animate-pulse bg-surface" />
            <div className="flex flex-col gap-1 items-start mt-3">
              <div className="h-4 w-4/5 rounded animate-pulse bg-surface" />
              <div className="h-3.5 w-3/5 rounded animate-pulse bg-surface" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Graphic Design Grid - Pinterest Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {portfolios.map((portfolio) => (
          <Link key={portfolio.id} href={`/portfolio/${portfolio.slug}`}>
            <div className="bg-surface rounded-lg overflow-hidden border border-edge hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className="aspect-[3/4]">
                <img
                  src={portfolio.featured_image?.url || "/placeholder-design.jpg"}
                  alt={portfolio.title.rendered}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col gap-2 p-3 items-start">
                <p className="text-sm font-semibold text-content leading-[1.3] line-clamp-2">
                  {portfolio.title.rendered}
                </p>

                <div className="flex items-center gap-3 text-xs text-dim">
                  <span className="flex items-center gap-1">
                    <Palette size={12} />
                    <span>กราฟิก</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(portfolio.date).getFullYear()}</span>
                  </span>
                </div>

                <span className="bg-pink-50 text-pink-600 px-2 py-1 rounded-md text-xs">
                  Design
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="flex flex-col gap-4 py-12 text-center items-center">
          <Palette size={48} color="#CBD5E0" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-muted thai-text">
              ยังไม่มีผลงานออกแบบกราฟิก
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
