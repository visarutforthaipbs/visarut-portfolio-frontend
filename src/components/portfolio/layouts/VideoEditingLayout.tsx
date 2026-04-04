import { Calendar, Scissors, Play } from "lucide-react";
import Link from "next/link";
import { PortfolioItem } from "@/types/portfolio";

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
              <div className="aspect-[16/10]">
                <img
                  src={portfolio.featured_image?.url || "/placeholder-video.jpg"}
                  alt={portfolio.title.rendered}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 rounded-full p-3 hover:bg-black/80 transition-all duration-200">
                <Play size={20} color="white" fill="white" />
              </div>

              {/* Video Editing Badge */}
              <span className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-md text-xs">
                EDIT
              </span>
            </div>

            <div className="flex flex-col gap-3 p-4 items-start">
              <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-base font-semibold text-content leading-[1.4] line-clamp-2">
                  {portfolio.title.rendered}
                </p>

                <div className="flex items-center gap-4 text-sm text-dim">
                  <span className="flex items-center gap-1">
                    <Scissors size={14} />
                    <span>ตัดต่อวีดีโอ</span>
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

              <Link href={`/portfolio/${portfolio.slug}`}>
                <button className="text-sm border border-accent text-accent px-4 py-2 rounded-md hover:bg-accent hover:text-white transition-colors">
                  ดูผลงาน
                </button>
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
