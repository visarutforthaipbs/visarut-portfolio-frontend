"use client";

import { useParams, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES, PortfolioCategory } from "@/types/portfolio";
import { PhotographyLayout } from "@/components/portfolio/layouts/PhotographyLayout";
import { VideographyLayout } from "@/components/portfolio/layouts/VideographyLayout";
import { VideoEditingLayout } from "@/components/portfolio/layouts/VideoEditingLayout";
import { WebsiteLayout } from "@/components/portfolio/layouts/WebsiteLayout";
import { GraphicDesignLayout } from "@/components/portfolio/layouts/GraphicDesignLayout";
import { DefaultLayout } from "@/components/portfolio/layouts/DefaultLayout";

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;

  // Validate category
  if (!category || !(category in PORTFOLIO_CATEGORIES)) {
    notFound();
  }

  const typedCategory = category as PortfolioCategory;
  const { portfolios, loading, error } = usePortfolios({
    categories: typedCategory,
    per_page: 20,
  });

  const categoryName = PORTFOLIO_CATEGORIES[typedCategory];

  // Render category-specific layout
  const renderCategoryLayout = () => {
    const props = { portfolios, loading };

    switch (typedCategory) {
      case "photography":
        return <PhotographyLayout {...props} />;
      case "videography":
        return <VideographyLayout {...props} />;
      case "video-editing":
        return <VideoEditingLayout {...props} />;
      case "website":
        return <WebsiteLayout {...props} />;
      case "graphic-design":
        return <GraphicDesignLayout {...props} />;
      case "print":
      case "exhibition":
      case "campaign":
      case "producer":
      default:
        return <DefaultLayout {...props} category={typedCategory} />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center w-full">
          <div className="max-w-5xl w-full py-16 md:py-20 px-5 md:px-6">
            <div className="flex flex-col gap-8 items-start">
              <div className="h-5 w-[300px] animate-pulse bg-surface rounded" />
              <div className="h-[60px] w-4/5 animate-pulse bg-surface rounded" />
              <div className="h-[400px] w-full animate-pulse bg-surface rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center w-full">
          <div className="max-w-5xl w-full py-16 md:py-20 px-5 md:px-6">
            <div className="flex flex-col gap-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-content">
                เกิดข้อผิดพลาด
              </h1>
              <p className="text-dim thai-text">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center w-full">
        <div className="max-w-5xl w-full py-16 md:py-20 px-5 md:px-6">
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Navigation */}
            <div className="flex items-center gap-2 text-sm text-dim">
              <Link href="/" className="thai-text hover:text-accent">
                หน้าหลัก
              </Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-accent">
                ผลงาน
              </Link>
              <span>/</span>
              <span className="thai-text">{categoryName}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex items-center gap-4">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2 text-dim hover:text-accent transition-colors">
                    <ArrowLeft size={20} />
                    <span className="thai-text">กลับไปดูผลงานทั้งหมด</span>
                  </span>
                </Link>
              </div>

              <div className="flex flex-col gap-2 items-start">
                <h1 className="text-2xl md:text-4xl text-content font-bold">
                  {categoryName}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="bg-accent-dim text-accent px-3 py-1 rounded-full text-sm">
                    {portfolios.length} ผลงาน
                  </span>
                </div>
              </div>
            </div>

            {/* Category-specific layout */}
            {renderCategoryLayout()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
