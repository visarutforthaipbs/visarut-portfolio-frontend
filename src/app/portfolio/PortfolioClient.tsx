"use client";

import Link from "next/link";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioClientProps {
  initialPortfolios: PortfolioItem[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function PortfolioClient({
  initialPortfolios,
  initialTotal,
  initialTotalPages,
}: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { portfolios, loading, total, totalPages } = usePortfolios({
    per_page: itemsPerPage,
    page: currentPage,
    categories: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const displayPortfolios =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialPortfolios
      : portfolios;

  const displayTotal =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialTotal
      : total;

  const displayTotalPages =
    currentPage === 1 && selectedCategory === "all" && loading
      ? initialTotalPages
      : totalPages;

  const filterOptions = [
    { value: "all", label: "ทั้งหมด" },
    ...Object.entries(PORTFOLIO_CATEGORIES).map(([key, label]) => ({
      value: key,
      label,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Hero */}
      <section
        className="bg-base py-20 md:py-28 flex justify-center w-full"
        role="region"
        aria-label="ผลงาน"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
              ผลงาน
            </h1>
            <p className="text-base md:text-lg text-muted leading-[1.8]">
              รวมผลงานถ่ายภาพ วิดีโอ เว็บไซต์ และการออกแบบ
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Content */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="รายการผลงาน"
      >
        <div className="max-w-5xl mx-auto px-5 md:px-6 w-full">
          <div className="flex flex-col gap-8 w-full">
            {/* Category Filter */}
            <div className="flex items-center gap-3 justify-center flex-wrap" role="tablist" aria-label="ตัวกรองหมวดหมู่">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCategoryChange(option.value)}
                  className={`text-sm transition-colors duration-150 bg-transparent border-none cursor-pointer ${
                    selectedCategory === option.value
                      ? "text-content"
                      : "text-dim hover:text-content"
                  }`}
                  role="tab"
                  aria-selected={selectedCategory === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            {displayPortfolios.length > 0 ? (
              <>
                <div className="w-full columns-1 md:columns-2 lg:columns-3 gap-6">
                  {displayPortfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </div>

                {/* Pagination */}
                {displayTotalPages > 1 && (
                  <nav aria-label="การแบ่งหน้า" className="flex items-center gap-6 justify-center mt-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`text-sm bg-transparent border-none transition-colors duration-150 ${
                        currentPage === 1
                          ? "text-edge cursor-default"
                          : "text-muted hover:text-content cursor-pointer"
                      }`}
                    >
                      ← ก่อนหน้า
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, displayTotalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`text-sm bg-transparent border-none cursor-pointer transition-colors duration-150 ${
                              currentPage === page
                                ? "font-medium text-content"
                                : "text-dim hover:text-content"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(displayTotalPages, currentPage + 1))}
                      disabled={currentPage === displayTotalPages}
                      className={`text-sm bg-transparent border-none transition-colors duration-150 ${
                        currentPage === displayTotalPages
                          ? "text-edge cursor-default"
                          : "text-muted hover:text-content cursor-pointer"
                      }`}
                    >
                      ถัดไป →
                    </button>
                  </nav>
                )}

                {/* Results Info */}
                <span className="text-xs text-dim text-center">
                  {displayPortfolios.length} / {displayTotal}
                </span>
              </>
            ) : (
              <div className="text-center py-12">
                <button
                  className="text-sm text-dim hover:text-content cursor-pointer bg-transparent border-none transition-colors"
                  onClick={() => handleCategoryChange("all")}
                >
                  ไม่พบผลงาน — ดูทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  return (
    <Link href={`/portfolio/${portfolio.slug}`} aria-label={portfolio.title.rendered.replace(/<[^>]*>/g, '')}>
      <article className="cursor-pointer group mb-6" style={{ breakInside: "avoid" }}>
        <div className="overflow-hidden rounded-md bg-surface">
          <img
            src={portfolio.featured_image?.url || "/placeholder-image.svg"}
            alt={portfolio.title.rendered}
            className="w-full h-auto block object-cover transition-opacity duration-200 group-hover:opacity-85"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
          />
        </div>

        <div className="flex flex-col items-start gap-1 mt-3">
          <span className="text-xs text-dim uppercase tracking-[0.05em]">
            {PORTFOLIO_CATEGORIES[portfolio.category] || portfolio.category}
          </span>
          <span className="text-sm md:text-base font-medium text-content leading-[1.4] line-clamp-2">
            {portfolio.title.rendered}
          </span>
        </div>
      </article>
    </Link>
  );
}
