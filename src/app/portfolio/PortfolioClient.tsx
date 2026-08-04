"use client";

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { MarketplaceSearchBar } from "@/components/portfolio/MarketplaceSearchBar";
import { MarketplaceSidebar } from "@/components/portfolio/MarketplaceSidebar";
import { MarketplaceGrid } from "@/components/portfolio/MarketplaceGrid";
import { MarketplaceQuickViewModal } from "@/components/portfolio/MarketplaceQuickViewModal";
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
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [activeQuickView, setActiveQuickView] = useState<PortfolioItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // Larger page size for marketplace layout

  const { portfolios, loading, total, totalPages } = usePortfolios({
    per_page: itemsPerPage,
    page: currentPage,
    categories: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const sourcePortfolios =
    currentPage === 1 && selectedCategory === "all" && loading && portfolios.length === 0
      ? initialPortfolios
      : portfolios.length > 0
      ? portfolios
      : initialPortfolios;

  // Filter items by Search Query and Selected Organization
  const filteredPortfolios = useMemo(() => {
    return sourcePortfolios.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Organization filter
      if (selectedOrg !== "all") {
        const itemContent = JSON.stringify(item).toLowerCase();
        if (!itemContent.includes(selectedOrg.toLowerCase())) {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleStr = typeof item.title === "string" ? item.title : item.title.rendered;
        const excerptStr = item.excerpt
          ? typeof item.excerpt === "string"
            ? item.excerpt
            : item.excerpt.rendered
          : "";
        const acfStr = JSON.stringify(item.acf || {});

        const combined = (titleStr + " " + excerptStr + " " + acfStr).toLowerCase();
        return combined.includes(q);
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
      }
      if (sortBy === "title") {
        const titleA = typeof a.title === "string" ? a.title : a.title.rendered;
        const titleB = typeof b.title === "string" ? b.title : b.title.rendered;
        return titleA.localeCompare(titleB, "th");
      }
      // default: latest
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  }, [sourcePortfolios, selectedCategory, selectedOrg, searchQuery, sortBy]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sourcePortfolios.length };
    sourcePortfolios.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [sourcePortfolios]);

  return (
    <Layout>
      {/* Header Banner */}
      <section
        className="bg-base py-12 md:py-16 border-b border-edge/60"
        role="region"
        aria-label="หัวข้อผลงาน"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2 block">
                Creative Catalog &amp; Works Archive
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-content tracking-tight">
                คลังผลงานทั้งหมด
              </h1>
              <p className="text-sm md:text-base text-muted mt-2 max-w-xl">
                สำรวจผลงานถ่ายภาพ วิดีโอ เว็บไซต์ และการสื่อสารข้อมูลเชิงภาพ (Data Storytelling) โดย วิศรุต สังข์ขำ
              </p>
            </div>

            <div className="text-xs text-dim bg-surface/60 border border-edge px-3.5 py-2 rounded-xl self-start md:self-auto">
              แสดง <strong className="text-content">{filteredPortfolios.length}</strong> จากทั้งหมด{" "}
              <strong className="text-content">{initialTotal || sourcePortfolios.length}</strong> ผลงาน
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Area */}
      <section
        className="bg-base py-8 md:py-12 min-h-screen"
        role="region"
        aria-label="แคตตาล็อกผลงาน"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop & Mobile Filter Sidebar */}
            <MarketplaceSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              selectedOrg={selectedOrg}
              onOrgSelect={setSelectedOrg}
              categoryCounts={categoryCounts}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Stream */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Search & Toolbar */}
              <MarketplaceSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategorySelect={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                totalCount={filteredPortfolios.length}
              />

              {/* Grid / List Results */}
              <MarketplaceGrid
                items={filteredPortfolios}
                viewMode={viewMode}
                onQuickView={(item) => setActiveQuickView(item)}
                isLoading={loading && sourcePortfolios.length === 0}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="การแบ่งหน้า"
                  className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-edge/60"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-edge bg-surface/50 text-content disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
                  >
                    ← ก่อนหน้า
                  </button>

                  <span className="text-xs text-dim px-3">
                    หน้า {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-edge bg-surface/50 text-content disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
                  >
                    ถัดไป →
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Drawer Modal */}
      <MarketplaceQuickViewModal
        portfolio={activeQuickView}
        onClose={() => setActiveQuickView(null)}
      />
    </Layout>
  );
}
