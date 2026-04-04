"use client";

import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES, PortfolioItem } from "@/types/portfolio";
import { WordPressContent } from "@/components/WordPressContent";
import PortfolioVideo from "@/components/PortfolioVideo";
import {
  PortfolioACFDisplay,
  PortfolioGallery,
} from "@/components/portfolio/PortfolioDetails";
import { WordPressAPI } from "@/lib/wordpress";
import { usePortfolioBySlug } from "@/hooks/useWordPress";

interface PortfolioDetailClientProps {
  slug: string;
  initialData?: PortfolioItem;
}

export default function PortfolioDetailClient({
  slug,
  initialData,
}: PortfolioDetailClientProps) {
  const { portfolio, loading, error } = usePortfolioBySlug(slug, initialData);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 md:py-28 flex justify-center w-full">
          <div className="max-w-3xl mx-auto px-5 md:px-6 w-full">
            <div className="flex flex-col gap-6 items-start">
              <div className="h-10 w-3/5 animate-pulse bg-surface rounded" />
              <div className="h-[200px] md:h-[400px] w-full animate-pulse bg-surface rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="py-20 md:py-28 flex justify-center w-full">
          <div className="max-w-3xl mx-auto px-5 md:px-6 w-full">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm text-muted">
                ไม่พบผลงาน
              </p>
              <Link href="/portfolio">
                <span className="text-sm text-dim hover:text-content transition-colors">
                  ← กลับไปผลงาน
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const videos = WordPressAPI.extractVideoEmbeds(portfolio.content.rendered);

  return (
    <Layout>
      {/* Hero */}
      <article className="bg-base py-20 md:py-28 flex justify-center w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-6 w-full">
          <div className="flex flex-col gap-6 items-start">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-dim">
              <Link href="/portfolio">
                <span className="hover:text-content transition-colors duration-150">
                  ผลงาน
                </span>
              </Link>
              <span>/</span>
              <span>{PORTFOLIO_CATEGORIES[portfolio.category]}</span>
            </div>

            {/* Title & Meta */}
            <div className="flex flex-col gap-3 items-start w-full">
              <h1 className="text-2xl md:text-3xl font-bold text-content leading-[1.3] tracking-tight">
                {portfolio.title.rendered}
              </h1>

              <div className="flex items-center gap-3 text-xs text-dim">
                <span className="uppercase tracking-widest">
                  {PORTFOLIO_CATEGORIES[portfolio.category]}
                </span>
                <span>·</span>
                <span>
                  {new Date(portfolio.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {portfolio.featured_image && portfolio.category !== "photography" && (
              <div className="w-full overflow-hidden rounded-md">
                <img
                  src={portfolio.featured_image.url}
                  alt={portfolio.title.rendered}
                  className="w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.svg";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Content */}
      <div className="bg-base py-16 md:py-24 flex justify-center w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-6 w-full">
          <div className="flex flex-col gap-12 items-start [&_.wordpress-content]:w-full [&_.wordpress-content]:flex [&_.wordpress-content]:flex-wrap [&_.wordpress-content]:gap-4 [&_.wordpress-content]:justify-center [&_.wordpress-content]:items-start [&_.wordpress-content>p:empty]:hidden [&_iframe]:max-w-full [&_iframe]:rounded-lg [&_.blog-content]:w-full">
            {/* ACF Project Details */}
            <PortfolioACFDisplay portfolio={portfolio} />

            {/* Content by Category */}
            {portfolio.category === "photography" ? (
              <>
                <PortfolioGallery portfolio={portfolio} />
                {portfolio.excerpt && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-dim mb-4">
                      รายละเอียด
                    </p>
                    <p className="text-base text-muted leading-[1.8]">
                      <WordPressContent content={portfolio.excerpt.rendered} />
                    </p>
                  </div>
                )}
              </>
            ) : portfolio.category === "videography" || portfolio.category === "video-editing" ? (
              <>
                {videos.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs uppercase tracking-[0.1em] text-dim mb-6">
                      วีดีโอ ({videos.length})
                    </p>
                    <div className="flex flex-col gap-8 w-full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </div>
                  </div>
                )}
                <PortfolioGallery portfolio={portfolio} />
                {portfolio.content && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-dim mb-4">
                      รายละเอียด
                    </p>
                    <div className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {portfolio.content && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-dim mb-4">
                      รายละเอียด
                    </p>
                    <div className="blog-content">
                      <WordPressContent content={portfolio.content.rendered} />
                    </div>
                  </div>
                )}
                {videos.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs uppercase tracking-[0.1em] text-dim mb-6">
                      วีดีโอ
                    </p>
                    <div className="flex flex-col gap-6 w-full">
                      {videos.map((video, index) => (
                        <PortfolioVideo key={index} video={video} />
                      ))}
                    </div>
                  </div>
                )}
                {portfolio.category !== "producer" && (
                  <PortfolioGallery portfolio={portfolio} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="w-full flex justify-center bg-base">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      <div className="bg-base py-12 md:py-16 flex justify-center w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-6 w-full">
          <div className="flex items-center gap-6 justify-center">
            <Link href="/portfolio">
              <span className="text-sm text-dim hover:text-content transition-colors duration-150">
                ← ผลงานทั้งหมด
              </span>
            </Link>
            <Link href={`/portfolio/category/${portfolio.category}`}>
              <span className="text-sm text-dim hover:text-content transition-colors duration-150">
                {PORTFOLIO_CATEGORIES[portfolio.category]} →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
