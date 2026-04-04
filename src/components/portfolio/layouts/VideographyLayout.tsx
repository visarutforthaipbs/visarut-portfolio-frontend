import { Calendar, Video, Play } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

interface VideographyLayoutProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

export function VideographyLayout({
  portfolios,
  loading,
}: VideographyLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="h-[250px] rounded-lg animate-pulse bg-surface" />
            <div className="flex flex-col gap-2 items-start mt-4">
              <div className="h-6 w-4/5 rounded animate-pulse bg-surface" />
              <div className="h-4 w-3/5 rounded animate-pulse bg-surface" />
              <div className="h-10 w-[120px] rounded animate-pulse bg-surface" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Video Grid - Larger Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="bg-surface rounded-xl overflow-hidden border border-edge hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative">
              <div className="aspect-video">
                <img
                  src={portfolio.featured_image?.url || "/placeholder-video.jpg"}
                  alt={portfolio.title.rendered}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 rounded-full p-4 hover:bg-black/80 transition-all duration-200">
                <Play size={24} color="white" fill="white" />
              </div>

              {/* Video Badge */}
              <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                VIDEO
              </span>
            </div>

            <div className="flex flex-col gap-4 p-6 items-start">
              <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-xl font-semibold text-content leading-[1.4] line-clamp-2">
                  {portfolio.title.rendered}
                </p>

                <div className="flex items-center gap-4 text-sm text-dim">
                  <span className="flex items-center gap-1">
                    <Video size={14} />
                    <span>วีดีโอกราฟี</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(portfolio.date).getFullYear()}</span>
                  </span>
                </div>
              </div>

              {portfolio.excerpt && (
                <p className="text-sm text-muted leading-[1.6] line-clamp-3">
                  {portfolio.excerpt.rendered}
                </p>
              )}

              <Link href={`/portfolio/${portfolio.slug}`}>
                <button className="text-sm bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/80 transition-colors">
                  ดูผลงาน
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {portfolios.length === 0 && (
        <div className="flex flex-col gap-4 py-12 text-center items-center">
          <Video size={48} color="#CBD5E0" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-muted thai-text">
              ยังไม่มีผลงานวีดีโอกราฟี
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
