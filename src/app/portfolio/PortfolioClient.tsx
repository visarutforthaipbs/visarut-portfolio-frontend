"use client";

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { usePortfolios } from "@/hooks/useWordPress";
import { MarketplaceSearchBar } from "@/components/portfolio/MarketplaceSearchBar";
import { MarketplaceSidebar, ORGANIZATIONS } from "@/components/portfolio/MarketplaceSidebar";
import { MarketplaceGrid } from "@/components/portfolio/MarketplaceGrid";
import { MarketplaceQuickViewModal } from "@/components/portfolio/MarketplaceQuickViewModal";
import { matchOrganization } from "@/lib/portfolioOrganization";
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioClientProps {
  initialPortfolios: PortfolioItem[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function PortfolioClient({
  initialPortfolios,
  initialTotal,
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

  const { portfolios, loading, error, hasLoaded, retry } = usePortfolios({ all: true });
  const sourcePortfolios = hasLoaded ? portfolios : initialPortfolios;
  // Filter items by Search Query and Selected Organization
  const filteredPortfolios = useMemo(() => {
    return sourcePortfolios.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Organization filter
      if (selectedOrg !== "all") {
        if (!matchOrganization(item, selectedOrg)) {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
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

  const totalPages = Math.max(1, Math.ceil(filteredPortfolios.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const visiblePortfolios = filteredPortfolios.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
                สำรวจผลงานถ่ายภาพ วิดีโอ เว็บไซต์ และการสื่อสารข้อมูลเชิงภาพ (Data Storytelling) โดย วิศรุต แสนคำ
              </p>
            </div>

            <div className="text-xs text-dim bg-surface/60 border border-edge px-3.5 py-2 rounded-xl self-start md:self-auto">
              พบ <strong className="text-content">{filteredPortfolios.length}</strong> จากทั้งหมด{" "}
              <strong className="text-content">{hasLoaded ? sourcePortfolios.length : initialTotal}</strong> ผลงาน
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
              onOrgSelect={(value) => { setSelectedOrg(value); setCurrentPage(1); }}
              categoryCounts={categoryCounts}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Stream */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              {/* Search & Toolbar */}
              <MarketplaceSearchBar
                searchQuery={searchQuery}
                onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
                selectedCategory={selectedCategory}
                onCategorySelect={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={(value) => { setSortBy(value); setCurrentPage(1); }}
                onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                totalCount={filteredPortfolios.length}
                hasAdditionalFilters={selectedOrg !== "all"}
                additionalFilterLabel={selectedOrg === "all" ? undefined : ORGANIZATIONS.find(org => org.id === selectedOrg)?.label}
                onClearAdditionalFilters={() => { setSelectedOrg("all"); setCurrentPage(1); }}
              />

              {error && <div role="alert">โหลดข้อมูลล่าสุดไม่สำเร็จ <button onClick={retry} className="underline min-h-[44px]">ลองอีกครั้ง</button></div>}
              {/* Grid / List Results */}
              <MarketplaceGrid
                items={visiblePortfolios}
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
                    onClick={() => setCurrentPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium border border-edge bg-surface/50 text-content disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
                  >
                    ← ก่อนหน้า
                  </button>

                  <span className="text-xs text-dim px-3">
                    หน้า {page} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
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
