"use client";

import Link from "next/link";
import { Layout } from "@/components/layout";
import { PORTFOLIO_CATEGORIES, PortfolioItem } from "@/types/portfolio";
import { PortfolioCaseStudy } from "@/components/portfolio/PortfolioCaseStudy";
import { preparePortfolioDetail } from "@/lib/portfolioDetailContent";
import { usePortfolioBySlug } from "@/hooks/useWordPress";

interface PortfolioDetailClientProps {
  slug: string;
  initialData?: PortfolioItem;
}

const decodeEntities = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const linkClass =
  "inline-flex items-center min-h-[36px] px-2 rounded-lg text-sm text-dim hover:text-content hover:bg-surface transition-colors duration-150";

export default function PortfolioDetailClient({
  slug,
  initialData,
}: PortfolioDetailClientProps) {
  const { portfolio, loading, error } = usePortfolioBySlug(slug, initialData);

  if (loading) {
    return (
      <Layout>
        <div className="py-16 md:py-20 flex justify-center w-full">
          <div className="max-w-6xl mx-auto px-5 md:px-6 w-full">
            <div className="flex flex-col gap-6 items-start">
              <div className="h-10 w-3/5 animate-pulse bg-surface rounded" />
              <div className="h-[220px] md:h-[480px] w-full animate-pulse bg-surface rounded-2xl" />
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
              <p className="text-sm text-muted">ไม่พบผลงาน</p>
              <Link href="/portfolio" className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm text-dim hover:text-content hover:bg-surface transition-colors">
                ← กลับไปผลงาน
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const detail = preparePortfolioDetail(portfolio);
  const categoryLabel = PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category;

  const breadcrumb = (
    <nav aria-label="เส้นทางหน้า" className="flex items-center gap-1 text-sm text-dim">
      <Link href="/portfolio" className="inline-flex items-center min-h-[32px] px-1.5 -ml-1.5 rounded-md hover:text-content hover:bg-surface transition-colors duration-150">
        ผลงาน
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={`/portfolio/category/${portfolio.category}`} className="inline-flex items-center min-h-[32px] px-1.5 rounded-md hover:text-content hover:bg-surface transition-colors duration-150">
        {categoryLabel}
      </Link>
    </nav>
  );

  return (
    <Layout>
      <PortfolioCaseStudy
        title={decodeEntities(portfolio.title.rendered)}
        categoryLabel={categoryLabel}
        detail={detail}
        breadcrumb={breadcrumb}
      />

      <nav aria-label="ผลงานอื่น" className="bg-canvas border-t border-edge w-full">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-8 flex items-center justify-between gap-4">
          <Link href="/portfolio" className={linkClass}>
            ← ผลงานทั้งหมด
          </Link>
          <Link href={`/portfolio/category/${portfolio.category}`} className={linkClass}>
            ผลงาน{categoryLabel}อื่น ๆ →
          </Link>
        </div>
      </nav>
    </Layout>
  );
}
